import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Activity, ShieldAlert, HeartPulse, Building2, Pill,
  Grid, Shield, Globe, User, LogOut, RefreshCw, Menu, X,
  Wind, Thermometer, Droplets
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useTelemetry } from '../context/TelemetryContext';

const NAV = [
  { to:'/',          icon:Activity,   en:'Overview',         bn:'হোম',               accent:'sky' },
  { to:'/live-grid', icon:HeartPulse, en:'Live Map',         bn:'লাইভ ম্যাপ',       accent:'emerald' },
  { to:'/hospitals', icon:Building2,  en:'ICU & Hospitals',  bn:'হাসপাতাল',         accent:'blue' },
  { to:'/blood',     icon:ShieldAlert,en:'Blood SOS',        bn:'রক্ত SOS',          accent:'rose' },
  { to:'/medicines', icon:Pill,       en:'Medicines',        bn:'ওষুধ',              accent:'violet' },
  { to:'/services',  icon:Grid,       en:'Services',         bn:'সেবা',              accent:'amber' },
  { to:'/authority', icon:Shield,     en:'Authority',        bn:'কর্তৃপক্ষ',        accent:'slate' },
];

const ACCENT_COLORS = {
  sky:     { bg:'bg-sky-50',     text:'text-sky-700',     icon:'text-sky-600',     mob:'bg-sky-100' },
  emerald: { bg:'bg-emerald-50', text:'text-emerald-700', icon:'text-emerald-600', mob:'bg-emerald-100' },
  blue:    { bg:'bg-blue-50',    text:'text-blue-700',    icon:'text-blue-600',    mob:'bg-blue-100' },
  rose:    { bg:'bg-rose-50',    text:'text-rose-700',    icon:'text-rose-600',    mob:'bg-rose-100' },
  violet:  { bg:'bg-violet-50',  text:'text-violet-700',  icon:'text-violet-600',  mob:'bg-violet-100' },
  amber:   { bg:'bg-amber-50',   text:'text-amber-700',   icon:'text-amber-600',   mob:'bg-amber-100' },
  slate:   { bg:'bg-slate-100',  text:'text-slate-700',   icon:'text-slate-500',   mob:'bg-slate-100' },
};

export default function Navbar({ onOpenAuth }) {
  const { lang, toggleLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const { telemetry, isRefreshing, forceRefresh } = useTelemetry();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', fn, { passive:true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  useEffect(() => { setOpen(false); }, [location.pathname]);

  const aqi    = telemetry?.airQuality?.usAqi      || '--';
  const dengue = telemetry?.weather?.dengueRisk?.score || '--';
  const temp   = telemetry?.weather?.current?.temperature || '--';
  const humid  = telemetry?.weather?.current?.humidity    || '--';

  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'shadow-xl border-b border-slate-200/70'
          : 'border-b border-slate-200'
      }`}
      style={scrolled?{
        background:'rgba(255,255,255,0.88)',
        backdropFilter:'blur(20px) saturate(180%)',
        WebkitBackdropFilter:'blur(20px) saturate(180%)'
      }:{ background:'white' }}>

        {/* ── Top Ticker ── */}
        <div style={{ background:'linear-gradient(90deg,#020617,#0c1445,#020617)' }}
          className="text-slate-300 px-4 py-1.5 text-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                {t('live_sync_status')}
              </span>

              {/* Stat chips */}
              {[{
                icon:<Wind className="w-3 h-3" />, label:'AQI',
                val:aqi, hi:aqi>150, color:'text-amber-400'
              },{
                icon:<ShieldAlert className="w-3 h-3" />, label:'Dengue',
                val:`${dengue}/100`, hi:dengue>70, color:'text-rose-400'
              },{
                icon:<Thermometer className="w-3 h-3" />, label:'Temp',
                val:`${temp}°C`, hi:false, color:'text-sky-400'
              }].map((c,i) => (
                <span key={i} className="hidden sm:flex items-center gap-1 pl-3 border-l border-slate-700">
                  <span className={c.hi?'text-amber-400 sm:text-rose-400':'text-slate-400'}>{c.icon}</span>
                  <span className="text-slate-500">{c.label}:</span>
                  <strong className={c.hi?'text-amber-400':c.color}>{c.val}</strong>
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button onClick={forceRefresh} disabled={isRefreshing}
                className="flex items-center gap-1 hover:text-white transition disabled:opacity-50">
                <RefreshCw className={`w-3 h-3 ${isRefreshing?'animate-spin text-sky-400':''}`} />
                <span className="hidden sm:inline text-[11px]">{isRefreshing?'Syncing...':t('refresh_sync')}</span>
              </button>

              <button onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-slate-700
                  bg-slate-800 hover:bg-slate-700 text-sky-400 text-[11px] font-bold transition">
                <Globe className="w-3 h-3" />
                {lang==='en'?'বাংলা':'EN'}
              </button>
            </div>
          </div>
        </div>

        {/* ── Main Nav ── */}
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5 no-underline group flex-shrink-0">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg
              group-hover:shadow-sky-500/30 group-hover:scale-105 transition-all duration-300"
              style={{ background:'linear-gradient(135deg,#0ea5e9,#6366f1,#e11d48)' }}>
              <HeartPulse className="w-5 h-5 text-white" style={{ filter:'drop-shadow(0 0 4px rgba(255,255,255,0.5))' }} />
            </div>
            <div className="hidden sm:block">
              <div className="text-[17px] font-black tracking-tight leading-none">
                <span style={{ color:'#0ea5e9' }}>Medi</span>
                <span style={{ color:'#e11d48' }}>Pulse</span>
                <span className="text-slate-700"> BD</span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium tracking-widest uppercase mt-0.5">
                {lang==='en'?'National Healthcare Grid':'জাতীয় স্বাস্থ্যসেবা গ্রিড'}
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-0.5">
            {NAV.map(link => {
              const Icon = link.icon;
              const active = location.pathname === link.to;
              const ac = ACCENT_COLORS[link.accent];
              return (
                <Link key={link.to} to={link.to} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[13px]
                  font-semibold transition-all duration-200 no-underline ${
                  active ? `${ac.bg} ${ac.text}` : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}>
                  <Icon className={`w-3.5 h-3.5 ${ active?ac.icon:'text-slate-400' }`} />
                  {lang==='bn'?link.bn:link.en}
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {user ? (
              <div className="hidden sm:flex items-center gap-2 pl-3 pr-1.5 py-1.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="w-7 h-7 rounded-xl flex items-center justify-center"
                  style={{ background:'linear-gradient(135deg,#0ea5e9,#6366f1)' }}>
                  <User className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-xs font-bold text-slate-800 max-w-[90px] truncate">{user.name}</span>
                <span className="text-[10px] bg-sky-100 text-sky-700 px-1.5 py-0.5 rounded-full font-extrabold uppercase">{user.role}</span>
                <button onClick={logout} className="ml-1 text-slate-400 hover:text-rose-500 transition p-1 rounded-lg hover:bg-rose-50"
                  title="Logout"><LogOut className="w-3.5 h-3.5" /></button>
              </div>
            ) : (
              <button onClick={onOpenAuth}
                className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-white px-4 py-2 rounded-xl shadow-md
                  transition-all hover:-translate-y-0.5 hover:shadow-lg"
                style={{ background:'linear-gradient(135deg,#0ea5e9,#0284c7)',boxShadow:'0 4px 12px rgba(14,165,233,0.35)' }}>
                <User className="w-3.5 h-3.5" />{t('btn_login')}
              </button>
            )}

            <button onClick={() => setOpen(true)}
              className="xl:hidden w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200
                flex items-center justify-center text-slate-700 transition shadow-sm">
              <Menu className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Overlay */}
      {open && <div className="mobile-menu-overlay xl:hidden" onClick={() => setOpen(false)} />}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-72 bg-white z-[200] shadow-2xl flex flex-col
        transform transition-transform duration-300 ease-out xl:hidden ${
        open ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Drawer Header */}
        <div className="p-5 flex items-center justify-between"
          style={{ background:'linear-gradient(135deg,#0c1445,#020617)' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background:'linear-gradient(135deg,#0ea5e9,#e11d48)' }}>
              <HeartPulse className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <div className="text-sm font-black text-white">
                <span className="text-sky-400">Medi</span><span className="text-rose-400">Pulse</span> BD
              </div>
              <div className="text-[9px] text-slate-400 uppercase tracking-widest">National Health Grid</div>
            </div>
          </div>
          <button onClick={() => setOpen(false)}
            className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {NAV.map(link => {
            const Icon = link.icon;
            const active = location.pathname === link.to;
            const ac = ACCENT_COLORS[link.accent];
            return (
              <Link key={link.to} to={link.to}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl font-semibold text-sm no-underline transition-all ${
                  active ? `${ac.bg} ${ac.text} shadow-sm` : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}>
                <span className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  active ? ac.mob : 'bg-slate-100'
                }`}>
                  <Icon className={`w-4 h-4 ${active ? ac.icon : 'text-slate-400'}`} />
                </span>
                {lang==='bn'?link.bn:link.en}
              </Link>
            );
          })}
        </nav>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-100 space-y-2">
          {user ? (
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background:'linear-gradient(135deg,#0ea5e9,#6366f1)' }}>
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">{user.name}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">{user.role}</div>
                </div>
              </div>
              <button onClick={logout} className="text-slate-400 hover:text-rose-500 transition p-1.5 rounded-lg hover:bg-rose-50">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button onClick={() => { setOpen(false); onOpenAuth(); }}
              className="w-full text-white font-bold text-sm py-3 rounded-2xl flex items-center justify-center gap-2 shadow-md"
              style={{ background:'linear-gradient(135deg,#0ea5e9,#0284c7)',boxShadow:'0 4px 14px rgba(14,165,233,0.3)' }}>
              <User className="w-4 h-4" />{t('btn_login')} / {t('btn_demo')}
            </button>
          )}
          <button onClick={toggleLanguage}
            className="w-full border border-slate-200 text-slate-700 font-semibold text-sm py-2.5 rounded-2xl
              flex items-center justify-center gap-2 hover:bg-slate-50 transition">
            <Globe className="w-4 h-4 text-sky-500" />
            {lang==='en'?'বাংলায় দেখুন':'Switch to English'}
          </button>
        </div>
      </div>
    </>
  );
}
