import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, BookOpen, TrendingUp, Percent, Shield, ArrowLeftRight, BarChart3, Globe, DollarSign, Layers, Zap } from 'lucide-react';

// ─── SVG Illustrations ────────────────────────────────────────────────────────

function IllustrationETF() {
  return (
    <svg viewBox="0 0 320 180" className="w-full max-w-sm mx-auto" style={{ filter: 'drop-shadow(0 0 20px rgba(0,242,254,0.15))' }}>
      {/* Background */}
      <rect width="320" height="180" rx="12" fill="rgba(13,17,23,0.8)" />
      {/* Title label */}
      <text x="160" y="22" textAnchor="middle" fill="#00f2fe" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">1 ETF SHARE</text>
      {/* Central ETF box */}
      <rect x="110" y="30" width="100" height="40" rx="8" fill="rgba(0,242,254,0.12)" stroke="#00f2fe" strokeWidth="1.5" />
      <text x="160" y="55" textAnchor="middle" fill="#00f2fe" fontSize="12" fontFamily="JetBrains Mono" fontWeight="bold">STXNDQ</text>
      {/* Arrows down */}
      {[0,1,2,3,4].map(i => (
        <line key={i} x1={50 + i*55} y1="90" x2={50 + i*55} y2="80" stroke="rgba(5,255,161,0.5)" strokeWidth="1.5" markerEnd="url(#arr)" />
      ))}
      <defs>
        <marker id="arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="rgba(5,255,161,0.6)" />
        </marker>
      </defs>
      {/* Company boxes */}
      {[
        { x: 20, label: 'AAPL', pct: '8.9%', color: '#00f2fe' },
        { x: 75, label: 'MSFT', pct: '8.3%', color: '#05ffa1' },
        { x: 130, label: 'NVDA', pct: '7.8%', color: '#a78bfa' },
        { x: 185, label: 'AMZN', pct: '5.1%', color: '#fbbf24' },
        { x: 240, label: '+96 more', pct: '…', color: '#94a3b8' },
      ].map((c, i) => (
        <g key={i}>
          <rect x={c.x} y="100" width="55" height="52" rx="6" fill="rgba(255,255,255,0.04)" stroke={c.color} strokeWidth="1" />
          <text x={c.x + 27} y="121" textAnchor="middle" fill={c.color} fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">{c.label}</text>
          <text x={c.x + 27} y="136" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="JetBrains Mono">{c.pct}</text>
          <line x1={c.x + 27} y1="80" x2={c.x + 27} y2="100" stroke={`${c.color}60`} strokeWidth="1.5" strokeDasharray="3,2" />
        </g>
      ))}
      <text x="160" y="170" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="JetBrains Mono">Buying 1 share = owning a slice of ALL these companies</text>
    </svg>
  );
}

function IllustrationTER() {
  const years = [0,1,2,3,4,5,6,7,8,9,10];
  const noFee  = years.map(y => 100000 * Math.pow(1.15, y));
  const low    = years.map(y => 100000 * Math.pow(1.15 - 0.001, y));
  const high   = years.map(y => 100000 * Math.pow(1.15 - 0.0095, y));
  const maxV   = noFee[10];
  const W = 300, H = 120, padL = 10, padB = 15, padT = 10;
  function pt(i, arr) {
    return `${padL + (i / 10) * (W - padL)},${padT + H - ((arr[i] / maxV) * H)}`;
  }
  const pathNoFee = years.map((_, i) => pt(i, noFee)).join(' ');
  const pathLow   = years.map((_, i) => pt(i, low)).join(' ');
  const pathHigh  = years.map((_, i) => pt(i, high)).join(' ');

  return (
    <svg viewBox="0 0 320 180" className="w-full max-w-sm mx-auto">
      <rect width="320" height="180" rx="12" fill="rgba(13,17,23,0.8)" />
      <text x="160" y="20" textAnchor="middle" fill="#fbbf24" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">TER DRAG ON R100,000 OVER 10 YEARS</text>
      <g transform="translate(10,30)">
        <polyline points={pathNoFee} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeDasharray="4,3" />
        <polyline points={pathLow}   fill="none" stroke="#05ffa1" strokeWidth="2.5" />
        <polyline points={pathHigh}  fill="none" stroke="#f87171" strokeWidth="2.5" />
        {/* Axis */}
        <line x1="10" y1={padT + H} x2={W} y2={padT + H} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      </g>
      {/* Legend */}
      <g transform="translate(16,155)">
        <line x1="0" y1="5" x2="18" y2="5" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeDasharray="4,3" />
        <text x="22" y="9" fill="#94a3b8" fontSize="8" fontFamily="JetBrains Mono">No fees (ideal)</text>
        <line x1="90" y1="5" x2="108" y2="5" stroke="#05ffa1" strokeWidth="2" />
        <text x="112" y="9" fill="#05ffa1" fontSize="8" fontFamily="JetBrains Mono">0.19% TER → R{Math.round(low[10]/1000)}K</text>
        <line x1="210" y1="5" x2="228" y2="5" stroke="#f87171" strokeWidth="2" />
        <text x="232" y="9" fill="#f87171" fontSize="8" fontFamily="JetBrains Mono">0.95% TER → R{Math.round(high[10]/1000)}K</text>
      </g>
    </svg>
  );
}

function IllustrationTFSA() {
  return (
    <svg viewBox="0 0 320 180" className="w-full max-w-sm mx-auto">
      <rect width="320" height="180" rx="12" fill="rgba(13,17,23,0.8)" />
      {/* Two columns */}
      {/* Normal account */}
      <rect x="20" y="30" width="120" height="130" rx="10" fill="rgba(239,68,68,0.06)" stroke="rgba(239,68,68,0.3)" strokeWidth="1.5" />
      <text x="80" y="50" textAnchor="middle" fill="#f87171" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">NORMAL ACCOUNT</text>
      <text x="80" y="68" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="JetBrains Mono">R10,000 profit</text>
      <rect x="35" y="75" width="90" height="22" rx="5" fill="rgba(239,68,68,0.15)" />
      <text x="80" y="90" textAnchor="middle" fill="#f87171" fontSize="8" fontFamily="JetBrains Mono">CGT taken: -R1,800</text>
      <rect x="35" y="102" width="90" height="22" rx="5" fill="rgba(239,68,68,0.15)" />
      <text x="80" y="117" textAnchor="middle" fill="#f87171" fontSize="8" fontFamily="JetBrains Mono">Div tax: -R2,000</text>
      <line x1="35" y1="132" x2="125" y2="132" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <text x="80" y="148" textAnchor="middle" fill="#f87171" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">Keep R6,200</text>

      {/* TFSA account */}
      <rect x="180" y="30" width="120" height="130" rx="10" fill="rgba(5,255,161,0.06)" stroke="rgba(5,255,161,0.35)" strokeWidth="1.5" />
      <text x="240" y="50" textAnchor="middle" fill="#05ffa1" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">TFSA ACCOUNT</text>
      <text x="240" y="68" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="JetBrains Mono">R10,000 profit</text>
      <rect x="195" y="75" width="90" height="22" rx="5" fill="rgba(5,255,161,0.08)" />
      <text x="240" y="90" textAnchor="middle" fill="#05ffa1" fontSize="8" fontFamily="JetBrains Mono">CGT: R0 ✓ Tax-Free</text>
      <rect x="195" y="102" width="90" height="22" rx="5" fill="rgba(5,255,161,0.08)" />
      <text x="240" y="117" textAnchor="middle" fill="#05ffa1" fontSize="8" fontFamily="JetBrains Mono">Div tax: R0 ✓ Tax-Free</text>
      <line x1="195" y1="132" x2="285" y2="132" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <text x="240" y="148" textAnchor="middle" fill="#05ffa1" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">Keep R10,000 ★</text>

      {/* vs label */}
      <text x="160" y="100" textAnchor="middle" fill="#475569" fontSize="13" fontFamily="JetBrains Mono" fontWeight="bold">VS</text>
    </svg>
  );
}

function IllustrationCurrency() {
  return (
    <svg viewBox="0 0 320 180" className="w-full max-w-sm mx-auto">
      <rect width="320" height="180" rx="12" fill="rgba(13,17,23,0.8)" />
      <text x="160" y="22" textAnchor="middle" fill="#00f2fe" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">ZAR vs USD ACCOUNTS</text>

      {/* ZAR side */}
      <rect x="15" y="35" width="130" height="120" rx="10" fill="rgba(0,242,254,0.06)" stroke="rgba(0,242,254,0.25)" strokeWidth="1.5" />
      <text x="80" y="55" textAnchor="middle" fill="#00f2fe" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">ZAR (JSE)</text>
      <text x="80" y="72" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="JetBrains Mono">Pay in Rands</text>
      <text x="80" y="88" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="JetBrains Mono">TFSA eligible ✓</text>
      <text x="80" y="104" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="JetBrains Mono">Feeder fund wraps</text>
      <text x="80" y="118" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="JetBrains Mono">USD assets in ZAR</text>
      <text x="80" y="140" textAnchor="middle" fill="#00f2fe" fontSize="9" fontFamily="JetBrains Mono">STXWDM, STX40</text>
      <text x="80" y="152" textAnchor="middle" fill="#00f2fe" fontSize="9" fontFamily="JetBrains Mono">SYG500, GLOBAL…</text>

      {/* Arrow */}
      <text x="160" y="98" textAnchor="middle" fill="#475569" fontSize="18" fontFamily="JetBrains Mono">⇄</text>
      <text x="160" y="113" textAnchor="middle" fill="#475569" fontSize="7" fontFamily="JetBrains Mono">R18.25</text>
      <text x="160" y="123" textAnchor="middle" fill="#475569" fontSize="7" fontFamily="JetBrains Mono">per $1</text>

      {/* USD side */}
      <rect x="175" y="35" width="130" height="120" rx="10" fill="rgba(5,255,161,0.06)" stroke="rgba(5,255,161,0.25)" strokeWidth="1.5" />
      <text x="240" y="55" textAnchor="middle" fill="#05ffa1" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">USD (DriveWealth)</text>
      <text x="240" y="72" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="JetBrains Mono">Pay in Dollars</text>
      <text x="240" y="88" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="JetBrains Mono">No TFSA wrapper</text>
      <text x="240" y="104" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="JetBrains Mono">Own US ETFs directly</text>
      <text x="240" y="118" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="JetBrains Mono">Lowest TERs on earth</text>
      <text x="240" y="140" textAnchor="middle" fill="#05ffa1" fontSize="9" fontFamily="JetBrains Mono">VOO (0.03%)</text>
      <text x="240" y="152" textAnchor="middle" fill="#05ffa1" fontSize="9" fontFamily="JetBrains Mono">QQQ, VT…</text>
    </svg>
  );
}

function IllustrationKPI() {
  return (
    <svg viewBox="0 0 320 180" className="w-full max-w-sm mx-auto">
      <rect width="320" height="180" rx="12" fill="rgba(13,17,23,0.8)" />
      <text x="160" y="20" textAnchor="middle" fill="#00f2fe" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">COMMAND OVERVIEW CARDS</text>
      {[
        { x: 10,  label: 'Lowest TER', val: '0.03%', sub: 'VOO', color: '#05ffa1' },
        { x: 73,  label: 'Best 5Y',    val: '22.4%', sub: 'STXNDQ', color: '#00f2fe' },
        { x: 136, label: 'Best 3Y',    val: '23.6%', sub: 'STXNDQ', color: '#a78bfa' },
        { x: 199, label: 'Top Yield',  val: '6.2%',  sub: 'STXDIV', color: '#fbbf24' },
        { x: 262, label: 'TFSA Pick',  val: '22.4%', sub: 'STXNDQ', color: '#05ffa1' },
      ].map((c, i) => (
        <g key={i}>
          <rect x={c.x} y="30" width="58" height="90" rx="8" fill={`${c.color}10`} stroke={`${c.color}40`} strokeWidth="1" />
          <text x={c.x + 29} y="48" textAnchor="middle" fill={c.color} fontSize="7" fontFamily="JetBrains Mono">{c.label}</text>
          <text x={c.x + 29} y="68" textAnchor="middle" fill={c.color} fontSize="13" fontFamily="JetBrains Mono" fontWeight="bold">{c.val}</text>
          <text x={c.x + 29} y="85" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="JetBrains Mono" fontWeight="bold">{c.sub}</text>
          <text x={c.x + 29} y="110" textAnchor="middle" fill="#475569" fontSize="6.5" fontFamily="JetBrains Mono">↑ Click to open</text>
        </g>
      ))}
      <text x="160" y="145" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="JetBrains Mono">Each card shows the champion fund in that category</text>
      <text x="160" y="158" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="JetBrains Mono">Click any card to open the full fund fact sheet</text>
      <text x="160" y="172" textAnchor="middle" fill="#05ffa1" fontSize="8" fontFamily="JetBrains Mono">★ Star = best in category across your filtered fund list</text>
    </svg>
  );
}

function IllustrationComparator() {
  return (
    <svg viewBox="0 0 320 180" className="w-full max-w-sm mx-auto">
      <rect width="320" height="180" rx="12" fill="rgba(13,17,23,0.8)" />
      <text x="160" y="20" textAnchor="middle" fill="#00f2fe" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">FUND COMPARATOR</text>

      {/* Fund pills */}
      {[
        { x: 15,  label: 'SYG500', color: '#00f2fe' },
        { x: 100, label: 'VOO',    color: '#05ffa1' },
        { x: 180, label: 'STXNDQ', color: '#a78bfa' },
      ].map(c => (
        <g key={c.label}>
          <rect x={c.x} y="30" width="70" height="24" rx="6" fill={`${c.color}18`} stroke={`${c.color}50`} strokeWidth="1.5" />
          <text x={c.x + 35} y="46" textAnchor="middle" fill={c.color} fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">{c.label}</text>
        </g>
      ))}

      {/* Chart lines */}
      <polyline points="15,160 50,145 85,128 120,110 155,90 190,68 225,44" fill="none" stroke="#00f2fe" strokeWidth="2" strokeLinecap="round" />
      <polyline points="15,160 50,147 85,132 120,115 155,96 190,76 225,54" fill="none" stroke="#05ffa1" strokeWidth="2" strokeLinecap="round" />
      <polyline points="15,160 50,142 85,120 120,96 155,70 190,42 225,16" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" />

      {/* Axis */}
      <line x1="15" y1="165" x2="230" y2="165" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      {['Y1','Y2','Y3','Y4','Y5','Y6','Y7'].map((l, i) => (
        <text key={l} x={15 + i * 35} y="175" fill="#475569" fontSize="7" fontFamily="JetBrains Mono" textAnchor="middle">{l}</text>
      ))}

      {/* Gap annotation */}
      <line x1="225" y1="16" x2="225" y2="54" stroke="#f8717160" strokeWidth="1.5" strokeDasharray="3,2" />
      <text x="240" y="40" fill="#f87171" fontSize="7.5" fontFamily="JetBrains Mono">Fee gap</text>
      <text x="240" y="52" fill="#f87171" fontSize="7.5" fontFamily="JetBrains Mono">compounds!</text>
    </svg>
  );
}

function IllustrationModal() {
  return (
    <svg viewBox="0 0 320 180" className="w-full max-w-sm mx-auto">
      <rect width="320" height="180" rx="12" fill="rgba(13,17,23,0.8)" />
      <text x="160" y="18" textAnchor="middle" fill="#00f2fe" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">FUND DEEP-DIVE DRAWER</text>

      {/* Drawer outline */}
      <rect x="130" y="25" width="180" height="150" rx="8" fill="rgba(10,13,20,0.9)" stroke="rgba(0,242,254,0.3)" strokeWidth="1.5" />

      {/* Holdings bars */}
      {[
        { label: 'AAPL',   w: 110, pct: '8.9%', color: '#00f2fe' },
        { label: 'MSFT',   w: 103, pct: '8.3%', color: '#05ffa1' },
        { label: 'NVDA',   w: 97,  pct: '7.8%', color: '#a78bfa' },
        { label: 'AMZN',   w: 63,  pct: '5.1%', color: '#fbbf24' },
        { label: 'BRDCM',  w: 55,  pct: '4.4%', color: '#00f2fe' },
      ].map((h, i) => (
        <g key={h.label}>
          <text x="138" y={43 + i * 20} fill="#94a3b8" fontSize="7" fontFamily="JetBrains Mono">{h.label}</text>
          <rect x="168" y={33 + i * 20} width={h.w} height="12" rx="3" fill={`${h.color}25`} />
          <rect x="168" y={33 + i * 20} width={h.w} height="12" rx="3" fill={`${h.color}30`} stroke={h.color} strokeWidth="0.5" />
          <text x={173 + h.w} y={43 + i * 20} fill={h.color} fontSize="7" fontFamily="JetBrains Mono">{h.pct}</text>
        </g>
      ))}

      {/* Donut placeholder */}
      <circle cx="186" cy="145" r="22" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" />
      <circle cx="186" cy="145" r="22" fill="none" stroke="#00f2fe" strokeWidth="4" strokeDasharray="30 100" strokeLinecap="round" />
      <circle cx="186" cy="145" r="22" fill="none" stroke="#05ffa1" strokeWidth="4" strokeDasharray="20 100" strokeDashoffset="-30" strokeLinecap="round" />
      <circle cx="186" cy="145" r="22" fill="none" stroke="#a78bfa" strokeWidth="4" strokeDasharray="15 100" strokeDashoffset="-50" strokeLinecap="round" />
      <text x="186" y="149" textAnchor="middle" fill="#94a3b8" fontSize="7" fontFamily="JetBrains Mono">Sector</text>

      <text x="230" y="140" fill="#94a3b8" fontSize="7" fontFamily="JetBrains Mono">■ IT 50%</text>
      <text x="230" y="152" fill="#94a3b8" fontSize="7" fontFamily="JetBrains Mono">■ Cons 13%</text>
      <text x="230" y="164" fill="#94a3b8" fontSize="7" fontFamily="JetBrains Mono">■ Comm 15%</text>

      {/* Left panel hint */}
      <rect x="10" y="25" width="110" height="150" rx="8" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="4,3" />
      <text x="65" y="90" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="JetBrains Mono">Click any</text>
      <text x="65" y="104" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="JetBrains Mono">fund to open</text>
      <text x="65" y="118" textAnchor="middle" fill="#00f2fe" fontSize="8" fontFamily="JetBrains Mono">→ this drawer</text>
    </svg>
  );
}

// ─── Slide Definitions ────────────────────────────────────────────────────────

const SLIDES = [
  {
    id: 'welcome',
    icon: BookOpen,
    iconColor: '#00f2fe',
    title: 'Welcome to Your Investment Intelligence Dashboard',
    subtitle: 'A quick guided tour — 9 easy steps',
    body: (
      <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
        <p>This dashboard monitors and compares <strong className="text-white">premier Exchange Traded Funds (ETFs)</strong> available on your EasyEquities account — covering both your <strong style={{ color: '#00f2fe' }}>ZAR (South African Rand / JSE)</strong> and <strong style={{ color: '#05ffa1' }}>USD (US Dollar / DriveWealth)</strong> accounts.</p>
        <p>It was built to help you and your father <strong className="text-white">make smarter, lower-fee investment decisions</strong> by showing real data side-by-side in one clean view.</p>
        <div className="rounded-xl p-4" style={{ background: 'rgba(0,242,254,0.06)', border: '1px solid rgba(0,242,254,0.15)' }}>
          <p className="text-xs font-mono text-slate-400">In this tutorial you will learn:</p>
          <ul className="mt-2 space-y-1 text-xs text-slate-300">
            {['What an ETF is and why it matters','What TER and TIC mean and why fees destroy wealth','What a TFSA is and why it is powerful','How to read the KPI command cards','How to filter and sort the fund matrix','How to open a fund deep-dive fact sheet','How to compare 2–3 funds side by side','How to use the fee drag simulator','ZAR vs USD — which account for which fund'].map((t, i) => (
              <li key={i} className="flex items-start gap-2"><span style={{ color: '#00f2fe' }}>→</span>{t}</li>
            ))}
          </ul>
        </div>
      </div>
    ),
    illustration: null,
  },
  {
    id: 'etf',
    icon: Layers,
    iconColor: '#05ffa1',
    title: 'What is an ETF?',
    subtitle: 'Exchange Traded Fund — your instant diversified portfolio',
    body: (
      <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
        <p>An <strong className="text-white">ETF (Exchange Traded Fund)</strong> is a single share you buy on the stock exchange that automatically gives you ownership of <strong className="text-white">hundreds or even thousands of companies</strong> at once.</p>
        <p>Instead of buying Apple, then Microsoft, then NVIDIA one by one, you buy <strong style={{ color: '#05ffa1' }}>1 unit of STXNDQ</strong> and you instantly own a proportional slice of all 100 Nasdaq companies.</p>
        <div className="grid grid-cols-3 gap-2 text-xs">
          {[['🔒 Diversified','Spread risk across many companies automatically'],['💸 Low Cost','No stock-picking fees — just one small annual TER'],['📈 Passive Growth','Grows with the market automatically — no decisions needed']].map(([t, d]) => (
            <div key={t} className="rounded-lg p-2.5" style={{ background: 'rgba(5,255,161,0.06)', border: '1px solid rgba(5,255,161,0.15)' }}>
              <p className="font-semibold text-white mb-1">{t}</p>
              <p className="text-slate-400">{d}</p>
            </div>
          ))}
        </div>
      </div>
    ),
    illustration: <IllustrationETF />,
  },
  {
    id: 'ter',
    icon: Percent,
    iconColor: '#fbbf24',
    title: 'TER & TIC — Why Fees Are Everything',
    subtitle: 'The invisible tax that silently erodes your wealth',
    body: (
      <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
        <p>The <strong className="text-white">TER (Total Expense Ratio)</strong> is the annual fee charged by the fund manager. It is deducted automatically from the fund's value every year — you never see it leave your account, but it compounds against you silently.</p>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="rounded-lg p-3" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <p className="font-mono font-bold text-amber-400 mb-1">TER = Management Fee + VAT + Costs</p>
            <p className="text-slate-400">The percentage of your money taken annually to run the fund</p>
          </div>
          <div className="rounded-lg p-3" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <p className="font-mono font-bold text-red-400 mb-1">TIC = TER + Transaction Costs</p>
            <p className="text-slate-400">The true all-in cost — always look at TIC, not just TER</p>
          </div>
        </div>
        <p className="text-xs text-slate-400">The chart below shows the same R100,000 invested at 15% gross return, with a 0.19% TER (SYG500) vs a 0.95% TER (EASYGE). The difference over 10 years is <strong style={{ color: '#f87171' }}>tens of thousands of Rands.</strong></p>
      </div>
    ),
    illustration: <IllustrationTER />,
  },
  {
    id: 'tfsa',
    icon: Shield,
    iconColor: '#05ffa1',
    title: 'What is a TFSA?',
    subtitle: 'Tax-Free Savings Account — the most powerful account in South Africa',
    body: (
      <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
        <p>A <strong className="text-white">Tax-Free Savings Account (TFSA)</strong> is a special EasyEquities account where <strong style={{ color: '#05ffa1' }}>all growth, dividends, and capital gains are 100% tax-free</strong> — forever.</p>
        <div className="rounded-xl p-3 text-xs" style={{ background: 'rgba(5,255,161,0.06)', border: '1px solid rgba(5,255,161,0.2)' }}>
          <div className="grid grid-cols-2 gap-2">
            {[
              ['Annual Contribution Limit','R46,000 per year (raised from R36k)'],
              ['Lifetime Limit','R500,000 total (cumulative)'],
              ['Capital Gains Tax','R0 — completely tax free'],
              ['Dividend Withholding Tax','R0 — completely tax free'],
            ].map(([k, v]) => (
              <div key={k}>
                <p className="text-slate-500 font-mono text-[10px]">{k}</p>
                <p className="text-emerald-400 font-bold">{v}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-slate-400">⚠ Warning: Withdrawals count as a contribution permanently — once you contribute R500,000 lifetime you cannot add more, even if you withdraw. Use the TFSA for long-term holds only.</p>
      </div>
    ),
    illustration: <IllustrationTFSA />,
  },
  {
    id: 'currency',
    icon: Globe,
    iconColor: '#00f2fe',
    title: 'ZAR vs USD — Two Accounts, Two Strategies',
    subtitle: 'Understanding your EasyEquities JSE and US Dollar accounts',
    body: (
      <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
        <p>EasyEquities gives you <strong className="text-white">two separate accounts</strong> — one in South African Rands (JSE) and one in US Dollars (powered by DriveWealth).</p>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="rounded-lg p-3" style={{ background: 'rgba(0,242,254,0.07)', border: '1px solid rgba(0,242,254,0.2)' }}>
            <p className="font-bold text-cyan-400 mb-2">ZAR Account (JSE)</p>
            <ul className="space-y-1 text-slate-400">
              <li>✓ TFSA eligible</li>
              <li>✓ Pay in Rands directly</li>
              <li>✓ ETFs like STXWDM still track USD assets — you get a built-in Rand hedge</li>
              <li>⚠ Feeder funds add slight TER overhead vs direct USD ownership</li>
            </ul>
          </div>
          <div className="rounded-lg p-3" style={{ background: 'rgba(5,255,161,0.07)', border: '1px solid rgba(5,255,161,0.2)' }}>
            <p className="font-bold text-emerald-400 mb-2">USD Account (DriveWealth)</p>
            <ul className="space-y-1 text-slate-400">
              <li>✓ Own VOO at 0.03% — the cheapest possible</li>
              <li>✓ No feeder fund overhead</li>
              <li>⚠ Not TFSA eligible</li>
              <li>⚠ CGT and dividend tax apply</li>
              <li>⚠ US Estate Tax risk over $60,000</li>
            </ul>
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-1">Use the <strong className="text-white">currency toggle (ZAR / USD)</strong> in the top-right of the navbar to switch all projections between currencies instantly.</p>
      </div>
    ),
    illustration: <IllustrationCurrency />,
  },
  {
    id: 'kpi',
    icon: Zap,
    iconColor: '#00f2fe',
    title: 'Command Overview — The KPI Cards',
    subtitle: 'Your instant market intelligence snapshot',
    body: (
      <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
        <p>At the top of the <strong className="text-white">Command Overview</strong> page you will see 5 glowing cards. Each one is automatically calculated from your full fund list to surface the champion in each category:</p>
        <div className="grid grid-cols-1 gap-2 text-xs">
          {[
            ['🟢 Lowest TER', '#05ffa1', 'The fund with the smallest annual fee — the champion of compounding efficiency'],
            ['🔵 Best 5-Year Return', '#00f2fe', 'The fund with the highest annualized return over 5 years — your long-range alpha king'],
            ['🟣 Best 3-Year Return', '#a78bfa', 'The fund with the strongest performance over the medium-term 3-year window'],
            ['🟡 Top Dividend Yield', '#fbbf24', 'The fund paying the most cash dividends per year as a % of its price'],
            ['🟢 TFSA Top Pick', '#05ffa1', 'The best 5-year performer that is also TFSA eligible — your tax-free champion'],
          ].map(([t, c, d]) => (
            <div key={t} className="flex items-start gap-3 rounded-lg px-3 py-2" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <span className="text-sm shrink-0">{t.split(' ')[0]}</span>
              <div>
                <span className="font-semibold" style={{ color: c }}>{t.split(' ').slice(1).join(' ')}</span>
                <span className="text-slate-500 ml-2">{d}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400">👆 <strong className="text-white">Click any KPI card</strong> to instantly open that fund's full fact sheet.</p>
      </div>
    ),
    illustration: <IllustrationKPI />,
  },
  {
    id: 'matrix',
    icon: BarChart3,
    iconColor: '#a78bfa',
    title: 'The Fund Matrix — Filter & Sort All Funds',
    subtitle: 'Your full sortable, filterable fund comparison table',
    body: (
      <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
        <p>Scroll down on the <strong className="text-white">Command Overview</strong> page to reach the <strong className="text-white">Fund Matrix</strong>. This shows all 11 monitored funds in a sortable table.</p>
        <div className="space-y-2 text-xs">
          <p className="font-semibold text-slate-200">How to use the filters:</p>
          {[
            ['Search bar', 'Type any ticker (e.g. "VOO") or fund name to find it instantly'],
            ['ZAR / USD toggle', 'Show only your Rand account funds, or only your Dollar account funds'],
            ['TFSA Only', 'Filter to only show funds eligible for your Tax-Free Savings Account'],
            ['Category dropdown', 'Filter by fund type: US Large-Cap, Global Developed, Dividend, etc.'],
            ['Max TER slider', 'Drag left to hide expensive funds above your chosen fee threshold'],
          ].map(([k, v]) => (
            <div key={k} className="flex gap-2 items-start rounded-lg px-3 py-2" style={{ background: 'rgba(121,40,202,0.07)', border: '1px solid rgba(121,40,202,0.15)' }}>
              <span className="font-mono font-bold text-violet-400 shrink-0 w-28">{k}</span>
              <span className="text-slate-400">{v}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400">Click any <strong className="text-cyan-400">column header</strong> to sort. Click <strong className="text-cyan-400">+ Compare</strong> on any fund to add it to the comparator.</p>
      </div>
    ),
    illustration: null,
  },
  {
    id: 'modal',
    icon: BookOpen,
    iconColor: '#00f2fe',
    title: 'Deep-Dive Fund Drawer',
    subtitle: 'Click any fund to see its full fact sheet, holdings, and fee simulator',
    body: (
      <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
        <p>Clicking <strong className="text-white">any fund</strong> (from a KPI card, the matrix table, or the fee matrix bars) opens a <strong style={{ color: '#00f2fe' }}>slide-in drawer</strong> from the right with the fund's complete intelligence breakdown:</p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            ['📊 Key Stats', 'TER, TIC, dividend yield, inception year at a glance'],
            ['📈 Trailing Returns', '1-year, 3-year, and 5-year annualized returns'],
            ['🏦 Top 10 Holdings', 'Visual bar chart of the fund\'s biggest underlying stocks'],
            ['🌍 Sector & Geography', 'Donut charts showing where your money actually goes'],
            ['⚖️ Why It Ranks', 'Plain-English pros, risks, and ideal investor summary'],
            ['🧮 Fee Simulator', 'Enter your own numbers to see fee drag on your portfolio'],
          ].map(([t, d]) => (
            <div key={t} className="rounded-lg p-2.5" style={{ background: 'rgba(0,242,254,0.05)', border: '1px solid rgba(0,242,254,0.12)' }}>
              <p className="font-semibold text-white mb-1">{t}</p>
              <p className="text-slate-400">{d}</p>
            </div>
          ))}
        </div>
      </div>
    ),
    illustration: <IllustrationModal />,
  },
  {
    id: 'comparator',
    icon: ArrowLeftRight,
    iconColor: '#05ffa1',
    title: 'Fund Comparator — See Them Side by Side',
    subtitle: 'Pick 2–3 funds and watch the fee drag chart tell the truth',
    body: (
      <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
        <p>The <strong className="text-white">Fund Comparator</strong> tab lets you pit up to 3 funds against each other with real compound math. This is where the fee differences become impossible to ignore.</p>
        <div className="space-y-2 text-xs">
          <p className="font-semibold text-slate-200">How to use it:</p>
          {[
            ['Step 1', 'Click "+ Compare" on 2 or 3 funds in the matrix table'],
            ['Step 2', 'A tray appears at the top — click "Open Comparator →"'],
            ['Step 3', 'Set your lump sum amount, monthly contribution, and time horizon'],
            ['Step 4', 'Watch the fee drag chart show you exactly how much each fund\'s TER costs you over time'],
            ['Step 5', 'Scroll down to see overlapping holdings between funds — useful to avoid hidden doubling up'],
          ].map(([k, v]) => (
            <div key={k} className="flex gap-3 items-start">
              <span className="font-mono font-bold text-emerald-400 shrink-0">{k}</span>
              <span className="text-slate-400">{v}</span>
            </div>
          ))}
        </div>
        <div className="rounded-xl p-3 text-xs" style={{ background: 'rgba(5,255,161,0.06)', border: '1px solid rgba(5,255,161,0.15)' }}>
          <p className="text-emerald-400 font-semibold mb-1">💡 Pro tip — try this comparison first:</p>
          <p className="text-slate-300"><strong className="text-white">SYG500 (0.19% TER)</strong> vs <strong className="text-white">EASYGE (0.95% TIC)</strong> over 20 years on R500,000. The gap will surprise you.</p>
        </div>
      </div>
    ),
    illustration: <IllustrationComparator />,
  },
];

// ─── Main Tutorial Component ──────────────────────────────────────────────────

export default function TutorialModal({ onClose }) {
  const [step, setStep] = useState(0);
  const slide = SLIDES[step];
  const Icon = slide.icon;
  const total = SLIDES.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 modal-backdrop" />

      <div
        className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl"
        style={{ background: 'rgba(10,13,20,0.98)', border: '1px solid rgba(0,242,254,0.25)', boxShadow: '0 0 60px rgba(0,242,254,0.1), 0 25px 60px rgba(0,0,0,0.7)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between" style={{ background: 'rgba(10,13,20,0.95)', borderBottom: '1px solid rgba(0,242,254,0.1)', backdropFilter: 'blur(12px)' }}>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl" style={{ background: `${slide.iconColor}18`, border: `1px solid ${slide.iconColor}40` }}>
              <Icon className="w-4 h-4" style={{ color: slide.iconColor }} />
            </div>
            <div>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Tutorial · Step {step + 1} of {total}</p>
              <p className="text-sm font-bold text-white leading-tight">{slide.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 transition-all" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-0.5 w-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <div className="h-full transition-all duration-500" style={{ width: `${((step + 1) / total) * 100}%`, background: 'linear-gradient(90deg, #00f2fe, #05ffa1)' }} />
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-xs font-mono text-slate-500 mb-4">{slide.subtitle}</p>

          {/* Illustration */}
          {slide.illustration && (
            <div className="mb-5">
              {slide.illustration}
            </div>
          )}

          {/* Content */}
          {slide.body}
        </div>

        {/* Footer nav */}
        <div className="sticky bottom-0 px-6 py-4 flex items-center justify-between gap-4" style={{ background: 'rgba(10,13,20,0.95)', borderTop: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)' }}>
          {/* Step dots */}
          <div className="flex gap-1.5 flex-wrap">
            {SLIDES.map((s, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === step ? '20px' : '6px',
                  height: '6px',
                  background: i === step ? '#00f2fe' : i < step ? 'rgba(0,242,254,0.4)' : 'rgba(255,255,255,0.1)',
                  boxShadow: i === step ? '0 0 8px rgba(0,242,254,0.6)' : 'none',
                }}
                title={SLIDES[i].title}
              />
            ))}
          </div>

          <div className="flex gap-2">
            {step > 0 && (
              <button
                onClick={() => setStep(s => s - 1)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 transition-all hover:text-white"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Back
              </button>
            )}
            {step < total - 1 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-[#06080e] transition-all"
                style={{ background: 'linear-gradient(135deg, #00f2fe, #05ffa1)', boxShadow: '0 0 16px rgba(0,242,254,0.4)' }}
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-[#06080e] transition-all"
                style={{ background: 'linear-gradient(135deg, #05ffa1, #00d68f)', boxShadow: '0 0 16px rgba(5,255,161,0.4)' }}
              >
                Start Exploring ★
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
