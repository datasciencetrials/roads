import { useEffect, useState } from 'react';
import {
  DASH_C, KpiStrip, StatMini, SectionHdr, ChartGrid, ChartBox,
  BarH, DonutChart,
} from '../../../shared/dashboardKit';

type Summary = {
  total_bridges: number;
  total_culverts: number;
  bridges_with_gps: number;
  culverts_with_gps: number;
  condition_distribution_bridges: Record<string, number>;
  condition_distribution_culverts: Record<string, number>;
  by_structure_type_bridges: Record<string, number>;
  by_structure_type_culverts: Record<string, number>;
  by_road_class: Record<string, number>;
};

const APPROVED_FY_2026_27_BRIDGES = 552;
const colours = [DASH_C.cyan, DASH_C.purple, DASH_C.green, DASH_C.yellow, DASH_C.orange, DASH_C.blue, DASH_C.teal, '#ef4444', '#a78bfa', '#94a3b8'];

function entries(values: Record<string, number>) {
  return Object.entries(values).map(([name, count], index) => ({
    name: name === '-' ? 'Not recorded' : name,
    count,
    value: count,
    color: colours[index % colours.length],
  }));
}

function sum(values: Record<string, number>) {
  return Object.values(values).reduce((total, count) => total + count, 0);
}

function validCounts(values: Record<string, number> | undefined) {
  return !!values && Object.values(values).every(count => Number.isInteger(count) && count >= 0);
}

function CategoryBars({ values }: { values: Record<string, number> }) {
  const rows = Object.entries(values).sort((a, b) => b[1] - a[1]);
  const largest = Math.max(1, ...rows.map(([, count]) => count));
  return (
    <div style={{ height: '100%', overflowY: 'auto', display: 'grid', alignContent: 'start', gap: 7 }}>
      {rows.map(([name, count]) => (
        <div key={name} style={{ display: 'grid', gridTemplateColumns: 'minmax(130px, 42%) 1fr 36px', alignItems: 'center', gap: 8, minHeight: 25 }}>
          <span title={name} style={{ color: '#cbd5e1', fontSize: 11, overflowWrap: 'anywhere' }}>{name === '-' ? 'Not recorded' : name}</span>
          <span style={{ height: 10, borderRadius: 5, background: 'rgba(148,163,184,0.12)' }}>
            <span style={{ display: 'block', width: `${count / largest * 100}%`, height: '100%', borderRadius: 5, background: DASH_C.purple }} />
          </span>
          <strong style={{ color: '#e2e8f0', fontSize: 11, textAlign: 'right' }}>{count}</strong>
        </div>
      ))}
    </div>
  );
}

function validate(summary: Summary) {
  const bridgeKeys: (keyof Summary)[] = ['condition_distribution_bridges', 'by_structure_type_bridges'];
  const culvertKeys: (keyof Summary)[] = ['condition_distribution_culverts', 'by_structure_type_culverts'];
  if (!Number.isInteger(summary.total_bridges) || summary.total_bridges < 0 || summary.total_bridges > APPROVED_FY_2026_27_BRIDGES
    || !Number.isInteger(summary.total_culverts) || summary.total_culverts < 0
    || !Number.isInteger(summary.bridges_with_gps) || summary.bridges_with_gps < 0 || summary.bridges_with_gps > summary.total_bridges
    || !Number.isInteger(summary.culverts_with_gps) || summary.culverts_with_gps < 0 || summary.culverts_with_gps > summary.total_culverts
    || !validCounts(summary.by_road_class) || sum(summary.by_road_class) > summary.total_bridges) return false;
  if (![...bridgeKeys, ...culvertKeys].every(key => validCounts(summary[key] as Record<string, number>))) return false;
  return bridgeKeys.every(key => summary[key] && sum(summary[key] as Record<string, number>) === summary.total_bridges)
    && culvertKeys.every(key => summary[key] && sum(summary[key] as Record<string, number>) === summary.total_culverts);
}

export default function StructuresOverviewDashboard() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${import.meta.env.BASE_URL}data/bridges_summary.json`, { signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error(`Structure summary returned ${response.status}`);
        return response.json();
      })
      .then((data: Summary) => {
        if (!validate(data)) throw new Error('Structure summary categories do not reconcile with the complete population');
        setSummary(data);
      })
      .catch(cause => {
        if (cause instanceof Error && cause.name !== 'AbortError') setError(cause.message);
      });
    return () => controller.abort();
  }, []);

  if (error) return <p role="alert">Structure charts unavailable: {error}</p>;
  if (!summary) return <p role="status">Loading structure evidence...</p>;

  const roadClasses = { ...summary.by_road_class };
  const withoutRoadClass = summary.total_bridges - sum(roadClasses);
  if (withoutRoadClass > 0) roadClasses['Not recorded'] = withoutRoadClass;

  return (
    <div>
      <KpiStrip>
        <StatMini value={String(APPROVED_FY_2026_27_BRIDGES)} label="Bridges, FY 2026/27 approved baseline" color={DASH_C.cyan} />
        <StatMini value={String(summary.total_bridges)} label="Bridges in the 2026 source extract" color={DASH_C.purple} />
        <StatMini value={String(summary.total_culverts)} label="Major Culverts in the 2026 source extract" color={DASH_C.green} />
        <StatMini value={`${summary.bridges_with_gps}/${summary.total_bridges}`} label="Extract bridges with mapped coordinates" color={DASH_C.yellow} />
        <StatMini value={`${summary.culverts_with_gps}/${summary.total_culverts}`} label="Extract culverts with mapped coordinates" color={DASH_C.orange} />
      </KpiStrip>

      <SectionHdr accent={DASH_C.purple}>Structure inventory evidence</SectionHdr>
      <p>The FY 2026/27 approved bridge baseline is 552. The charts below use the separate 2026 source extract of {summary.total_bridges} bridges and {summary.total_culverts} Major Culverts because the extract does not state a financial year for every record. {summary.total_bridges < APPROVED_FY_2026_27_BRIDGES && 'Additional FY 2026/27 bridges are not assigned historical condition or type categories.'}</p>

      <ChartGrid cols="3">
        <ChartBox title="Bridge condition, complete 2026 extract" subtitle={`${summary.total_bridges} bridges, including missing condition`} accent={DASH_C.cyan} height={340}>
          <BarH data={entries(summary.condition_distribution_bridges)} yKey="name" series={[{ key: 'count', name: 'Bridges', color: DASH_C.cyan }]} />
        </ChartBox>
        <ChartBox title="Major Culvert condition, complete 2026 extract" subtitle={`${summary.total_culverts} culverts`} accent={DASH_C.green} height={340}>
          <BarH data={entries(summary.condition_distribution_culverts)} yKey="name" series={[{ key: 'count', name: 'Major Culverts', color: DASH_C.green }]} />
        </ChartBox>
        <ChartBox title="Major Culverts by type" subtitle={`${summary.total_culverts} culverts`} accent={DASH_C.yellow} height={340}>
          <DonutChart data={entries(summary.by_structure_type_culverts)} />
        </ChartBox>
      </ChartGrid>

      <ChartGrid cols="2">
        <ChartBox title="Bridges by structural type" subtitle={`${summary.total_bridges} bridges, all recorded categories`} accent={DASH_C.purple} height={420}>
          <CategoryBars values={summary.by_structure_type_bridges} />
        </ChartBox>
        <ChartBox title="Bridges by road class" subtitle={`${summary.total_bridges} bridges, including unclassified`} accent={DASH_C.teal} height={420}>
          <BarH data={entries(roadClasses)} yKey="name" series={[{ key: 'count', name: 'Bridges', color: DASH_C.teal }]} />
        </ChartBox>
      </ChartGrid>
    </div>
  );
}
