import React from 'react';
import { Activity, Globe, DollarSign, TrendingUp, BookOpen } from 'lucide-react';
import { METADATA, RATES } from '../data/etfService.js';

const NAV_VIEWS = [
  { id: 'overview', label: 'Command Overview' },
  { id: 'comparator', label: 'Fund Comparator' },
];

export default function Navbar({ view, setView, currency, setCurrency, onOpenTutorial }) {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = now.toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <header className="sticky top-0 z-50 w-full" style={{ background: 'rgba(6, 8, 14, 0.92)', borderBottom: '1px solid rgba(0, 242, 254, 0.12)', backdropFilter: 'blur(20px)' }}>
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4 flex-wrap">

        {/* Brand */}
        <div className="flex items-center gap-3 select-none">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(0,242,254,0.15) 0%, rgba(5,255,161,0.1) 100%)', border: '1px solid rgba(0,242,254,0.3)' }}>
            <Activity className="w-5 h-5" style={{ color: '#00f2fe' }} />
          </div>
          <div>
            <h1 className="text-sm font-bold leading-none tracking-wide" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              <span className="gradient-text">INVESTMENTS MONITORING</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mt-0.5">EasyEquities Intelligence · ZAR & USD</p>
          </div>
        </div>

        {/* Navigation tabs */}
        <nav className="flex items-center gap-1 p-1 rounded-xl" style={{ background: 'rgba(13,17,23,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
          {NAV_VIEWS.map(v => (
            <button
              key={v.id}
              onClick={() => setView(v.id)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                view === v.id
                  ? 'text-[#06080e]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              style={view === v.id ? { background: 'linear-gradient(135deg, #00f2fe, #05ffa1)', boxShadow: '0 0 16px rgba(0,242,254,0.4)' } : {}}
            >
              {v.label}
            </button>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          {/* Live status */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(5,255,161,0.06)', border: '1px solid rgba(5,255,161,0.15)' }}>
            <span className="pulse-dot" />
            <span className="text-[10px] font-mono text-slate-400">LIVE</span>
            <span className="text-[10px] font-mono text-slate-500 hidden md:block">· {dateStr} · {timeStr}</span>
          </div>

          {/* USD/ZAR rate badge */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(0,242,254,0.06)', border: '1px solid rgba(0,242,254,0.12)' }}>
            <Globe className="w-3 h-3" style={{ color: '#00f2fe' }} />
            <span className="text-[10px] font-mono text-slate-400">USD/ZAR</span>
            <span className="text-[10px] font-mono text-glow-cyan font-bold" style={{ color: '#00f2fe' }}>{RATES.rates.ZAR}</span>
          </div>

          {/* Currency Toggle */}
          <div className="flex items-center rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            {['ZAR', 'USD'].map(cur => (
              <button
                key={cur}
                onClick={() => setCurrency(cur)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold font-mono transition-all duration-200 ${
                  currency === cur ? 'text-[#06080e]' : 'text-slate-400 hover:text-white'
                }`}
                style={currency === cur
                  ? { background: cur === 'ZAR' ? 'linear-gradient(135deg, #00f2fe, #0ea5e9)' : 'linear-gradient(135deg, #05ffa1, #00d68f)', boxShadow: `0 0 14px ${cur === 'ZAR' ? 'rgba(0,242,254,0.5)' : 'rgba(5,255,161,0.5)'}` }
                  : { background: 'rgba(13,17,23,0.9)' }
                }
              >
                {cur === 'ZAR' ? <DollarSign className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                {cur}
              </button>
            ))}
          </div>

          {/* Tutorial / Help button */}
          <button
            onClick={onOpenTutorial}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:scale-105"
            style={{ background: 'rgba(0,242,254,0.08)', border: '1px solid rgba(0,242,254,0.25)', color: '#00f2fe' }}
            title="Open Tutorial"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Help</span>
          </button>
        </div>

      </div>
    </header>
  );
}
