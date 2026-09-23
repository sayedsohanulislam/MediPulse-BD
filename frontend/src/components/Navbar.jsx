import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, ShieldAlert, HeartPulse, Building2, Pill, Grid, Shield, Globe, User, LogOut, RefreshCw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useTelemetry } from '../context/TelemetryContext';

const Navbar = ({ onOpenAuth }) => {
  const { lang, toggleLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const { telemetry, isRefreshing, forceRefresh } = useTelemetry();
  const location = useLocation();

  const navLinks = [
    { to: '/', label: t('nav_home'), icon: Activity },
    { to: '/live-grid', label: t('nav_live_grid'), icon: HeartPulse },
    { to: '/hospitals', label: t('nav_hospitals'), icon: Building2 },
    { to: '/blood', label: t('nav_blood'), icon: ShieldAlert },
    { to: '/medicines', label: t('nav_medicines'), icon: Pill },
    { to: '/services', label: t('nav_smart_services'), icon: Grid },
    { to: '/authority', label: t('nav_authority'), icon: Shield }
  ];

  const aqi = telemetry?.airQuality?.usAqi || '--';
  const dengueScore = telemetry?.weather?.dengueRisk?.score || '--';

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      {/* Top Live Telemetry Ticker Bar */}
      <div className="bg-slate-900 text-slate-200 px-4 py-1 text-xs flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            {t('live_sync_status')}
          </span>
          <span className="border-l border-slate-700 pl-3">
            Dhaka AQI: <strong className={aqi > 150 ? 'text-amber-400' : 'text-emerald-400'}>{aqi}</strong> ({telemetry?.airQuality?.aqiStatus || 'Syncing...'})
          </span>
          <span className="border-l border-slate-700 pl-3">
            Dengue Vector Index: <strong className={dengueScore > 70 ? 'text-rose-400' : 'text-emerald-400'}>{dengueScore}/100</strong>
          </span>
          <span className="border-l border-slate-700 pl-3 hidden md:inline">
            Temp: <strong>{telemetry?.weather?.current?.temperature || '--'}°C</strong> (Humidity: {telemetry?.weather?.current?.humidity || '--'}%)
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={forceRefresh} 
            disabled={isRefreshing}
            className="flex items-center gap-1 hover:text-white transition disabled:opacity-50"
            title="Force refresh live external feeds"
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-sky-400' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : t('refresh_sync')}</span>
          </button>
          <button 
            onClick={toggleLanguage}
            className="bg-slate-800 hover:bg-slate-700 text-sky-400 px-2 py-0.5 rounded border border-slate-700 flex items-center gap-1"
          >
            <Globe className="w-3 h-3" />
            <span>{lang === 'en' ? 'বাংলা' : 'English'}</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 text-decoration-none">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-rose-500 flex items-center justify-center text-white shadow-md">
            <HeartPulse className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="text-xl font-bold tracking-tight text-slate-900 leading-none">
              {t('brand')}
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              {lang === 'en' ? 'Bangladesh Healthcare Grid' : 'জাতীয় জরুরি স্বাস্থ্য গ্রিড'}
            </div>
          </div>
        </Link>

        {/* Navigation links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition ${
                  isActive 
                    ? 'bg-sky-50 text-sky-700 font-semibold' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User actions */}
        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2 bg-slate-100 py-1 px-3 rounded-full border border-slate-200">
              <User className="w-4 h-4 text-sky-600" />
              <span className="text-xs font-semibold text-slate-700 max-w-[120px] truncate">{user.name}</span>
              <span className="text-[10px] bg-sky-200 text-sky-800 px-1.5 py-0.5 rounded-full uppercase font-bold">
                {user.role}
              </span>
              <button 
                onClick={logout} 
                className="text-slate-400 hover:text-rose-600 ml-1"
                title={t('btn_logout')}
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>{t('btn_login')} / {t('btn_demo')}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
