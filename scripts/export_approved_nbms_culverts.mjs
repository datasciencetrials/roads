import fs from 'node:fs/promises';
import path from 'node:path';
import ExcelJS from 'exceljs';

const sourcePath = process.argv[2];
const outputPath = process.argv[3] || path.resolve('public/data/major_culverts_approved.geojson');
if (!sourcePath) throw new Error('Usage: node scripts/export_approved_nbms_culverts.mjs <source.xlsx> [output.geojson]');

const workbook = new ExcelJS.Workbook();
await workbook.xlsx.readFile(sourcePath);
const sheet = workbook.getWorksheet('MAJOR CULVERTS 2026');
if (!sheet) throw new Error('Worksheet MAJOR CULVERTS 2026 was not found');

const scalar = value => {
  if (value == null || typeof value !== 'object') return value;
  if ('result' in value) return value.result;
  if ('text' in value) return value.text;
  if (Array.isArray(value.richText)) return value.richText.map(part => part.text || '').join('');
  return '';
};
const text = value => {
  const resolved = scalar(value);
  return resolved == null ? '' : String(resolved).trim();
};
const number = value => {
  const parsed = Number(scalar(value));
  return Number.isFinite(parsed) ? parsed : null;
};
const surfaceType = value => /bituminous|asphalt|concrete|paved/i.test(text(value)) ? 'Paved' : 'Unpaved';

const features = [];
for (let rowNumber = 2; rowNumber <= sheet.rowCount; rowNumber += 1) {
  const row = sheet.getRow(rowNumber);
  const culvertNumber = text(row.getCell(1).value);
  if (!culvertNumber) continue;
  const longitude = number(row.getCell(19).value);
  const latitude = number(row.getCell(20).value);
  features.push({
    type: 'Feature',
    id: rowNumber - 2,
    geometry: longitude != null && latitude != null
      ? { type: 'Point', coordinates: [longitude, latitude] }
      : null,
    properties: {
      asset_uid: `${culvertNumber}-${String(rowNumber - 1).padStart(3, '0')}`,
      culvert_n: culvertNumber,
      structure_type: 'Major Culvert',
      type: text(row.getCell(16).value) || 'Major Culvert',
      link_no: text(row.getCell(47).value) || text(row.getCell(12).value),
      link_name: text(row.getCell(49).value) || text(row.getCell(14).value),
      road: text(row.getCell(14).value) || text(row.getCell(49).value),
      district: text(row.getCell(21).value),
      maintenance_station: text(row.getCell(54).value),
      region: text(row.getCell(55).value),
      surface_t: surfaceType(row.getCell(53).value),
      chainage_km: number(row.getCell(15).value),
      overall_rating: number(row.getCell(64).value),
      source: 'Bridges and Culverts 2026-FINAL 3.xlsx',
    },
  });
}

if (features.length !== 452) {
  throw new Error(`Expected 452 governed Major Culverts, found ${features.length}`);
}

await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.writeFile(outputPath, `${JSON.stringify({
  type: 'FeatureCollection',
  name: 'Approved Major Culverts 2026',
  crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
  metadata: {
    source: 'Bridges and Culverts 2026-FINAL 3.xlsx',
    worksheet: 'MAJOR CULVERTS 2026',
    population: 452,
    surface_type_domain: ['Paved', 'Unpaved'],
  },
  features,
}, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ outputPath, features: features.length }));
