import { useState } from 'react';
import {
  Download, FileJson, Map, Table, Globe,
  FileText, Info, CheckCircle,
} from 'lucide-react';
import { useBMS } from '../../store/BMSContext';
import {
  downloadCSV, downloadGeoJSON, downloadKML,
} from '../../utils/downloads';

interface ExportCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge: string;
  badgeColor: string;
  action: () => void;
  size?: string;
}

export default function DownloadsView() {
  const { state } = useBMS();
  const { structures } = state;
  const [done, setDone] = useState<string | null>(null);

  const bridges  = structures.filter(s => s.type === 'bridge');
  const culverts = structures.filter(s => s.type === 'culvert');

  function withFeedback(key: string, fn: () => void) {
    return () => { fn(); setDone(key); setTimeout(() => setDone(null), 2500); };
  }

  const GEOSPATIAL: ExportCard[] = [
    {
      icon: <FileJson size={18} />,
      title: 'GeoJSON - All Structures',
      description: 'Current app data as GeoJSON FeatureCollection. Live snapshot matching displayed structures.',
      badge: 'GeoJSON',
      badgeColor: '#00f5ff',
      action: withFeedback('geojson-all', () =>
        downloadGeoJSON(structures, `Data Science Trials - Structures - ${new Date().toISOString().slice(0,10)}.geojson`)),
    },
    {
      icon: <Globe size={18} />,
      title: 'KML - Google Earth',
      description: 'Open in Google Earth Pro or Maps. Placemarks colour-coded by condition rating (1-5).',
      badge: 'KML',
      badgeColor: '#00ff88',
      action: withFeedback('kml', () =>
        downloadKML(structures, `Data Science Trials - Structures - ${new Date().toISOString().slice(0,10)}.kml`)),
    },
  ];

  const TABULAR: ExportCard[] = [
    {
      icon: <Table size={18} />,
      title: 'Full Structure Registry - CSV',
      description: `All ${structures.length} structures with 21 attribute columns. Opens in Excel.`,
      badge: 'CSV',
      badgeColor: '#ffd23f',
      action: withFeedback('csv-all', () =>
        downloadCSV(structures, `Data Science Trials - Structure Registry - ${new Date().toISOString().slice(0,10)}.csv`)),
    },
    {
      icon: <Table size={18} />,
      title: 'Bridges CSV',
      description: `${bridges.length} bridge records with full physical and condition data.`,
      badge: 'CSV',
      badgeColor: '#ffd23f',
      action: withFeedback('csv-brg', () =>
        downloadCSV(bridges, `Data Science Trials - Bridges - ${new Date().toISOString().slice(0,10)}.csv`)),
    },
    {
      icon: <Table size={18} />,
      title: 'Culverts CSV',
      description: `${culverts.length} major culvert records.`,
      badge: 'CSV',
      badgeColor: '#ffd23f',
      action: withFeedback('csv-cul', () =>
        downloadCSV(culverts, `Data Science Trials - Major Culverts - ${new Date().toISOString().slice(0,10)}.csv`)),
    },
  ];

  return (
    <div className="min-h-full bg-slate-950 text-slate-100 p-6 animate-fade-in">

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
            <Download size={16} className="text-blue-400" />
          </div>
          <h1 className="text-xl font-bold text-white">Downloads &amp; Exports</h1>
        </div>
        <p className="text-slate-400 text-sm ml-11">
          Export the displayed bridge and major culvert source extract. Geospatial coordinates use WGS84 (EPSG:4326).
        </p>

        {/* Stats strip */}
        <div className="ml-11 mt-4 flex flex-wrap gap-4">
          {[
            { label: 'Total Structures', value: structures.length, color: '#00f5ff' },
            { label: 'Bridges in extract', value: bridges.length,  color: '#4d9fff' },
            { label: 'Major Culverts',  value: culverts.length, color: '#b967ff' },
            { label: 'Critical',  value: structures.filter(s => s.conditionRating === 1).length, color: '#ff2d78' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2">
              <div className="text-xs text-slate-500 mb-0.5">{label}</div>
              <div className="text-lg font-bold" style={{ color }}>{value.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Geospatial section */}
      <Section title="Geospatial Formats" icon={<Map size={15} />}>
        <CardGrid cards={GEOSPATIAL} done={done} />
      </Section>

      {/* Tabular section */}
      <Section title="Tabular Data" icon={<FileText size={15} />}>
        <CardGrid cards={TABULAR} done={done} />
      </Section>

      {/* Info note */}
      <div className="mt-8 flex items-start gap-3 bg-slate-900 border border-slate-700 rounded-xl p-4 text-sm text-slate-400">
        <Info size={16} className="text-slate-500 mt-0.5 flex-shrink-0" />
        <div>
          This personal learning extract is not the approved FY 2026-27 count of 552 Bridges.
          The exported condition ratings are modelled, not verified inspection results.
          Coordinates are WGS84 decimal degrees.
        </div>
      </div>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-slate-400">{icon}</span>
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function CardGrid({ cards, done }: { cards: ExportCard[]; done: string | null }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {cards.map((card, i) => {
        const key = `card-${i}-${card.title}`;
        const isDone = done === Object.keys({ ...card }).find(k => k === 'action');
        return (
          <ExportCardUI key={key} card={card} isDone={false} />
        );
      })}
    </div>
  );
}

function ExportCardUI({ card, isDone }: { card: ExportCard; isDone: boolean }) {
  const [clicked, setClicked] = useState(false);

  function handleClick() {
    card.action();
    setClicked(true);
    setTimeout(() => setClicked(false), 2000);
  }

  return (
    <div className="group bg-slate-900 border border-slate-700 hover:border-slate-500 rounded-xl p-5 transition-all duration-200 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 group-hover:text-slate-200 transition-colors">{card.icon}</span>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded"
            style={{
              color: card.badgeColor,
              background: `${card.badgeColor}18`,
              border: `1px solid ${card.badgeColor}40`,
            }}
          >
            {card.badge}
          </span>
        </div>
        {card.size && (
          <span className="text-xs text-slate-600">{card.size}</span>
        )}
      </div>

      <div>
        <div className="text-sm font-semibold text-slate-200 mb-1">{card.title}</div>
        <div className="text-xs text-slate-500 leading-relaxed">{card.description}</div>
      </div>

      <button
        onClick={handleClick}
        className="mt-auto flex items-center justify-center gap-2 w-full py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-150"
        style={{
          background: clicked ? 'rgba(0, 255, 136,0.12)' : 'rgba(59,130,246,0.12)',
          border: clicked ? '1px solid rgba(0, 255, 136,0.4)' : '1px solid rgba(59,130,246,0.35)',
          color: clicked ? '#00ff88' : '#60a5fa',
        }}
      >
        {clicked
          ? <><CheckCircle size={14} /> Downloaded</>
          : <><Download size={14} /> Download</>
        }
      </button>
    </div>
  );
}
