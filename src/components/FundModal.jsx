import React, { useEffect, useRef, useState } from 'react';
import { X, TrendingUp, Percent, Shield, ExternalLink, Info } from 'lucide-react';
import { Chart, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend, DoughnutController, BarController } from 'chart.js';
import { formatCurrency, simulateFeeDrag, convertValue, RATES } from '../data/etfService.js';

Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend, DoughnutController, BarController);

function HoldingsBar({ holdings }) {
  const max = holdings[0]?.weight || 1;
  return (
    <div className="space-y-2">
      {holdings.map((h, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-500 w-5 shrink-0 text-right">{i + 1}.</span>
          <div className="flex-1 relative h-6 rounded-md overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <div
              className="absolute left-0 top-0 h-full rounded-md transition-all duration-700"
              style={{
                width: `${(h.weight / max) * 100}%`,
                background: `linear-gradient(90deg, rgba(0,242,254,${0.5 - i * 0.04}) 0%, rgba(5,255,161,${0.3 - i * 0.02}) 100%)`,
              }}
            />
            <span className="absolute inset-0 flex items-center justify-between px-2 text-[11px] text-slate-200 font-medium">
              <span className="truncate pr-2">{h.name}</span>
              <span className="font-mono font-bold text-cyan-300 shrink-0">{h.weight}%</span>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function DonutChart({ data, colors, label }) {
  const ref = useRef(null);
  const chartRef = useRef(null);
  useEffect(() => {
    if (chartRef.current) chartRef.current.destroy();
    if (!ref.current) return;
    chartRef.current = new Chart(ref.current, {
      type: 'doughnut',
      data: {
        labels: data.map(d => d.name || d.region),
        datasets: [{
          data: data.map(d => d.weight),
          backgroundColor: colors,
          borderColor: 'rgba(6,8,14,0.8)',
          borderWidth: 2,
          hoverBorderColor: '#00f2fe',
          hoverBorderWidth: 2,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: '#94a3b8',
              font: { family: 'JetBrains Mono', size: 10 },
              boxWidth: 10,
              padding: 8,
              usePointStyle: true,
            },
          },
          tooltip: {
            callbacks: {
              label: ctx => ` ${ctx.label}: ${ctx.parsed}%`,
            },
            backgroundColor: 'rgba(13,17,23,0.95)',
            borderColor: 'rgba(0,242,254,0.3)',
            borderWidth: 1,
            titleColor: '#00f2fe',
            bodyColor: '#94a3b8',
            bodyFont: { family: 'JetBrains Mono', size: 11 },
          },
        },
      },
    });
    return () => chartRef.current?.destroy();
  }, [data]);
  return (
    <div>
      <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">{label}</p>
      <div style={{ height: '180px' }}>
        <canvas ref={ref} />
      </div>
    </div>
  );
}

function FeeSimulator({ etf, currency }) {
  const [initial, setInitial] = useState(100000);
  const [monthly, setMonthly] = useState(2000);
  const [years, setYears] = useState(10);
  const [grossReturn, setGrossReturn] = useState(15);
  const rate = RATES.rates.ZAR;
  const cur = currency === 'ZAR' ? 'ZAR' : 'USD';

  const sim = simulateFeeDrag({ initial, monthly, years, returnRate: grossReturn, ter: etf.ter });
  const last = sim[sim.length - 1] || { withFee: 0, withoutFee: 0, drag: 0 };

  function fmt(v) {
    const val = cur === 'USD' ? v / rate : v;
    return formatCurrency(val, cur, true);
  }

  return (
    <div className="rounded-xl p-4 mt-4" style={{ background: 'rgba(0,242,254,0.04)', border: '1px solid rgba(0,242,254,0.12)' }}>
      <div className="flex items-center gap-2 mb-4">
        <Percent className="w-4 h-4" style={{ color: '#00f2fe' }} />
        <h4 className="text-sm font-semibold text-slate-200">Fee Impact Simulator</h4>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
        <label className="block">
          <span className="text-slate-500 font-mono text-[10px]">Lump Sum ({cur === 'ZAR' ? 'R' : '$'})</span>
          <input type="number" value={cur === 'USD' ? Math.round(initial / rate) : initial} onChange={e => setInitial(cur === 'USD' ? +e.target.value * rate : +e.target.value)} className="mt-1 w-full bg-transparent border border-white/10 rounded-lg px-2 py-1.5 text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500/50" />
        </label>
        <label className="block">
          <span className="text-slate-500 font-mono text-[10px]">Monthly ({cur === 'ZAR' ? 'R' : '$'})</span>
          <input type="number" value={cur === 'USD' ? Math.round(monthly / rate) : monthly} onChange={e => setMonthly(cur === 'USD' ? +e.target.value * rate : +e.target.value)} className="mt-1 w-full bg-transparent border border-white/10 rounded-lg px-2 py-1.5 text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500/50" />
        </label>
        <label className="block">
          <span className="text-slate-500 font-mono text-[10px]">Years</span>
          <input type="range" min="1" max="30" value={years} onChange={e => setYears(+e.target.value)} className="mt-1 w-full accent-cyan-400" />
          <span className="text-cyan-400 font-mono">{years}Y</span>
        </label>
        <label className="block">
          <span className="text-slate-500 font-mono text-[10px]">Gross Return %</span>
          <input type="range" min="5" max="30" value={grossReturn} onChange={e => setGrossReturn(+e.target.value)} className="mt-1 w-full accent-emerald-400" />
          <span className="text-emerald-400 font-mono">{grossReturn}%</span>
        </label>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg p-3 text-center" style={{ background: 'rgba(5,255,161,0.08)', border: '1px solid rgba(5,255,161,0.2)' }}>
          <p className="text-[9px] font-mono text-slate-500 uppercase">With {etf.ter}% TER</p>
          <p className="text-sm font-bold font-mono text-emerald-400 mt-1">{fmt(last.withFee)}</p>
        </div>
        <div className="rounded-lg p-3 text-center" style={{ background: 'rgba(0,242,254,0.08)', border: '1px solid rgba(0,242,254,0.2)' }}>
          <p className="text-[9px] font-mono text-slate-500 uppercase">No Fees (Ideal)</p>
          <p className="text-sm font-bold font-mono text-cyan-400 mt-1">{fmt(last.withoutFee)}</p>
        </div>
        <div className="rounded-lg p-3 text-center" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <p className="text-[9px] font-mono text-slate-500 uppercase">Fee Drag</p>
          <p className="text-sm font-bold font-mono text-red-400 mt-1">-{fmt(last.drag)}</p>
        </div>
      </div>
    </div>
  );
}

export default function FundModal({ etf, currency, onClose }) {
  if (!etf) return null;

  const SECTOR_COLORS = ['#00f2fe','#05ffa1','#7928ca','#fbbf24','#f87171','#60a5fa','#34d399','#a78bfa','#fb923c','#e879f9'];
  const GEO_COLORS =   ['#00f2fe','#7928ca','#05ffa1','#fbbf24','#f87171','#60a5fa','#34d399'];

  const riskColor = etf.riskRating.includes('Very') ? '#f87171' : '#fbbf24';

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 modal-backdrop" />

      {/* Drawer */}
      <div
        className="drawer-enter relative z-10 h-full w-full max-w-[680px] overflow-y-auto"
        style={{ background: 'rgba(10, 13, 20, 0.98)', borderLeft: '1px solid rgba(0,242,254,0.2)', boxShadow: '-20px 0 60px rgba(0,0,0,0.6)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Drawer header */}
        <div className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between" style={{ background: 'rgba(10,13,20,0.95)', borderBottom: '1px solid rgba(0,242,254,0.1)', backdropFilter: 'blur(12px)' }}>
          <div>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold font-mono text-glow-cyan" style={{ color: '#00f2fe' }}>{etf.ticker}</span>
              <span className={`badge-${etf.account === 'ZAR' ? 'cyan' : 'emerald'} text-xs font-mono px-2 py-0.5 rounded-md`}>{etf.account}</span>
              {etf.tfsaEligible && <span className="badge-emerald text-xs font-mono px-2 py-0.5 rounded-md">TFSA ✓</span>}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{etf.name}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl transition-all hover:bg-white/5" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Key stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'TER', value: `${etf.ter}%`, color: etf.ter <= 0.1 ? '#05ffa1' : etf.ter <= 0.25 ? '#00f2fe' : '#fbbf24' },
              { label: 'TIC', value: `${etf.tic}%`, color: '#94a3b8' },
              { label: 'Div Yield', value: `${etf.dividendYield}%`, color: '#fbbf24' },
              { label: 'Inception', value: new Date(etf.inceptionDate).getFullYear(), color: '#94a3b8' },
            ].map(item => (
              <div key={item.label} className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">{item.label}</p>
                <p className="text-xl font-bold font-mono mt-1" style={{ color: item.color }}>{item.value}</p>
              </div>
            ))}
          </div>

          {/* Returns grid */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4" style={{ color: '#00f2fe' }} />
              <h3 className="text-sm font-semibold text-slate-200">Trailing Returns</h3>
            </div>
            {etf.note && (
              <div className="mb-3 px-3 py-2 rounded-lg text-xs text-amber-300 font-mono" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                ⚠ {etf.note}
              </div>
            )}
            <div className="grid grid-cols-3 gap-3">
              {[['1-Year', etf.returns.oneYear], ['3-Year Ann.', etf.returns.threeYearAnnualized], ['5-Year Ann.', etf.returns.fiveYearAnnualized]].map(([label, val]) => (
                <div key={label} className="rounded-xl p-4 text-center" style={{ background: 'rgba(0,242,254,0.05)', border: '1px solid rgba(0,242,254,0.12)' }}>
                  <p className="text-[9px] font-mono text-slate-500 uppercase">{label}</p>
                  {val !== null && val !== undefined
                    ? <p className="text-2xl font-bold font-mono mt-1" style={{ color: val >= 20 ? '#05ffa1' : val >= 12 ? '#00f2fe' : '#fbbf24' }}>{val}%</p>
                    : <p className="text-lg font-bold font-mono mt-1 text-slate-600">—</p>
                  }
                </div>
              ))}
            </div>
          </div>

          {/* Top 10 Holdings */}
          <div>
            <h3 className="text-sm font-semibold text-slate-200 mb-3">Top 10 Underlying Holdings</h3>
            <HoldingsBar holdings={etf.top10Holdings} />
          </div>

          {/* Sector & Geo donuts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <DonutChart data={etf.sectors} colors={SECTOR_COLORS} label="Sector Allocation" />
            <DonutChart data={etf.geography} colors={GEO_COLORS} label="Geographic Exposure" />
          </div>

          {/* Why It Ranks */}
          <div className="rounded-xl p-4" style={{ background: 'rgba(5,255,161,0.05)', border: '1px solid rgba(5,255,161,0.15)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4" style={{ color: '#05ffa1' }} />
              <h3 className="text-sm font-semibold text-slate-200">Why It Ranks</h3>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">{etf.whyItRanks}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider mb-2">✓ Pros</p>
                <ul className="space-y-1">
                  {etf.pros.map((p, i) => <li key={i} className="text-xs text-slate-400 flex gap-2"><span className="text-emerald-500">▸</span>{p}</li>)}
                </ul>
              </div>
              <div>
                <p className="text-[10px] font-mono text-red-400 uppercase tracking-wider mb-2">⚠ Risks</p>
                <ul className="space-y-1">
                  {etf.risks.map((r, i) => <li key={i} className="text-xs text-slate-400 flex gap-2"><span className="text-red-500">▸</span>{r}</li>)}
                </ul>
              </div>
            </div>
            <div className="mt-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">Ideal Investor</p>
              <p className="text-xs text-slate-300">{etf.idealInvestor}</p>
            </div>
          </div>

          {/* Fund details */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            {[
              ['Issuer', etf.issuer],
              ['Benchmark', etf.benchmark],
              ['Underlying Asset', etf.underlyingAsset],
              ['Distribution', etf.distributionFrequency],
              ['Risk Profile', etf.riskRating],
              ['ISIN', etf.isin],
            ].map(([label, val]) => (
              <div key={label} className="rounded-lg px-3 py-2" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <p className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">{label}</p>
                <p className="text-xs text-slate-300 mt-0.5 font-medium">{val}</p>
              </div>
            ))}
          </div>

          {/* Fee simulator */}
          <FeeSimulator etf={etf} currency={currency} />
        </div>
      </div>
    </div>
  );
}
