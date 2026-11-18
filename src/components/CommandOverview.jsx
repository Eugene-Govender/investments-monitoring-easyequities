import React from 'react';
import { TrendingUp, Shield, Percent, Leaf, Star } from 'lucide-react';
import { computeKPIs, formatCurrency, convertValue, RATES } from '../data/etfService.js';

const KPI_CONFIGS = [
  {
    key: 'lowestTER',
    icon: Percent,
    label: 'Lowest TER',
    iconColor: '#05ffa1',
    glowColor: 'rgba(5,255,161,0.15)',
    borderColor: 'rgba(5,255,161,0.25)',
    getValue: (etf) => `${etf.ter}%`,
    getSub: (etf) => `TIC: ${etf.tic}%`,
  },
  {
    key: 'best5Y',
    icon: TrendingUp,
    label: 'Best 5Y Return',
    iconColor: '#00f2fe',
    glowColor: 'rgba(0,242,254,0.12)',
    borderColor: 'rgba(0,242,254,0.25)',
    getValue: (etf) => `${etf.returns.fiveYearAnnualized}%`,
    getSub: (etf) => `3Y: ${etf.returns.threeYearAnnualized}%`,
  },
  {
    key: 'best3Y',
    icon: Star,
    label: 'Best 3Y Return',
    iconColor: '#a78bfa',
    glowColor: 'rgba(121,40,202,0.15)',
    borderColor: 'rgba(121,40,202,0.3)',
    getValue: (etf) => `${etf.returns.threeYearAnnualized}%`,
    getSub: (etf) => `1Y: ${etf.returns.oneYear}%`,
  },
  {
    key: 'bestYield',
    icon: Leaf,
    label: 'Top Dividend Yield',
    iconColor: '#fbbf24',
    glowColor: 'rgba(245,158,11,0.12)',
    borderColor: 'rgba(245,158,11,0.25)',
    getValue: (etf) => `${etf.dividendYield}%`,
    getSub: (etf) => etf.distributionFrequency,
  },
  {
    key: 'tfsaTop',
    icon: Shield,
    label: 'TFSA Top Pick',
    iconColor: '#05ffa1',
    glowColor: 'rgba(5,255,161,0.1)',
    borderColor: 'rgba(5,255,161,0.2)',
    getValue: (etf) => `${etf.returns.fiveYearAnnualized}% 5Y`,
    getSub: (etf) => `TER: ${etf.ter}%`,
    badge: 'Tax-Free',
  },
];

export default function CommandOverview({ etfs, currency, onSelectETF }) {
  const kpis = computeKPIs(etfs);
  const rate = RATES.rates.ZAR;

  return (
    <section className="fade-in">
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Command Overview</h2>
          <p className="text-sm text-slate-500 mt-0.5">Top intelligence signals across {etfs.length} monitored funds</p>
        </div>
        <div className="text-xs font-mono text-slate-500 hidden sm:block">
          MDD verified · Updated 2026-11-17
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {KPI_CONFIGS.map(cfg => {
          const etf = kpis[cfg.key];
          if (!etf) return null;
          const Icon = cfg.icon;
          return (
            <button
              key={cfg.key}
              onClick={() => onSelectETF(etf)}
              className="scan-shimmer glass-card glass-card-hover text-left p-4 w-full"
              style={{ background: cfg.glowColor, border: `1px solid ${cfg.borderColor}` }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${cfg.borderColor}` }}>
                  <Icon className="w-4 h-4" style={{ color: cfg.iconColor }} />
                </div>
                {cfg.badge && (
                  <span className="badge-emerald text-[9px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider">{cfg.badge}</span>
                )}
              </div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono mb-1">{cfg.label}</p>
              <p className="text-lg font-bold font-mono leading-none mb-1" style={{ color: cfg.iconColor }}>
                {cfg.getValue(etf)}
              </p>
              <p className="text-xs font-bold text-slate-200 mb-0.5">{etf.ticker}</p>
              <p className="text-[10px] text-slate-500 truncate">{cfg.getSub(etf)}</p>
            </button>
          );
        })}
      </div>

      {/* Quick comparison bar */}
      <div className="glass-card p-4 overflow-x-auto">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-4 rounded-full" style={{ background: 'linear-gradient(to bottom, #00f2fe, #05ffa1)' }} />
          <h3 className="text-sm font-semibold text-slate-200">Fee Intelligence Matrix</h3>
          <span className="ml-auto text-[10px] font-mono text-slate-500">Sorted by TER ascending</span>
        </div>
        <div className="min-w-[560px]">
          {[...etfs].sort((a,b) => a.ter - b.ter).map(etf => {
            const maxTer = Math.max(...etfs.map(e => e.ter));
            const pct = (etf.ter / maxTer) * 100;
            const isZAR = etf.account === 'ZAR';
            return (
              <div key={etf.id} className="flex items-center gap-3 py-1.5 group cursor-pointer" onClick={() => onSelectETF(etf)}>
                <span className="font-mono text-xs font-bold w-16 shrink-0" style={{ color: isZAR ? '#00f2fe' : '#05ffa1' }}>{etf.ticker}</span>
                <div className="flex-1 relative h-5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <div
                    className="absolute left-0 top-0 h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${pct}%`,
                      background: isZAR
                        ? 'linear-gradient(90deg, rgba(0,242,254,0.6), rgba(0,242,254,0.2))'
                        : 'linear-gradient(90deg, rgba(5,255,161,0.6), rgba(5,255,161,0.2))',
                    }}
                  />
                  <span className="absolute inset-0 flex items-center px-2 text-[10px] font-mono text-slate-300">{etf.name}</span>
                </div>
                <span className="font-mono text-xs font-bold w-10 text-right" style={{ color: etf.ter <= 0.1 ? '#05ffa1' : etf.ter <= 0.25 ? '#00f2fe' : etf.ter <= 0.4 ? '#fbbf24' : '#f87171' }}>
                  {etf.ter}%
                </span>
                <span className="font-mono text-[10px] text-slate-500 w-8 text-right">{etf.account}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
