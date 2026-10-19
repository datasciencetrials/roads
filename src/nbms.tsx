/**
 * nbms.tsx - standalone entry for the Uganda National Bridge Management System.
 * Mounts ONLY the BMS section (Dashboard · Structure Map · Inventory & Condition
 * incl. the Digital Twin · Bridge Works) in the providers it needs, with its own
 * branded header. Deployed separately to networkengineringmowt-ai/uganda_nbms.
 *
 * This public deployment is a read-only data view. Operational authentication
 * and field-capture workflows remain separate from this public entry point.
 */
import { StrictMode, Suspense, lazy, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './styles/transitions.css';
import { BMSProvider } from './store/BMSContext';
import { BotHighlightContext } from './modules/AssetBot/types';

const BMSSection = lazy(() => import('./modules/BMS/BMSSection'));

function Header() {
  return (
    <header style={{
      display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0,
      padding: '8px 16px', background: 'rgba(2,2,2,0.9)',
      borderBottom: '1px solid rgba(0, 245, 255,0.15)',
      width: '100%', minWidth: 0,
    }}>
      <img src={`${import.meta.env.BASE_URL}mowt.jpg`} alt="MoWT"
        style={{ width: 32, height: 32, borderRadius: 8, objectFit: 'contain',
          background: '#fff', padding: 2, border: '1px solid rgba(0, 245, 255,0.3)' }} />
      <div style={{ lineHeight: 1.25, flex: 1, minWidth: 0 }}>

        <div style={{background:'rgba(14,165,233,0.04)',border:'1px solid rgba(14,165,233,0.14)',borderRadius:10,padding:'10px 16px',marginBottom:16,display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
          <span style={{fontSize:15,fontWeight:800,color:'rgba(14,165,233,1)',letterSpacing:-0.3,overflowWrap:'anywhere'}}>National Bridge Management System</span>
          <span style={{fontSize:11,color:'#94a3b8',fontWeight:500}}>NBMS · MoWT · NBI Protocol · AfDB Standards</span>
        </div>
        <div style={{ fontSize: 14, fontWeight: 900, color: '#00f5ff', letterSpacing: '0.04em', overflowWrap: 'anywhere' }}>
          Uganda National Bridge Management System
        </div>
        <div style={{ fontSize: 9.5, color: 'rgba(148,163,184,0.6)' }}>
          Ministry of Works &amp; Transport · Department of National Roads · NBMS
        </div>
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00ff88',
          boxShadow: '0 0 6px #00ff88' }} />
        <span style={{ fontSize: 9.5, color: 'rgba(0, 255, 136,0.7)', fontWeight: 700 }}>System Online</span>
      </div>
    </header>
  );
}

function ModuleSpinner() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <div style={{ width: 30, height: 30, borderRadius: '50%',
        border: '2px solid rgba(75,99,130,0.4)', borderTopColor: '#00f5ff',
        animation: 'bms-spin 0.8s linear infinite' }} />
    </div>
  );
}

function PublicNBMSView() {
  return (
    <div style={{ height: '100vh', width: '100vw', maxWidth: '100vw', minWidth: 0,
      display: 'flex', flexDirection: 'column', background: '#000000', overflow: 'hidden' }}>
      <Header />
      <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%', overflow: 'hidden' }}>
        <Suspense fallback={<ModuleSpinner />}>
          <BMSSection />
        </Suspense>
      </div>
    </div>
  );
}

function NBMSApp() {
  const [highlightedLinks, setHighlightedLinks] = useState<string[]>([]);
  return (
    <BotHighlightContext.Provider value={{ highlightedLinks, setHighlightedLinks }}>
      <BMSProvider>
        <PublicNBMSView />
      </BMSProvider>
    </BotHighlightContext.Provider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NBMSApp />
  </StrictMode>,
);
