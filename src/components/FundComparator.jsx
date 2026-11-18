import React, { useState, useEffect, useRef } from 'react';
import { X, ArrowLeftRight, TrendingUp, Zap } from 'lucide-react';
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend, LineElement, PointElement, LineController, BarController } from 'chart.js';
import { ALL_ETFS, simulateFeeDrag, holdingsOverlap, formatCurrency, convertValue, RATES } from '../data/etfService.js';

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, LineElement, PointElement, LineController, BarController);

function ETFSelector({ selectedIds, onAdd, onRemove, allETFs }) {
  const available = allETFs.filter(e => !selectedIds.includes(e.id));
  return (
    <div className="flex flex-wrap gap-2 items-center">
      {selectedIds.map(id => {
        const etf = allETFs.find(e => e.id === id);
        if (!etf) return null;
        return (
          <div key={id} className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ background: etf.account === 'ZAR' ? 'rgba(0,242,254,0.12)' : 'rgba(5,255,161,0.12)', border: `1px solid ${etf.account === 'ZAR' ? 'rgba(0,242,254,0.35)' : 'rgba(5,255,161,0.35)'}` }}>
            <span className="font-mono text-sm font-bold" style={{ color: etf.account === 'ZAR' ? '#00f2fe' : '#05ffa1' }}>{etf.ticker}</span>
            <button onClick={() => onRemove(id)} className="text-slate-500 hover:text-red-400 transition-colors"><X className="w-3 h-3" /></button>
          </div>
        );
      })}
      {selectedIds.length < 3 && (
        <select
          className="bg-[#0d1117] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500/40"
          value=""
          onChange={e => { if (e.target.value) onAdd(e.target.value); }}
        >
          <option value="">+ Add fund…</option>
          {available.map(e => <option key={e.id} value={e.id}>{e.ticker} — {e.name.substring(0, 30)}…</option>)}
        </select>
      )}
    </div>
  );
}

function FeeDragChart({ etfs, years, initial, monthly, grossReturn }) {
  const ref = useRef(null);
  const chartRef = useRef(null);

  const COLORS = ['#00f2fe', '#05ffa1', '#a78bfa'];

  useEffect(() => {
    if (chartRef.current) chartRef.current.destroy();
    if (!ref.current || etfs.length === 0) return;

    const labels = Array.from({ length: years }, (_, i) => `Y${i + 1}`);

    const datasets = etfs.map((etf, i) => {
      const sim = simulateFeeDrag({ initial, monthly, years, returnRate: grossReturn, ter: etf.ter });
      return {
        label: etf.ticker,
        data: sim.map(d => Math.round(d.withFee / 1000)),
        borderColor: COLORS[i],
        backgroundColor: `${COLORS[i]}18`,
        borderWidth: 2.5,
        pointRadius: 3,
        pointBackgroundColor: COLORS[i],
        fill: i === 0,
        tension: 0.4,
      };
    });

    // Add "ideal no-fee" line from first ETF
    if (etfs.length > 0) {
      const sim = simulateFeeDrag({ initial, monthly, years, returnRate: grossReturn, ter: 0 });
      datasets.push({
        label: 'No Fees (Ideal)',
        data: sim.map(d => Math.round(d.withFee / 1000)),
        borderColor: '#ffffff20',
        borderWidth: 1.5,
        borderDash: [4, 4],
        pointRadius: 0,
        fill: false,
        tension: 0.4,
      });
    }

    chartRef.current = new Chart(ref.current, {
      type: 'line',
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            labels: {
              color: '#94a3b8',
              font: { family: 'JetBrains Mono', size: 10 },
              usePointStyle: true,
              boxWidth: 8,
            },
          },
          tooltip: {
            backgroundColor: 'rgba(13,17,23,0.95)',
            borderColor: 'rgba(0,242,254,0.3)',
            borderWidth: 1,
            titleColor: '#00f2fe',
            bodyColor: '#94a3b8',
            bodyFont: { family: 'JetBrains Mono', size: 11 },
            callbacks: { label: ctx => ` ${ctx.dataset.label}: R${ctx.parsed.y}K` },
          },
        },
        scales: {
          x: {
            ticks: { color: '#475569', font: { family: 'JetBrains Mono', size: 10 } },
            grid: { color: 'rgba(255,255,255,0.04)' },
          },
          y: {
            ticks: {
              color: '#475569',
              font: { family: 'JetBrains Mono', size: 10 },
              callback: v => `R${v}K`,
            },
            grid: { color: 'rgba(255,255,255,0.04)' },
          },
        },
      },
    });
    return () => chartRef.current?.destroy();
  }, [etfs, years, initial, monthly, grossReturn]);

  return <div style={{ height: '300px' }}><canvas ref={ref} /></div>;
}

export default function FundComparator({ initialIds = [], allETFs, currency, onSelectETF }) {
  const [selectedIds, setSelectedIds] = useState(initialIds.slice(0, 3));
  const [years, setYears] = useState(10);
  const [initial, setInitial] = useState(100000);
  const [monthly, setMonthly] = useState(2000);
  const [grossReturn, setGrossReturn] = useState(15);
  const rate = RATES.rates.ZAR;

  useEffect(() => {
    setSelectedIds(initialIds.slice(0, 3));
  }, [initialIds.join(',')]);

  const selectedETFs = selectedIds.map(id => allETFs.find(e => e.id === id)).filter(Boolean);

  function fmt(v) {
    const val = currency === 'USD' ? v / rate : v;
    return formatCurrency(val, currency, true);
  }

  const COLORS = ['#00f2fe', '#05ffa1', '#a78bfa'];

  return (
    <section className="fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 rounded-full" style={{ background: 'linear-gradient(to bottom, #00f2fe, #7928ca)' }} />
          <h2 className="text-xl font-bold text-white">Fund Comparator</h2>
        </div>
        <span className="badge-cyan text-[10px] font-mono px-2 py-0.5 rounded-full">Select 2–3 ETFs</span>
      </div>

      {/* ETF Selector */}
      <div className="glass-card p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <ArrowLeftRight className="w-4 h-4" style={{ color: '#00f2fe' }} />
          <span className="text-sm font-semibold text-slate-200">Funds in Comparison</span>
        </div>
        <ETFSelector
          selectedIds={selectedIds}
          onAdd={id => setSelectedIds(prev => prev.length < 3 ? [...prev, id] : prev)}
          onRemove={id => setSelectedIds(prev => prev.filter(x => x !== id))}
          allETFs={allETFs}
        />
      </div>

      {selectedETFs.length < 2 && (
        <div className="text-center py-16 text-slate-500 text-sm glass-card">
          <ArrowLeftRight className="w-10 h-10 mx-auto mb-3 text-slate-700" />
          <p>Select at least 2 funds from the matrix above to compare</p>
          <p className="text-xs mt-1 text-slate-600">Use the "+ Compare" button on each fund card</p>
        </div>
      )}

      {selectedETFs.length >= 2 && (
        <>
          {/* Stats comparison grid */}
          <div className="glass-card p-5 mb-6">
            <h3 className="text-sm font-semibold text-slate-200 mb-4">Side-by-Side Metrics</h3>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr>
                    <th className="text-left text-[10px] font-mono text-slate-500 uppercase pb-3 w-1/4">Metric</th>
                    {selectedETFs.map((etf, i) => (
                      <th key={etf.id} className="text-center text-[10px] font-mono pb-3">
                        <button onClick={() => onSelectETF(etf)} className="font-bold text-sm" style={{ color: COLORS[i] }}>{etf.ticker}</button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {[
                    { label: 'TER', vals: etfs => etfs.map(e => `${e.ter}%`), best: (vals) => Math.min(...vals.map(v => parseFloat(v))), lowerBetter: true },
                    { label: 'TIC', vals: etfs => etfs.map(e => `${e.tic}%`), best: (vals) => Math.min(...vals.map(v => parseFloat(v))), lowerBetter: true },
                    { label: '1-Year Return', vals: etfs => etfs.map(e => `${e.returns.oneYear}%`), best: (vals) => Math.max(...vals.map(v => parseFloat(v))), lowerBetter: false },
                    { label: '3-Year Ann.', vals: etfs => etfs.map(e => `${e.returns.threeYearAnnualized}%`), best: (vals) => Math.max(...vals.map(v => parseFloat(v))), lowerBetter: false },
                    { label: '5-Year Ann.', vals: etfs => etfs.map(e => `${e.returns.fiveYearAnnualized}%`), best: (vals) => Math.max(...vals.map(v => parseFloat(v))), lowerBetter: false },
                    { label: 'Dividend Yield', vals: etfs => etfs.map(e => `${e.dividendYield}%`), best: (vals) => Math.max(...vals.map(v => parseFloat(v))), lowerBetter: false },
                    { label: 'TFSA', vals: etfs => etfs.map(e => e.tfsaEligible ? '✓ Yes' : '✗ No'), best: null },
                    { label: 'Account', vals: etfs => etfs.map(e => e.account), best: null },
                    { label: 'Category', vals: etfs => etfs.map(e => e.category), best: null },
                  ].map(row => {
                    const vals = row.vals(selectedETFs);
                    const bestVal = row.best ? row.best(vals) : null;
                    return (
                      <tr key={row.label} className="border-t border-white/5">
                        <td className="py-2.5 text-slate-500 font-mono text-[10px]">{row.label}</td>
                        {vals.map((val, i) => {
                          const isNumeric = row.best !== null;
                          const numVal = isNumeric ? parseFloat(val) : null;
                          const isBest = isNumeric && numVal === bestVal;
                          return (
                            <td key={i} className="py-2.5 text-center">
                              <span className={`font-mono text-xs font-bold ${isBest ? (row.lowerBetter ? 'text-emerald-400' : 'text-cyan-400') : 'text-slate-400'}`}>
                                {val}
                                {isBest && <span className="ml-1 text-[9px]">★</span>}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Fee Drag Simulator */}
          <div className="glass-card p-5 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4" style={{ color: '#fbbf24' }} />
              <h3 className="text-sm font-semibold text-slate-200">Compound Fee Drag Simulator</h3>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5 text-xs">
              <label>
                <span className="text-slate-500 font-mono text-[10px]">Lump Sum ({currency === 'ZAR' ? 'R' : '$'})</span>
                <input type="number" value={currency === 'USD' ? Math.round(initial / rate) : initial} onChange={e => setInitial(currency === 'USD' ? +e.target.value * rate : +e.target.value)} className="mt-1 w-full bg-transparent border border-white/10 rounded-lg px-2 py-1.5 text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500/50" />
              </label>
              <label>
                <span className="text-slate-500 font-mono text-[10px]">Monthly ({currency === 'ZAR' ? 'R' : '$'})</span>
                <input type="number" value={currency === 'USD' ? Math.round(monthly / rate) : monthly} onChange={e => setMonthly(currency === 'USD' ? +e.target.value * rate : +e.target.value)} className="mt-1 w-full bg-transparent border border-white/10 rounded-lg px-2 py-1.5 text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500/50" />
              </label>
              <label>
                <span className="text-slate-500 font-mono text-[10px]">Horizon: {years}Y</span>
                <input type="range" min="1" max="30" value={years} onChange={e => setYears(+e.target.value)} className="mt-1 w-full accent-cyan-400" />
              </label>
              <label>
                <span className="text-slate-500 font-mono text-[10px]">Gross Return: {grossReturn}%</span>
                <input type="range" min="5" max="30" value={grossReturn} onChange={e => setGrossReturn(+e.target.value)} className="mt-1 w-full accent-emerald-400" />
              </label>
            </div>

            <FeeDragChart etfs={selectedETFs} years={years} initial={initial} monthly={monthly} grossReturn={grossReturn} />

            {/* End values */}
            <div className="grid gap-3 mt-5" style={{ gridTemplateColumns: `repeat(${selectedETFs.length}, 1fr)` }}>
              {selectedETFs.map((etf, i) => {
                const sim = simulateFeeDrag({ initial, monthly, years, returnRate: grossReturn, ter: etf.ter });
                const last = sim[sim.length - 1];
                const ideal = simulateFeeDrag({ initial, monthly, years, returnRate: grossReturn, ter: 0 });
                const idealLast = ideal[ideal.length - 1];
                return (
                  <div key={etf.id} className="rounded-xl p-4 text-center" style={{ background: `${COLORS[i]}10`, border: `1px solid ${COLORS[i]}30` }}>
                    <p className="text-[10px] font-mono mb-1" style={{ color: COLORS[i] }}>{etf.ticker} · {etf.ter}% TER</p>
                    <p className="text-xl font-bold font-mono" style={{ color: COLORS[i] }}>{fmt(last.withFee)}</p>
                    <p className="text-[10px] font-mono text-red-400 mt-1">Fee drag: -{fmt(last.drag)}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Holdings Overlap */}
          {selectedETFs.length >= 2 && (
            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold text-slate-200 mb-4">Top-10 Holdings Overlap</h3>
              {selectedETFs.slice(0, -1).map((etfA, i) => (
                selectedETFs.slice(i + 1).map((etfB, j) => (
                  <div key={`${etfA.id}-${etfB.id}`} className="mb-3 pb-3 border-b border-white/5 last:border-0">
                    <p className="text-xs text-slate-500 mb-1 font-mono">
                      <span style={{ color: COLORS[i] }}>{etfA.ticker}</span>
                      <span className="mx-2">∩</span>
                      <span style={{ color: COLORS[i + j + 1] }}>{etfB.ticker}</span>
                    </p>
                    <OverlapBadge etfA={etfA} etfB={etfB} />
                  </div>
                ))
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}

function OverlapBadge({ etfA, etfB }) {
  const overlap = holdingsOverlap(etfA, etfB);
  if (overlap.length === 0) return <p className="text-xs text-slate-600 font-mono">No shared top-10 holdings — good diversification</p>;
  return (
    <div className="flex flex-wrap gap-1.5 mt-1">
      {overlap.map((h, i) => (
        <span key={i} className="badge-amber text-[10px] font-mono px-2 py-0.5 rounded-md">{h.name}</span>
      ))}
      <span className="text-[10px] text-slate-500 font-mono self-center">{overlap.length} shared</span>
    </div>
  );
}
