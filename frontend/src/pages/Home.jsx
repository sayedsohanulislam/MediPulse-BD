import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  HeartPulse, ShieldAlert, Building2, Pill, Activity, PhoneCall,
  MapPin, Wind, Thermometer, Droplets, ArrowRight,
  Heart, Search, Shield, Zap, ChevronRight, Sparkles,
  TrendingUp, Clock, Users
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTelemetry } from '../context/TelemetryContext';
import { healthApi, bloodApi, operationsApi } from '../services/api';

/* ── Animated Counter Hook ── */
const useCounter = (target, duration = 2000, start = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start || !target) return;
    let raf, startTime = null;
    const num = parseInt(String(target).replace(/[^0-9]/g, ''));
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      const e = 1 - Math.pow(1 - p, 4);
      setCount(Math.floor(e * num));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);
  return count;
};

/* ── Stat Pill ── */
const StatPill = ({ value, suffix, label, color, started, delay = 0 }) => {
  const count = useCounter(value, 2000, started);
  return (
    <div className="flex flex-col items-center gap-1" style={{ animationDelay: `${delay}ms` }}>
      <div className={`display-num stat-counter ${color}`}>
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-xs text-slate-400 font-medium tracking-wide uppercase">{label}</div>
    </div>
  );
};

/* ── Circular Progress ── */
const CircleMetric = ({ value, max = 100, color, label, unit = '' }) => {
  const pct = Math.min((value / max) * 100, 100);
  const r = 28; const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  const strokeColor = value > 75 ? '#f43f5e' : value > 50 ? '#f59e0b' : '#10b981';
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative flex items-center justify-center" style={{ width: 72, height: 72 }}>
        <svg width="72" height="72" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
          <circle
            cx="36" cy="36" r={r} fill="none"
            stroke={strokeColor} strokeWidth="5"
            strokeDasharray={c} strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.34,1.56,0.64,1)' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white font-extrabold text-sm">{value}{unit}</span>
        </div>
      </div>
      <span className="text-[10px] text-slate-400 text-center leading-tight">{label}</span>
    </div>
  );
};

const Home = ({ onOpenSosModal, onOpenAuth }) => {
  const { t, lang } = useLanguage();
  const { telemetry, isRefreshing, forceRefresh } = useTelemetry();
  const [regionalRisks, setRegionalRisks] = useState([]);
  const [activeSos, setActiveSos] = useState([]);
  const [speedDial, setSpeedDial] = useState([]);
  const [countersStarted, setCountersStarted] = useState(false);

  useEffect(() => {
    healthApi.getRegionalRisks().then(r => { if (r.data.success) setRegionalRisks(r.data.data); }).catch(() => {});
    bloodApi.getActiveSos().then(r => { if (r.data.success) setActiveSos(r.data.data); }).catch(() => {});
    operationsApi.getSpeedDial().then(r => { if (r.data.success) setSpeedDial(r.data.data); }).catch(() => {});
    const t = setTimeout(() => setCountersStarted(true), 700);
    return () => clearTimeout(t);
  }, []);

  const weather  = telemetry?.weather?.current || {};
  const dengue   = telemetry?.weather?.dengueRisk || {};
  const aqi      = telemetry?.airQuality || {};
  const fx       = telemetry?.exchangeRates || {};
  const aqiVal   = aqi.usAqi    || 188;
  const dengueVal = dengue.score || 82;

  return (
    <div className="space-y-10 pb-16 page-container">

      {/* ═══════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════ */}
      <section className="relative overflow-hidden rounded-3xl text-white"
        style={{
          background: 'linear-gradient(135deg, #020617 0%, #0c1445 30%, #0f172a 60%, #020617 100%)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)'
        }}
      >
        {/* Aurora blobs */}
        <div className="hero-aurora animate-aurora" style={{ width:600,height:600,top:'-200px',right:'-100px',background:'radial-gradient(circle,rgba(14,165,233,0.18) 0%,rgba(99,102,241,0.10) 40%,transparent 70%)' }} />
        <div className="hero-aurora" style={{ width:500,height:500,bottom:'-150px',left:'-80px',background:'radial-gradient(circle,rgba(244,63,94,0.12) 0%,rgba(139,92,246,0.08) 40%,transparent 70%)',animationDelay:'6s',animation:'auroraMove 15s ease-in-out infinite' }} />
        <div className="hero-aurora" style={{ width:300,height:300,top:'30%',left:'35%',background:'radial-gradient(circle,rgba(16,185,129,0.08) 0%,transparent 60%)',animationDelay:'3s',animation:'auroraMove 10s ease-in-out infinite reverse' }} />

        {/* Dot grid overlay */}
        <div style={{
          position:'absolute',inset:0,
          backgroundImage:'radial-gradient(circle,rgba(255,255,255,0.06) 1px,transparent 1px)',
          backgroundSize:'28px 28px',
          maskImage:'linear-gradient(to bottom,transparent,rgba(0,0,0,0.4) 20%,rgba(0,0,0,0.4) 80%,transparent)',
          pointerEvents:'none'
        }} />

        <div className="relative z-10 p-6 sm:p-10 lg:p-14">
          <div className="lg:flex lg:items-center lg:gap-16">

            {/* ── Left content ── */}
            <div className="flex-1 max-w-2xl">
              {/* Live badge */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border mb-6"
                style={{ background:'rgba(14,165,233,0.12)',borderColor:'rgba(14,165,233,0.3)',backdropFilter:'blur(8px)' }}>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute h-full w-full rounded-full bg-sky-400 opacity-80" />
                  <span className="relative rounded-full h-2.5 w-2.5 bg-sky-400" />
                </span>
                <span className="text-sky-300 text-xs font-bold tracking-wide">
                  {lang==='en' ? 'LIVE · National Emergency Health Network · Bangladesh' : 'লাইভ · জাতীয় জরুরি স্বাস্থ্য নেটওয়ার্ক · বাংলাদেশ'}
                </span>
              </div>

              <h1 className="font-black tracking-tight leading-[1.05] mb-5"
                style={{ fontSize:'clamp(2rem,5vw,3.6rem)' }}>
                {lang==='en' ? (
                  <><span className="gradient-text">Intelligent</span> Healthcare<br />&amp; Epidemic Command<br />
                  <span style={{ color:'rgba(255,255,255,0.6)',fontSize:'0.65em',fontWeight:600 }}>for the People of Bangladesh</span></>
                ) : (
                  <><span className="gradient-text">স্মার্ট স্বাস্থ্যসেবা</span><br />ও মহামারী প্রতিরোধ গ্রিড<br />
                  <span style={{ color:'rgba(255,255,255,0.6)',fontSize:'0.65em',fontWeight:600 }}>বাংলাদেশের ১৭ কোটি মানুষের জন্য</span></>
                )}
              </h1>

              <p className="text-slate-300 leading-relaxed mb-8 max-w-xl" style={{ fontSize:'clamp(0.9rem,2vw,1.05rem)' }}>
                {lang==='en'
                  ? 'Real-time hospital ICU tracking, instant blood SOS matching, automated Dengue & AQI hazard detection, and DGDA medicine price intelligence — all in one platform.'
                  : 'হাসপাতালের লাইভ আইসিইউ ট্র্যাকিং, জরুরি রক্তদাতা ম্যাচিং, ডেঙ্গু ও বায়ুদূষণ পূর্বাভাস এবং সরকারি ওষুধ মূল্য নির্দেশিকা — সব এক প্ল্যাটফর্মে।'}
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <button onClick={onOpenSosModal} className="btn-danger text-sm animate-sos">
                  <ShieldAlert className="w-4 h-4" />
                  {t('urgent_sos')}
                </button>
                <Link to="/hospitals" className="btn-primary text-sm no-underline">
                  <Building2 className="w-4 h-4" /> Find ICU Beds
                </Link>
                <Link to="/live-grid" className="btn-ghost text-sm no-underline">
                  <MapPin className="w-4 h-4 text-emerald-400" /> Live Map
                </Link>
              </div>

              {/* Trust badges */}
              <div className="mt-7 flex flex-wrap items-center gap-4">
                {[
                  { icon:'🛡️', text:'DGDA Verified Data' },
                  { icon:'🔒', text:'End-to-End Secure' },
                  { icon:'⚡', text:'Sub-3s Response' },
                  { icon:'🌐', text:'64 Districts' },
                ].map((b,i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                    <span>{b.icon}</span><span>{b.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right: Floating Telemetry Widget ── */}
            <div className="hidden lg:flex flex-col gap-3 flex-shrink-0 w-72 animate-float">
              <div className="glass-card-dark p-5">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live Telemetry
                </div>
                <div className="flex justify-between items-center mb-5">
                  <CircleMetric value={aqiVal} max={300} label="Dhaka AQI" unit="" />
                  <CircleMetric value={dengueVal} max={100} label="Dengue Risk" unit="" />
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-[72px] h-[72px] rounded-2xl bg-sky-500/10 border border-sky-500/20 flex flex-col items-center justify-center">
                      <Thermometer className="w-5 h-5 text-sky-400 mb-0.5" />
                      <span className="text-white font-extrabold text-sm">{weather.temperature || '--'}°</span>
                    </div>
                    <span className="text-[10px] text-slate-400">Dhaka Temp</span>
                  </div>
                </div>
                <div className="border-t border-white/10 pt-4">
                  <div className="flex justify-between text-xs text-slate-400 mb-2">
                    <span>Active Blood SOS</span>
                    <span className="text-rose-400 font-extrabold">{activeSos.length} Live</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Humidity</span>
                    <span className="text-sky-400 font-bold">{weather.humidity || '--'}%</span>
                  </div>
                </div>
              </div>

              {/* Mini FX ticker */}
              <div className="glass-card-dark p-4 space-y-2">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Medical FX Rates</div>
                {[{f:'🇺🇸',cur:'USD',r:fx.bdtRate||'118.25'},{f:'🇮🇳',cur:'INR',r:fx.inrRate||'1.42'},{f:'🇪🇺',cur:'EUR',r:fx.eurRate||'128.50'}].map(x=>(
                  <div key={x.cur} className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">{x.f} 1 {x.cur}</span>
                    <span className="text-xs font-bold text-sky-400">৳{x.r}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Stats Row ── */}
          <div className="mt-10 pt-8 border-t grid grid-cols-2 sm:grid-cols-4 gap-6"
            style={{ borderColor:'rgba(255,255,255,0.08)' }}>
            <StatPill value={170} suffix="M+" label="Citizens Served" color="gradient-text" started={countersStarted} delay={0} />
            <StatPill value={64} suffix="" label="Districts Covered" color="gradient-text-emerald" started={countersStarted} delay={150} />
            <StatPill value={247} suffix="+" label="Hospitals Live" color="text-sky-400" started={countersStarted} delay={300} />
            <StatPill value={8} suffix="" label="Blood Groups" color="text-rose-400" started={countersStarted} delay={450} />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          ACTIVE SOS
      ═══════════════════════════════════════ */}
      {activeSos.length > 0 && (
        <section className="animate-fade-in-up">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="absolute inset-0 rounded-full bg-rose-500 animate-ping opacity-75" />
              </div>
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                Live Urgent Blood SOS ({activeSos.length})
              </h2>
            </div>
            <Link to="/blood" className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 no-underline">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeSos.map(sos => (
              <div key={sos.id} className="bento-card p-4 border-l-4 border-rose-500 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-white text-base flex-shrink-0"
                    style={{ background:'linear-gradient(135deg,#e11d48,#be123c)',boxShadow:'0 4px 14px rgba(225,29,72,0.4)' }}>
                    {sos.bloodGroup}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{sos.patientName}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3 h-3" />{sos.hospitalName}
                    </div>
                    <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-full mt-1 inline-block">
                      {sos.unitsRequired} bag(s) needed
                    </span>
                  </div>
                </div>
                <a href={`tel:${sos.contactPhone}`}
                  className="flex-shrink-0 btn-danger text-xs py-2 px-3 no-underline" style={{ padding:'8px 14px' }}>
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Call</span>
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════
          EMERGENCY SPEED DIAL
      ═══════════════════════════════════════ */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">{t('emergency_call')}</h2>
            <p className="text-sm text-slate-400 mt-0.5">Tap to instantly dial national emergency services</p>
          </div>
          <Link to="/services" className="text-sm text-sky-600 font-bold hover:text-sky-700 flex items-center gap-1 no-underline">
            All Tools <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {speedDial.map((item, idx) => (
            <a key={idx} href={`tel:${item.number}`}
              className="bento-card p-4 flex flex-col gap-2.5 no-underline group cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-50 to-blue-100 border border-sky-100
                  flex items-center justify-center group-hover:from-sky-600 group-hover:to-blue-700
                  group-hover:border-sky-600 transition-all duration-300 shadow-sm">
                  <PhoneCall className="w-4 h-4 text-sky-600 group-hover:text-white transition-colors" />
                </div>
                <span className="text-lg font-black text-rose-600 tracking-tight">{item.number}</span>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800 line-clamp-1">{lang==='bn' ? item.serviceBn : item.service}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{item.type}</div>
              </div>
              <div className="text-[10px] text-sky-500 font-semibold group-hover:underline">Tap to Call →</div>
            </a>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          HOW IT WORKS — Premium 3-Step
      ═══════════════════════════════════════ */}
      <section className="relative overflow-hidden rounded-3xl p-8 sm:p-12"
        style={{ background:'linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 50%,#f0fdf4 100%)',border:'1px solid rgba(14,165,233,0.12)' }}>
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-72 h-72 opacity-20" style={{ background:'radial-gradient(circle,#0ea5e9,transparent)',filter:'blur(60px)',pointerEvents:'none' }} />

        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-sky-200 text-sky-700 text-xs font-bold mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" /> Platform Intelligence
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {lang==='en' ? 'How MediPulse BD Works' : 'MediPulse BD কীভাবে কাজ করে'}
          </h2>
          <p className="text-slate-500 mt-2 text-sm max-w-lg mx-auto">
            Powered by real-time feeds from DGHS, OpenAQ, OSRM, and national blood registries
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative">
          {/* Connector line desktop */}
          <div className="hidden sm:block absolute top-12 left-1/6 right-1/6 h-px bg-gradient-to-r from-transparent via-sky-300 to-transparent" style={{ top:'44px' }} />

          {[{
            num:'01', icon:Search, title: lang==='en'?'Search & Locate':'খুঁজুন ও চিহ্নিত করুন',
            desc: lang==='en'?'Find hospitals with live ICU beds, verified blood donors, or generic medicines in seconds.':'সেকেন্ডে কাছের হাসপাতাল, রক্তদাতা বা ওষুধ খুঁজুন।',
            from:'from-sky-500',to:'to-blue-600',shadow:'shadow-sky-500/30'
          },{
            num:'02', icon:Zap, title: lang==='en'?'Instant SOS Broadcast':'তাৎক্ষণিক SOS প্রেরণ',
            desc: lang==='en'?'Broadcast emergency blood requests to hundreds of verified donors across your district instantly.':'সাথে সাথে শত শত যাচাইকৃত রক্তদাতাকে জরুরি অনুরোধ পাঠান।',
            from:'from-rose-500',to:'to-pink-600',shadow:'shadow-rose-500/30'
          },{
            num:'03', icon:Shield, title: lang==='en'?'Stay Protected':'সুরক্ষিত থাকুন',
            desc: lang==='en'?'Monitor live AQI, dengue risk scores, and health alerts to protect your family every day.':'পরিবারকে রক্ষা করতে লাইভ AQI, ডেঙ্গু স্কোর ও স্বাস্থ্য সতর্কতা পর্যবেক্ষণ করুন।',
            from:'from-emerald-500',to:'to-teal-600',shadow:'shadow-emerald-500/30'
          }].map((step,idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="bg-white rounded-3xl p-6 text-center shadow-lg hover-lift relative">
                {/* Step number watermark */}
                <div className="absolute top-4 right-5 text-7xl font-black opacity-[0.04] text-slate-900 select-none">{step.num}</div>
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.from} ${step.to} flex items-center justify-center mx-auto mb-4 shadow-xl ${step.shadow}`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className={`text-xs font-black uppercase tracking-widest mb-2 bg-gradient-to-r ${step.from} ${step.to} text-transparent bg-clip-text`}>{step.num}</div>
                <h3 className="text-base font-extrabold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          LIVE TELEMETRY — Bento Grid
      ═══════════════════════════════════════ */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Live Environmental Intelligence</h2>
            <p className="text-sm text-slate-400 mt-0.5">Auto-synced every 15 minutes from national sensors</p>
          </div>
          <button onClick={forceRefresh} disabled={isRefreshing}
            className="text-xs bg-white border border-slate-200 text-slate-600 font-semibold px-3 py-2 rounded-xl
              flex items-center gap-1.5 hover:bg-slate-50 transition shadow-sm disabled:opacity-50">
            <Activity className={`w-3.5 h-3.5 text-sky-500 ${isRefreshing?'animate-spin':''}`} />
            {isRefreshing?'Syncing...':'Refresh'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* AQI Card */}
          <div className="bento-card p-6" style={{ borderTop:'4px solid #f59e0b' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background:'linear-gradient(135deg,#fef3c7,#fde68a)' }}>
                  <Wind className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">{t('live_aqi')}</h3>
                  <p className="text-[10px] text-slate-400">Dhaka Monitoring Station</p>
                </div>
              </div>
              <span className="text-[10px] bg-amber-100 text-amber-800 font-extrabold px-2.5 py-1 rounded-full border border-amber-200">LIVE</span>
            </div>
            <div className="flex items-end gap-3 mb-3">
              <span className="text-5xl font-black text-slate-900 tracking-tight">{aqiVal}</span>
              <div className="pb-1">
                <div className="text-[10px] text-slate-400">US AQI Index</div>
                <div className="text-xs font-bold text-amber-600">{aqi.aqiStatus||'Unhealthy for Sensitive'}</div>
              </div>
            </div>
            <div className="progress-bar mb-3">
              <div className="progress-bar-fill" style={{ width:`${Math.min((aqiVal/300)*100,100)}%`,background:'linear-gradient(90deg,#10b981,#f59e0b,#f43f5e)' }} />
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">{aqi.healthRisk||'Vulnerable individuals should limit outdoor exertion.'}</p>
            <div className="grid grid-cols-3 gap-2">
              {[{l:'PM 2.5',v:`${aqi.pollutants?.pm2_5||118} µg`},{l:'PM 10',v:`${aqi.pollutants?.pm10||172} µg`},{l:'N95',v:aqi.maskRecommended?'Required':'Advisory'}]
                .map((m,i) => (
                <div key={i} className="bg-slate-50 rounded-xl p-2.5 text-center border border-slate-100">
                  <div className="text-[9px] text-slate-400 font-semibold uppercase tracking-wide">{m.l}</div>
                  <div className="text-xs font-extrabold text-slate-800 mt-0.5">{m.v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Dengue Card */}
          <div className="bento-card p-6" style={{ borderTop:'4px solid #f43f5e' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background:'linear-gradient(135deg,#ffe4e6,#fecdd3)' }}>
                  <ShieldAlert className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">{t('live_dengue')}</h3>
                  <p className="text-[10px] text-slate-400">Vector Prediction Model</p>
                </div>
              </div>
              <span className="text-[10px] bg-rose-100 text-rose-800 font-extrabold px-2.5 py-1 rounded-full border border-rose-200">{dengue.level||'CRITICAL'}</span>
            </div>
            <div className="flex items-end gap-3 mb-3">
              <span className="text-5xl font-black text-rose-600 tracking-tight">{dengueVal}</span>
              <div className="pb-1">
                <div className="text-[10px] text-slate-400">/ 100 Risk Points</div>
                <div className="text-xs font-bold text-rose-700">{dengue.level||'Critical High'}</div>
              </div>
            </div>
            <div className="progress-bar mb-3">
              <div className="progress-bar-fill" style={{ width:`${dengueVal}%`,background:'linear-gradient(90deg,#f59e0b,#f43f5e)' }} />
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">{dengue.advisory||'High humidity creates peak Aedes breeding. Hospital platelet supplies on alert.'}</p>
            <div className="bg-rose-50 rounded-xl p-3 border border-rose-100 flex items-center justify-between">
              <span className="text-xs text-slate-600">Platelet Protocol:</span>
              <span className="text-xs font-extrabold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">Active Ready</span>
            </div>
          </div>

          {/* FX + Climate Card */}
          <div className="bento-card p-6" style={{ borderTop:'4px solid #0ea5e9' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background:'linear-gradient(135deg,#e0f2fe,#bae6fd)' }}>
                  <Activity className="w-5 h-5 text-sky-600" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">Medical FX &amp; Climate</h3>
                  <p className="text-[10px] text-slate-400">Live import drug benchmarks</p>
                </div>
              </div>
              <span className="text-[10px] bg-sky-100 text-sky-800 font-extrabold px-2.5 py-1 rounded-full border border-sky-200">LIVE</span>
            </div>

            {/* Climate mini */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-sky-50 rounded-2xl p-3 text-center border border-sky-100">
                <Thermometer className="w-4 h-4 text-sky-600 mx-auto mb-1" />
                <div className="text-2xl font-black text-slate-900">{weather.temperature||'--'}°</div>
                <div className="text-[10px] text-slate-400">Dhaka °C</div>
              </div>
              <div className="bg-sky-50 rounded-2xl p-3 text-center border border-sky-100">
                <Droplets className="w-4 h-4 text-sky-600 mx-auto mb-1" />
                <div className="text-2xl font-black text-slate-900">{weather.humidity||'--'}%</div>
                <div className="text-[10px] text-slate-400">Humidity</div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {[{f:'🇺🇸',cur:'USD',r:fx.bdtRate||'118.25'},{f:'🇮🇳',cur:'INR',r:fx.inrRate||'1.42'},{f:'🇪🇺',cur:'EUR',r:fx.eurRate||'128.50'}].map(x=>(
                <div key={x.cur} className="flex justify-between items-center bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                  <span className="text-xs font-semibold text-slate-500">{x.f} 1 {x.cur}</span>
                  <span className="text-sm font-extrabold text-sky-700">৳ {x.r} BDT</span>
                </div>
              ))}
            </div>
            <Link to="/medicines" className="text-xs text-sky-600 font-bold hover:underline flex items-center gap-1 justify-center no-underline">
              Check DGDA Generic Guide <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          DIVISIONAL RISK GRID
      ═══════════════════════════════════════ */}
      <section className="bento-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Divisional Risk Surveillance</h2>
            <p className="text-sm text-slate-400 mt-0.5">Live multi-district environmental health snapshot</p>
          </div>
          <button onClick={forceRefresh} disabled={isRefreshing}
            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold px-3 py-2 rounded-xl
              border border-slate-200 flex items-center gap-1.5 transition disabled:opacity-50">
            <Activity className={`w-3.5 h-3.5 text-sky-500 ${isRefreshing?'animate-spin':''}`} />
            {isRefreshing?'Refreshing...':'Refresh Matrix'}
          </button>
        </div>

        {regionalRisks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {regionalRisks.map((reg, idx) => {
              const isHigh = reg.aqi > 150;
              const isMed  = reg.aqi > 100;
              const dengHigh = reg.dengueScore > 70;
              return (
                <div key={idx} className="relative rounded-2xl p-4 overflow-hidden border cursor-default group transition-all hover:shadow-lg"
                  style={{
                    background: isHigh?'linear-gradient(135deg,#fff1f2,#ffe4e6)':isMed?'linear-gradient(135deg,#fffbeb,#fef3c7)':'linear-gradient(135deg,#f0fdf4,#dcfce7)',
                    borderColor: isHigh?'#fecdd3':isMed?'#fde68a':'#bbf7d0'
                  }}>
                  {/* Severity dot */}
                  <div className={`absolute top-3 right-3 w-2.5 h-2.5 rounded-full ${ isHigh?'bg-rose-500':isMed?'bg-amber-400':'bg-emerald-400' } shadow-sm`} />
                  <div className="font-extrabold text-slate-900 text-sm mb-3">{reg.name}</div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-500 font-medium">AQI</span>
                      <span className={`text-xs font-extrabold ${ isHigh?'text-rose-700':isMed?'text-amber-700':'text-emerald-700' }`}>{reg.aqi}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-500 font-medium">Dengue</span>
                      <span className={`text-xs font-extrabold ${ dengHigh?'text-rose-700':'text-emerald-700' }`}>{reg.dengueScore}/100</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-500 font-medium">Climate</span>
                      <span className="text-[10px] text-slate-600 font-semibold truncate max-w-[80px] text-right">{reg.heatIndex}</span>
                    </div>
                  </div>
                  <div className={`mt-3 text-[10px] font-extrabold uppercase tracking-wide ${ isHigh?'text-rose-600':isMed?'text-amber-600':'text-emerald-600' }`}>
                    {isHigh?'⚠ High Risk':isMed?'◐ Moderate':'✓ Low Risk'}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[...Array(8)].map((_,i) => <div key={i} className="skeleton-loader h-32 rounded-2xl" />)}
          </div>
        )}
      </section>

    </div>
  );
};

export default Home;
