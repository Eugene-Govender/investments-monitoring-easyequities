import React, { useState } from 'react';
import { Filter, ChevronUp, ChevronDown, Search, BarChart3, Grid3X3, Info } from 'lucide-react';
import { sortETFs, getCategories, formatCurrency, convertValue, RATES } from '../data/etfService.js';
import clsx from 'clsx';

const COLS = [
  { key: 'name', label: 'Fund', sortable: false },
  { key: 'account', label: 'Acct', sortable: false },
  { key: 'ter', label: 'TER %', sortable: true },
  { key: '1y', label: '1Y %', sortable: true },
  { key: '3y', label: '3Y %', sortable: true },
  { key: '5y', label: '5Y %', sortable: true },
  { key: 'yield', label: 'Yield %', sortable: true },
  { key: 'tfsa', label: 'TFSA', sortable: false },
  { key: 'action', label: '', sortable: false },
];

function SortIcon({ field, sortField, sortDir }) {
  if (sortField !== field) return <ChevronUp className="w-3 h-3 text-slate-600" />;
  return sortDir === 'asc'
    ? <ChevronUp className="w-3 h-3" style={{ color: '#00f2fe' }} />
    : <ChevronDown className="w-3 h-3" style={{ color: '#00f2fe' }} />;
}

function TERBadge({ ter }) {
  if (ter <= 0.1) return <span className="badge-emerald font-mono text-[11px] px-2 py-0.5 rounded-md">{ter}%</span>;
  if (ter <= 0.25) return <span className="badge-cyan font-mono text-[11px] px-2 py-0.5 rounded-md">{ter}%</span>;
  if (ter <= 0.4) return <span className="badge-amber font-mono text-[11px] px-2 py-0.5 rounded-md">{ter}%</span>;
  return <span className="badge-crimson font-mono text-[11px] px-2 py-0.5 rounded-md">{ter}%</span>;
}

function ReturnCell({ value }) {
  if (value === null || value === undefined)
    return <span className="font-mono text-xs text-slate-600">—</span>;
  const color = value >= 20 ? '#05ffa1' : value >= 12 ? '#00f2fe' : value >= 8 ? '#fbbf24' : '#94a3b8';
  return <span className="font-mono text-xs font-bold" style={{ color }}>{value.toFixed(1)}%</span>;
}

export default function ETFMatrix({ etfs, currency, onSelectETF, selectedForCompare, toggleCompare }) {
  const [sortField, setSortField] = useState('ter');
  const [sortDir, setSortDir] = useState('asc');
  const [filterCur, setFilterCur] = useState('ALL');
  const [filterTfsa, setFilterTfsa] = useState(false);
  const [filterCat, setFilterCat] = useState('ALL');
  const [maxTer, setMaxTer] = useState(1.0);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'

  const categories = getCategories(etfs);

  let filtered = etfs.filter(e => {
    if (filterCur !== 'ALL' && e.account !== filterCur) return false;
    if (filterTfsa && !e.tfsaEligible) return false;
    if (filterCat !== 'ALL' && e.category !== filterCat) return false;
    if (e.ter > maxTer) return false;
    if (search && !e.ticker.toLowerCase().includes(search.toLowerCase()) && !e.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  filtered = sortETFs(filtered, sortField, sortDir);

  function handleSort(field) {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  }

  return (
    <section className="fade-in mt-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 rounded-full" style={{ background: 'linear-gradient(to bottom, #00f2fe, #7928ca)' }} />
          <h2 className="text-xl font-bold text-white">Fund Matrix</h2>
          <span className="badge-cyan font-mono text-[10px] px-2 py-0.5 rounded-full ml-1">{filtered.length} of {etfs.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setViewMode('table')} className={clsx('p-2 rounded-lg transition-all', viewMode === 'table' ? 'text-[#06080e]' : 'text-slate-400')} style={viewMode === 'table' ? { background: 'linear-gradient(135deg, #00f2fe, #05ffa1)' } : { background: 'rgba(13,17,23,0.8)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <BarChart3 className="w-4 h-4" />
          </button>
          <button onClick={() => setViewMode('cards')} className={clsx('p-2 rounded-lg transition-all', viewMode === 'cards' ? 'text-[#06080e]' : 'text-slate-400')} style={viewMode === 'cards' ? { background: 'linear-gradient(135deg, #00f2fe, #05ffa1)' } : { background: 'rgba(13,17,23,0.8)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <Grid3X3 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-card p-4 mb-4 flex flex-wrap gap-3 items-center">
        <Filter className="w-4 h-4 text-slate-500 shrink-0" />

        {/* Search */}
        <div className="relative flex-1 min-w-[140px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search funds…"
            className="w-full bg-transparent border border-white/10 rounded-lg pl-7 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        {/* Currency filter */}
        <div className="flex items-center rounded-lg overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
          {['ALL', 'ZAR', 'USD'].map(c => (
            <button key={c} onClick={() => setFilterCur(c)} className={clsx('px-3 py-1.5 text-xs font-mono font-bold transition-all', filterCur === c ? 'text-[#06080e]' : 'text-slate-400 hover:text-white')} style={filterCur === c ? { background: 'linear-gradient(135deg, #00f2fe, #05ffa1)' } : { background: 'rgba(13,17,23,0.9)' }}>
              {c}
            </button>
          ))}
        </div>

        {/* TFSA toggle */}
        <button
          onClick={() => setFilterTfsa(t => !t)}
          className={clsx('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all', filterTfsa ? 'badge-emerald' : 'text-slate-400')}
          style={filterTfsa ? {} : { background: 'rgba(13,17,23,0.8)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          TFSA Only
        </button>

        {/* Category filter */}
        <select
          value={filterCat}
          onChange={e => setFilterCat(e.target.value)}
          className="bg-[#0d1117] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500/40"
        >
          {categories.map(c => <option key={c} value={c}>{c === 'ALL' ? 'All Categories' : c}</option>)}
        </select>

        {/* Max TER slider */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-500 whitespace-nowrap">Max TER</span>
          <input type="range" min="0.03" max="1.0" step="0.01" value={maxTer} onChange={e => setMaxTer(+e.target.value)} className="w-20 accent-cyan-400" />
          <span className="text-[10px] font-mono text-cyan-400 w-8">{maxTer.toFixed(2)}%</span>
        </div>
      </div>

      {/* Table view */}
      {viewMode === 'table' && (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(0,242,254,0.12)', background: 'rgba(0,242,254,0.03)' }}>
                  {COLS.map(col => (
                    <th
                      key={col.key}
                      className={clsx('px-4 py-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest whitespace-nowrap', col.sortable && 'cursor-pointer hover:text-slate-200 select-none')}
                      onClick={col.sortable ? () => handleSort(col.key) : undefined}
                    >
                      <span className="flex items-center gap-1">
                        {col.label}
                        {col.sortable && <SortIcon field={col.key} sortField={sortField} sortDir={sortDir} />}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(etf => {
                  const isSelected = selectedForCompare.includes(etf.id);
                  return (
                    <tr key={etf.id} className={clsx('etf-row', isSelected && 'bg-cyan-900/10')}>
                      {/* Name */}
                      <td className="px-4 py-3">
                        <button className="text-left" onClick={() => onSelectETF(etf)}>
                          <p className="font-bold text-sm font-mono" style={{ color: etf.account === 'ZAR' ? '#00f2fe' : '#05ffa1' }}>{etf.ticker}</p>
                          <p className="text-[11px] text-slate-400 max-w-[180px] truncate">{etf.name}</p>
                        </button>
                      </td>
                      {/* Acct */}
                      <td className="px-4 py-3">
                        <span className={clsx('text-[10px] font-mono font-bold px-2 py-0.5 rounded-md', etf.account === 'ZAR' ? 'badge-cyan' : 'badge-emerald')}>{etf.account}</span>
                      </td>
                      {/* TER */}
                      <td className="px-4 py-3"><TERBadge ter={etf.ter} /></td>
                      {/* Returns */}
                      <td className="px-4 py-3"><ReturnCell value={etf.returns.oneYear} /></td>
                      <td className="px-4 py-3"><ReturnCell value={etf.returns.threeYearAnnualized} /></td>
                      <td className="px-4 py-3"><ReturnCell value={etf.returns.fiveYearAnnualized} /></td>
                      {/* Yield */}
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs font-semibold text-amber-400">{etf.dividendYield}%</span>
                      </td>
                      {/* TFSA */}
                      <td className="px-4 py-3">
                        {etf.tfsaEligible
                          ? <span className="badge-emerald text-[10px] px-2 py-0.5 rounded-md font-mono">✓</span>
                          : <span className="text-slate-600 text-[10px] font-mono">—</span>}
                      </td>
                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onSelectETF(etf)}
                            className="p-1.5 rounded-lg transition-all hover:scale-110"
                            style={{ background: 'rgba(0,242,254,0.1)', border: '1px solid rgba(0,242,254,0.2)' }}
                            title="Deep dive"
                          >
                            <Info className="w-3 h-3" style={{ color: '#00f2fe' }} />
                          </button>
                          <button
                            onClick={() => toggleCompare(etf.id)}
                            className={clsx('px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all', isSelected ? 'text-[#06080e]' : 'text-slate-400 hover:text-white')}
                            style={isSelected
                              ? { background: 'linear-gradient(135deg, #00f2fe, #05ffa1)', boxShadow: '0 0 10px rgba(0,242,254,0.4)' }
                              : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                          >
                            {isSelected ? '✓ Added' : '+ Compare'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-16 text-slate-500 text-sm">
                No funds match your current filters.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Card view */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(etf => {
            const isSelected = selectedForCompare.includes(etf.id);
            return (
              <div
                key={etf.id}
                className={clsx('glass-card glass-card-hover p-4 cursor-pointer', isSelected && 'etf-selected-ring')}
                onClick={() => onSelectETF(etf)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-lg font-bold font-mono" style={{ color: etf.account === 'ZAR' ? '#00f2fe' : '#05ffa1' }}>{etf.ticker}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{etf.name}</p>
                  </div>
                  <TERBadge ter={etf.ter} />
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[['1Y', etf.returns.oneYear], ['3Y', etf.returns.threeYearAnnualized], ['5Y', etf.returns.fiveYearAnnualized]].map(([label, val]) => (
                    <div key={label} className="rounded-lg p-2 text-center" style={{ background: 'rgba(255,255,255,0.03)' }}>
                      <p className="text-[9px] text-slate-500 font-mono uppercase">{label}</p>
                      {val !== null && val !== undefined
                        ? <p className="text-sm font-bold font-mono mt-0.5" style={{ color: val >= 20 ? '#05ffa1' : val >= 12 ? '#00f2fe' : '#fbbf24' }}>{val}%</p>
                        : <p className="text-sm font-bold font-mono mt-0.5 text-slate-600">—</p>
                      }
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1.5">
                    <span className={clsx('text-[9px] font-mono px-1.5 py-0.5 rounded-md', etf.account === 'ZAR' ? 'badge-cyan' : 'badge-emerald')}>{etf.account}</span>
                    {etf.tfsaEligible && <span className="badge-emerald text-[9px] font-mono px-1.5 py-0.5 rounded-md">TFSA</span>}
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); toggleCompare(etf.id); }}
                    className={clsx('text-[10px] font-mono font-bold px-2 py-0.5 rounded-md transition-all', isSelected ? 'text-[#06080e]' : 'text-slate-400')}
                    style={isSelected ? { background: 'linear-gradient(135deg, #00f2fe, #05ffa1)' } : { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    {isSelected ? '✓' : '+'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
