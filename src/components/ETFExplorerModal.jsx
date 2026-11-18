import React, { useState } from 'react';
import { X, Search, CheckCircle, AlertTriangle, XCircle, Plus, Check, ExternalLink, Zap, HelpCircle } from 'lucide-react';
import { searchCatalog, addCustomETF, formatCurrency } from '../data/etfService.js';

const QUICK_TAGS = ['SCHD', 'SMH', 'VTI', 'JEPI', 'GLODIV', 'STXRES', 'ARKK', 'CSPX', 'VWRA'];

export default function ETFExplorerModal({ onClose, onETFAdded, activeETFs }) {
  const [search, setSearch] = useState('');
  const [addedTickers, setAddedTickers] = useState(new Set(activeETFs.map(e => e.ticker)));

  const results = searchCatalog(search);

  function handleAdd(item) {
    addCustomETF(item);
    setAddedTickers(prev => new Set([...prev, item.ticker]));
    if (onETFAdded) onETFAdded(item);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 modal-backdrop" />

      <div
        className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl flex flex-col"
        style={{
          background: 'rgba(10,13,20,0.98)',
          border: '1px solid rgba(0,242,254,0.3)',
          boxShadow: '0 0 60px rgba(0,242,254,0.15), 0 25px 60px rgba(0,0,0,0.8)'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between" style={{ background: 'rgba(10,13,20,0.95)', borderBottom: '1px solid rgba(0,242,254,0.1)' }}>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl" style={{ background: 'rgba(0,242,254,0.15)', border: '1px solid rgba(0,242,254,0.4)' }}>
              <Search className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>ETF EXPLORER & EASY EQUITIES VERIFIER</span>
                <span className="badge-cyan text-[9px] font-mono px-2 py-0.5 rounded-full">Live Discovery</span>
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">Search any ETF ticker to check platform availability, fees, and add it to your dashboard.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 transition-all" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Search input bar */}
        <div className="p-6 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
            <input
              type="text"
              autoFocus
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search ticker or fund (e.g. SCHD, SMH, VTI, JEPI, STXRES, CSPX, ARKK)..."
              className="w-full bg-[#0d1117] border border-cyan-500/30 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 font-mono"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick tags */}
          <div className="flex items-center gap-1.5 mt-3 flex-wrap">
            <span className="text-[10px] font-mono text-slate-500 uppercase mr-1">Popular lookups:</span>
            {QUICK_TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => setSearch(tag)}
                className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold transition-all hover:border-cyan-400"
                style={{
                  background: search.toUpperCase() === tag ? 'rgba(0,242,254,0.2)' : 'rgba(255,255,255,0.04)',
                  border: search.toUpperCase() === tag ? '1px solid #00f2fe' : '1px solid rgba(255,255,255,0.08)',
                  color: search.toUpperCase() === tag ? '#00f2fe' : '#94a3b8'
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Results list */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {search.trim() === '' ? (
            <div className="text-center py-10 space-y-3">
              <Zap className="w-10 h-10 mx-auto text-cyan-400/50" />
              <p className="text-sm font-semibold text-slate-300">Type any ETF ticker or fund name above</p>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                The explorer will tell your father whether the fund is on <strong className="text-slate-300">EasyEquities ZAR (TFSA eligible)</strong>, <strong className="text-slate-300">EasyEquities USD (DriveWealth)</strong>, or suggest the closest EasyEquities alternative if it is unavailable.
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <HelpCircle className="w-10 h-10 mx-auto text-amber-400/60" />
              <p className="text-sm font-bold text-slate-300">No direct match for "{search.toUpperCase()}"</p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Try searching by index name (e.g. "S&P 500", "Nasdaq", "Dividend", "Mining") or check if the fund is an overseas unlisted fund.
              </p>
            </div>
          ) : (
            results.map(item => {
              const isAlreadyAdded = addedTickers.has(item.ticker);
              return (
                <div
                  key={item.ticker}
                  className="rounded-xl p-5 transition-all"
                  style={{
                    background: item.onEasyEquities ? 'rgba(13,17,23,0.85)' : 'rgba(239,68,68,0.04)',
                    border: item.onEasyEquities ? '1px solid rgba(0,242,254,0.2)' : '1px solid rgba(239,68,68,0.25)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
                  }}
                >
                  {/* Top card row */}
                  <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold font-mono text-glow-cyan" style={{ color: item.account === 'ZAR' ? '#00f2fe' : '#05ffa1' }}>
                          {item.ticker}
                        </span>
                        <span className="text-xs font-semibold text-slate-300">{item.name}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{item.issuer} · {item.category}</p>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                      {item.onEasyEquities ? (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg" style={{ background: 'rgba(5,255,161,0.1)', border: '1px solid rgba(5,255,161,0.3)' }}>
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-xs font-mono font-bold text-emerald-400">
                            {item.account === 'ZAR' && item.tfsaEligible ? 'On EE (ZAR + TFSA)' : 'On EE (USD Account)'}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
                          <XCircle className="w-3.5 h-3.5 text-red-400" />
                          <span className="text-xs font-mono font-bold text-red-400">Not on EasyEquities</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Fund metrics row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 text-center">
                    <div className="rounded-lg p-2" style={{ background: 'rgba(255,255,255,0.03)' }}>
                      <p className="text-[9px] font-mono text-slate-500 uppercase">TER / TIC</p>
                      <p className="text-xs font-bold font-mono text-cyan-400 mt-0.5">{item.ter}%</p>
                    </div>
                    <div className="rounded-lg p-2" style={{ background: 'rgba(255,255,255,0.03)' }}>
                      <p className="text-[9px] font-mono text-slate-500 uppercase">Dividend Yield</p>
                      <p className="text-xs font-bold font-mono text-amber-400 mt-0.5">{item.dividendYield ? `${item.dividendYield}%` : 'N/A'}</p>
                    </div>
                    <div className="rounded-lg p-2" style={{ background: 'rgba(255,255,255,0.03)' }}>
                      <p className="text-[9px] font-mono text-slate-500 uppercase">1Y Return</p>
                      <p className="text-xs font-bold font-mono text-emerald-400 mt-0.5">
                        {item.returns && item.returns.oneYear ? `+${item.returns.oneYear}%` : '—'}
                      </p>
                    </div>
                    <div className="rounded-lg p-2" style={{ background: 'rgba(255,255,255,0.03)' }}>
                      <p className="text-[9px] font-mono text-slate-500 uppercase">TFSA Status</p>
                      <p className="text-xs font-bold font-mono text-slate-300 mt-0.5">
                        {item.tfsaEligible ? 'Eligible ✓' : 'Standard Account'}
                      </p>
                    </div>
                  </div>

                  {/* Why it ranks or EE alternative recommendation */}
                  {item.whyItRanks && (
                    <p className="text-xs text-slate-400 leading-relaxed mb-3">
                      <strong className="text-slate-300">Overview:</strong> {item.whyItRanks}
                    </p>
                  )}

                  {!item.onEasyEquities && item.easyEquitiesAlternative && (
                    <div className="p-3 rounded-xl mb-3" style={{ background: 'rgba(0,242,254,0.06)', border: '1px solid rgba(0,242,254,0.25)' }}>
                      <p className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 mb-1">
                        <Zap className="w-3.5 h-3.5" /> EasyEquities Equivalent Alternative:
                      </p>
                      <p className="text-xs text-slate-200">{item.easyEquitiesAlternative}</p>
                    </div>
                  )}

                  {/* Action row */}
                  <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <span className="text-[10px] font-mono text-slate-500">
                      Account: {item.eeAccount || item.accountType}
                    </span>

                    {item.onEasyEquities && (
                      <button
                        onClick={() => handleAdd(item)}
                        disabled={isAlreadyAdded}
                        className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                          isAlreadyAdded
                            ? 'text-slate-400 bg-white/5 cursor-default'
                            : 'text-[#06080e] hover:scale-105'
                        }`}
                        style={!isAlreadyAdded ? {
                          background: 'linear-gradient(135deg, #00f2fe, #05ffa1)',
                          boxShadow: '0 0 16px rgba(0,242,254,0.4)'
                        } : {}}
                      >
                        {isAlreadyAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>In Dashboard</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>+ Add to My Dashboard</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#080b12] flex items-center justify-between text-xs font-mono text-slate-500" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <span>Database includes JSE ZAR, EasyEquities USD & Global UCITS</span>
          <button onClick={onClose} className="text-slate-400 hover:text-white">Close Explorer</button>
        </div>
      </div>
    </div>
  );
}
