import React, { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import CommandOverview from './components/CommandOverview.jsx';
import ETFMatrix from './components/ETFMatrix.jsx';
import FundComparator from './components/FundComparator.jsx';
import FundModal from './components/FundModal.jsx';
import TutorialModal from './components/TutorialModal.jsx';
import { ALL_ETFS, METADATA } from './data/etfService.js';

export default function App() {
  const [view, setView] = useState('overview');
  const [currency, setCurrency] = useState('ZAR');
  const [selectedETF, setSelectedETF] = useState(null);
  const [compareIds, setCompareIds] = useState([]);
  const [showTutorial, setShowTutorial] = useState(true); // auto-open on first load

  function toggleCompare(id) {
    setCompareIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 3) return prev; // cap at 3
      return [...prev, id];
    });
  }

  function handleSelectETF(etf) {
    setSelectedETF(etf);
  }

  return (
    <div className="min-h-screen cyber-grid" style={{ background: '#06080e', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      {/* Top navigation bar */}
      <Navbar view={view} setView={setView} currency={currency} setCurrency={setCurrency} onOpenTutorial={() => setShowTutorial(true)} />

      {/* Main content */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-8">

        {/* Compare tray */}
        {compareIds.length > 0 && (
          <div className="mb-6 flex items-center justify-between gap-4 px-4 py-3 rounded-xl" style={{ background: 'rgba(0,242,254,0.06)', border: '1px solid rgba(0,242,254,0.2)' }}>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs font-mono text-slate-400">Compare selection:</span>
              {compareIds.map(id => {
                const etf = ALL_ETFS.find(e => e.id === id);
                return etf ? (
                  <span key={id} className="font-mono text-xs font-bold px-2 py-0.5 rounded-md" style={{ color: '#00f2fe', background: 'rgba(0,242,254,0.1)', border: '1px solid rgba(0,242,254,0.25)' }}>{etf.ticker}</span>
                ) : null;
              })}
              <span className="text-xs text-slate-600 font-mono">({compareIds.length}/3)</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setView('comparator')}
                className="px-4 py-1.5 rounded-lg text-xs font-bold font-mono text-[#06080e] transition-all"
                style={{ background: 'linear-gradient(135deg, #00f2fe, #05ffa1)', boxShadow: '0 0 14px rgba(0,242,254,0.4)' }}
              >
                Open Comparator →
              </button>
              <button
                onClick={() => setCompareIds([])}
                className="px-3 py-1.5 rounded-lg text-xs font-mono text-slate-500 hover:text-red-400 transition-colors"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Overview view */}
        {view === 'overview' && (
          <>
            <CommandOverview
              etfs={ALL_ETFS}
              currency={currency}
              onSelectETF={handleSelectETF}
            />
            <ETFMatrix
              etfs={ALL_ETFS}
              currency={currency}
              onSelectETF={handleSelectETF}
              selectedForCompare={compareIds}
              toggleCompare={toggleCompare}
            />
          </>
        )}

        {/* Comparator view */}
        {view === 'comparator' && (
          <FundComparator
            initialIds={compareIds}
            allETFs={ALL_ETFS}
            currency={currency}
            onSelectETF={handleSelectETF}
          />
        )}

        {/* Footer */}
        <footer className="mt-16 pt-6 pb-8 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="text-xs font-mono text-slate-600">
            Investments Monitoring — EasyEquities Intelligence
            <span className="mx-2">·</span>
            MDD data verified {METADATA.lastUpdated}
            <span className="mx-2">·</span>
            For information purposes only — not financial advice
          </p>
          <p className="text-[10px] font-mono text-slate-700 mt-1">
            Data sourced from Satrix, Sygnia, 10X Investments, Vanguard & Invesco Minimum Disclosure Documents
          </p>
        </footer>
      </main>

      {/* Fund Deep-Dive Modal */}
      {selectedETF && (
        <FundModal
          etf={selectedETF}
          currency={currency}
          onClose={() => setSelectedETF(null)}
        />
      )}

      {/* Tutorial Modal */}
      {showTutorial && (
        <TutorialModal onClose={() => setShowTutorial(false)} />
      )}
    </div>
  );
}
