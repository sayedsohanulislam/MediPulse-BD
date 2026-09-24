import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, ShieldCheck, Heart, ExternalLink, Activity } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const QUICK_LINKS = [
  { to:'/',          label:'Overview Dashboard' },
  { to:'/live-grid', label:'Live Health Map' },
  { to:'/hospitals', label:'ICU & Hospital Finder' },
  { to:'/blood',     label:'Blood SOS Network' },
  { to:'/medicines', label:'Medicine Price Guide' },
  { to:'/services',  label:'Citizen Smart Tools' },
  { to:'/authority', label:'Authority Portal' },
];

const HOTLINES = [
  { num:'999',   label:'Police, Fire & Ambulance',   color:'#f43f5e' },
  { num:'16263', label:'Shastho Batayon Doctor',     color:'#10b981' },
  { num:'333',   label:'Citizen & Disaster Redressal', color:'#0ea5e9' },
  { num:'16000', label:'DGDA Drug Helpline',         color:'#8b5cf6' },
  { num:'106',   label:'Anti-Corruption Rights',     color:'#f59e0b' },
];

const DATA_SOURCES = [
  'OpenAQ / Open-Meteo (Air Quality)',
  'OSRM Dynamic Ambulance Routing',
  'DGDA Official Medicine Gazette',
  'DGHS Vector Disease Tracking',
  'National Blood Donor Registry (64 Districts)',
  'Hospital ICU Synchronization API',
];

export default function Footer() {
  const { t, lang } = useLanguage();

  return (
    <footer className="relative overflow-hidden mt-16"
      style={{ background:'linear-gradient(135deg,#020617 0%,#0c1445 40%,#020617 100%)' }}>

      {/* Top glow accent */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background:'linear-gradient(90deg,transparent,rgba(14,165,233,0.5),rgba(244,63,94,0.3),transparent)' }} />

      {/* Background orbs */}
      <div className="absolute bottom-0 right-0 w-96 h-96 opacity-10 pointer-events-none"
        style={{ background:'radial-gradient(circle,#0ea5e9,transparent)',filter:'blur(80px)' }} />
      <div className="absolute top-0 left-0 w-72 h-72 opacity-8 pointer-events-none"
        style={{ background:'radial-gradient(circle,#f43f5e,transparent)',filter:'blur(80px)' }} />

      <div className="max-w-7xl mx-auto px-4 py-14 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-xl"
                style={{ background:'linear-gradient(135deg,#0ea5e9,#6366f1,#e11d48)' }}>
                <HeartPulse className="w-5.5 h-5.5 text-white" />
              </div>
              <div>
                <div className="text-lg font-black text-white leading-none">
                  <span style={{ color:'#38bdf8' }}>Medi</span>
                  <span style={{ color:'#fb7185' }}>Pulse</span>
                  <span className="text-white"> BD</span>
                </div>
                <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">National Health Grid</div>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-5">
              {t('tagline')}. Empowering <span className="text-sky-400 font-semibold">170M+</span> citizens
              with real-time emergency healthcare intelligence across Bangladesh.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                All systems operational
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-500" />
                Public Service Initiative · Bangladesh
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <div className="text-white font-extrabold text-sm mb-5 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-gradient-to-b from-sky-400 to-blue-600 inline-block" />
              Quick Navigation
            </div>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map(l => (
                <li key={l.to}>
                  <Link to={l.to}
                    className="text-sm text-slate-400 hover:text-white transition-colors no-underline
                      flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-slate-700 group-hover:bg-sky-400 transition-colors flex-shrink-0" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hotlines */}
          <div>
            <div className="text-white font-extrabold text-sm mb-5 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-gradient-to-b from-rose-400 to-rose-600 inline-block" />
              National Hotlines
            </div>
            <ul className="space-y-3">
              {HOTLINES.map(h => (
                <li key={h.num} className="flex items-center gap-2.5">
                  <a href={`tel:${h.num}`}
                    className="text-base font-black no-underline hover:opacity-80 transition-opacity flex-shrink-0"
                    style={{ color:h.color }}>{h.num}</a>
                  <span className="text-xs text-slate-500">{h.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Data sources */}
          <div>
            <div className="text-white font-extrabold text-sm mb-5 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-gradient-to-b from-emerald-400 to-teal-600 inline-block" />
              Live Data Sources
            </div>
            <ul className="space-y-2">
              {DATA_SOURCES.map((s,i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-600 mt-1.5 flex-shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop:'1px solid rgba(255,255,255,0.07)' }}>
          <div className="text-xs text-slate-500">
            © 2026 <span className="text-slate-300 font-semibold">MediPulse BD</span> — Built for the healthcare resilience of Bangladesh.
          </div>
          <div className="flex items-center gap-6 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              Made with <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" /> in Dhaka
            </span>
            <a href="https://github.com" target="_blank" rel="noreferrer"
              className="flex items-center gap-1 text-slate-500 hover:text-sky-400 transition no-underline">
              <ExternalLink className="w-3.5 h-3.5" /> GitHub Portfolio
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
