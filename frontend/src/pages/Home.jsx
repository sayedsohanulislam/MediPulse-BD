import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartPulse, ShieldAlert, Building2, Pill, Activity, PhoneCall, 
  MapPin, AlertTriangle, Wind, Thermometer, Droplets, CheckCircle, 
  ArrowRight, Clock, ShieldCheck, Heart, Search, ExternalLink 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTelemetry } from '../context/TelemetryContext';
import { healthApi, bloodApi, operationsApi } from '../services/api';

const Home = ({ onOpenSosModal, onOpenAuth }) => {
  const { t, lang } = useLanguage();
  const { telemetry, isRefreshing, forceRefresh } = useTelemetry();
  const [regionalRisks, setRegionalRisks] = useState([]);
  const [activeSos, setActiveSos] = useState([]);
  const [speedDial, setSpeedDial] = useState([]);

  useEffect(() => {
    healthApi.getRegionalRisks().then(res => {
      if (res.data.success) setRegionalRisks(res.data.data);
    }).catch(() => {});

    bloodApi.getActiveSos().then(res => {
      if (res.data.success) setActiveSos(res.data.data);
    }).catch(() => {});

    operationsApi.getSpeedDial().then(res => {
      if (res.data.success) setSpeedDial(res.data.data);
    }).catch(() => {});
  }, []);

  const weather = telemetry?.weather?.current || {};
  const dengue = telemetry?.weather?.dengueRisk || {};
  const aqi = telemetry?.airQuality || {};
  const fx = telemetry?.exchangeRates || {};

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 text-white p-6 sm:p-10 shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold border border-rose-500/30 mb-4 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            {lang === 'en' ? 'Live Telemetry & Emergency Network • Bangladesh' : 'লাইভ টেলিমেট্রি ও জরুরি স্বাস্থ্য নেটওয়ার্ক • বাংলাদেশ'}
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-4">
            {lang === 'en' ? (
              <>Intelligent Healthcare & <span className="text-rose-400">Epidemic Command</span> for Bangladesh</>
            ) : (
              <>বাংলাদেশের জন্য স্মার্ট জরুরি স্বাস্থ্য ও <span className="text-rose-400">মহামারী প্রতিরোধ গ্রিড</span></>
            )}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            {lang === 'en' 
              ? 'Real-time hospital ICU bed tracking, instant emergency blood SOS matching, automated Dengue and AQI hazard detection, and DGDA generic medicine price intelligence.'
              : 'হাসপাতালের লাইভ আইসিইউ ও সাধারণ শয্যা ট্র্যাকিং, জরুরি রক্তদাতা ম্যাচিং, স্বয়ংক্রিয় ডেঙ্গু ও বায়ুদূষণ পূর্বাভাস এবং সরকারি ওষুধ মূল্য নির্দেশিকা।'}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenSosModal}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-5 py-3 rounded-xl shadow-lg shadow-rose-900/40 flex items-center gap-2 transition transform active:scale-95 text-sm"
            >
              <ShieldAlert className="w-5 h-5 animate-bounce" />
              <span>{t('urgent_sos')}</span>
            </button>

            <Link
              to="/hospitals"
              className="bg-sky-600 hover:bg-sky-700 text-white font-semibold px-5 py-3 rounded-xl shadow-lg shadow-sky-900/30 flex items-center gap-2 transition text-sm text-decoration-none"
            >
              <Building2 className="w-4 h-4" />
              <span>Find ICU & Hospitals</span>
            </Link>

            <Link
              to="/live-grid"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium px-4 py-3 rounded-xl flex items-center gap-2 transition text-sm text-decoration-none"
            >
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Interactive Map</span>
            </Link>
          </div>
        </div>

        {/* Live Status Metric Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
            <div className="text-slate-400 text-xs flex items-center gap-1">
              <Wind className="w-3.5 h-3.5 text-sky-400" />
              <span>Air Quality (Dhaka)</span>
            </div>
            <div className="text-xl font-bold mt-1 text-amber-400">
              {aqi.usAqi || '--'} <span className="text-xs font-normal text-slate-400">US AQI</span>
            </div>
            <div className="text-[11px] text-slate-400 truncate">{aqi.aqiStatus || 'Calculating...'}</div>
          </div>

          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
            <div className="text-slate-400 text-xs flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>Dengue Threat</span>
            </div>
            <div className="text-xl font-bold mt-1 text-rose-400">
              {dengue.score || '--'}<span className="text-xs font-normal text-slate-400">/100</span>
            </div>
            <div className="text-[11px] text-slate-400 truncate">{dengue.level || 'Moderate'}</div>
          </div>

          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
            <div className="text-slate-400 text-xs flex items-center gap-1">
              <Thermometer className="w-3.5 h-3.5 text-emerald-400" />
              <span>Dhaka Climate</span>
            </div>
            <div className="text-xl font-bold mt-1 text-white">
              {weather.temperature || '--'}°C
            </div>
            <div className="text-[11px] text-slate-400">Humidity: {weather.humidity || '--'}%</div>
          </div>

          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
            <div className="text-slate-400 text-xs flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-purple-400" />
              <span>Active Blood SOS</span>
            </div>
            <div className="text-xl font-bold mt-1 text-white">
              {activeSos.length} <span className="text-xs font-normal text-rose-400">Critical</span>
            </div>
            <div className="text-[11px] text-slate-400">Live Broadcast Queue</div>
          </div>
        </div>
      </section>

      {/* Active Emergency Broadcast Queue */}
      {activeSos.length > 0 && (
        <section className="pulse-card p-5 border-l-4 border-l-rose-600 bg-rose-50/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping"></span>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Live Urgent Blood SOS Broadcasts ({activeSos.length})
              </h2>
            </div>
            <Link to="/blood" className="text-xs font-semibold text-rose-600 hover:underline">
              View All Donors & SOS →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeSos.map((sos) => (
              <div key={sos.id} className="bg-white p-3.5 rounded-xl border border-rose-200 shadow-sm flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-rose-600 text-white font-extrabold px-2 py-0.5 rounded text-xs">
                      {sos.bloodGroup}
                    </span>
                    <strong className="text-xs text-slate-900">{sos.patientName}</strong>
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                    <span>🏥 {sos.hospitalName}</span>
                    <span>🩸 {sos.unitsRequired} Unit(s)</span>
                  </div>
                </div>
                <a
                  href={`tel:${sos.contactPhone}`}
                  className="bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 transition text-decoration-none"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Family</span>
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* National Emergency Speed-Dial Cards */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{t('emergency_call')}</h2>
            <p className="text-xs text-slate-500">Tap to instantly dial national emergency services in Bangladesh</p>
          </div>
          <Link to="/services" className="text-xs text-sky-600 font-semibold hover:underline">
            All 8 Citizen Tools →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {speedDial.map((item, idx) => (
            <a
              key={idx}
              href={`tel:${item.number}`}
              className="pulse-card p-3 flex flex-col justify-between text-decoration-none text-slate-900 hover:border-sky-400 group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs group-hover:bg-sky-600 group-hover:text-white transition">
                    <PhoneCall className="w-4 h-4" />
                  </span>
                  <span className="text-base font-extrabold text-rose-600 tracking-tight">{item.number}</span>
                </div>
                <div className="text-xs font-bold text-slate-800 line-clamp-1">{lang === 'bn' ? item.serviceBn : item.service}</div>
                <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{item.type}</div>
              </div>
              <div className="mt-2 text-[10px] text-sky-600 font-medium group-hover:underline">
                Tap to Call Now
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Real-Time Automated Telemetry & Risk Index */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Air Quality Deep Dive */}
        <div className="pulse-card p-5 border-t-4 border-t-amber-500">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Wind className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-sm text-slate-900">{t('live_aqi')}</h3>
            </div>
            <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full">
              Dhaka Station
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-extrabold text-slate-900">{aqi.usAqi || 188}</span>
            <span className="text-xs text-slate-500">US AQI Index</span>
          </div>

          <div className="text-xs font-semibold text-amber-600 mb-2">
            Status: {aqi.aqiStatus || 'Unhealthy for Sensitive Groups'}
          </div>

          <p className="text-xs text-slate-600 leading-relaxed mb-4">
            {aqi.healthRisk || 'Vulnerable individuals, children, and elderly citizens should limit outdoor exertion in Dhaka.'}
          </p>

          <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center text-xs">
            <div>
              <div className="text-[10px] text-slate-500">PM 2.5</div>
              <div className="font-bold text-slate-800">{aqi.pollutants?.pm2_5 || '118'} µg</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500">PM 10</div>
              <div className="font-bold text-slate-800">{aqi.pollutants?.pm10 || '172'} µg</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500">N95 Mask</div>
              <div className="font-bold text-rose-600">{aqi.maskRecommended ? 'Required' : 'Advisory'}</div>
            </div>
          </div>
        </div>

        {/* Card 2: Dengue Outbreak Prediction Engine */}
        <div className="pulse-card p-5 border-t-4 border-t-rose-500">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-500" />
              <h3 className="font-bold text-sm text-slate-900">{t('live_dengue')}</h3>
            </div>
            <span className="text-xs bg-rose-100 text-rose-800 font-semibold px-2 py-0.5 rounded-full">
              Vector Model
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-extrabold text-rose-600">{dengue.score || 82}</span>
            <span className="text-xs text-slate-500">/ 100 Risk Points</span>
          </div>

          <div className="text-xs font-semibold text-rose-700 mb-2">
            Threat Level: {dengue.level || 'Critical High'}
          </div>

          <p className="text-xs text-slate-600 leading-relaxed mb-4">
            {dengue.advisory || 'High atmospheric humidity and standing rainwater create peak Aedes breeding conditions. Hospital platelet supplies on alert.'}
          </p>

          <div className="bg-rose-50 p-2.5 rounded-xl border border-rose-200 text-xs text-rose-900 flex items-center justify-between">
            <span>Hospital Platelet Protocol:</span>
            <strong className="text-rose-700 font-bold">Active Ready</strong>
          </div>
        </div>

        {/* Card 3: Foreign Exchange & Medicine Tariffs */}
        <div className="pulse-card p-5 border-t-4 border-t-sky-500">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-sky-600" />
              <h3 className="font-bold text-sm text-slate-900">Medical FX & Import Benchmarks</h3>
            </div>
            <span className="text-xs bg-sky-100 text-sky-800 font-semibold px-2 py-0.5 rounded-full">
              Live Rates
            </span>
          </div>

          <p className="text-xs text-slate-500 mb-3">
            Daily exchange rate benchmarks for imported cancer, cardiac, and specialized drugs into Bangladesh.
          </p>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg text-xs">
              <span className="font-semibold text-slate-700">1 USD (United States Dollar)</span>
              <strong className="text-sky-700 font-bold">৳ {fx.bdtRate || '118.25'} BDT</strong>
            </div>
            <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg text-xs">
              <span className="font-semibold text-slate-700">1 INR (Indian Rupee - Medical)</span>
              <strong className="text-sky-700 font-bold">৳ {fx.inrRate || '1.42'} BDT</strong>
            </div>
            <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg text-xs">
              <span className="font-semibold text-slate-700">1 EUR (Eurozone Import)</span>
              <strong className="text-sky-700 font-bold">৳ {fx.eurRate || '128.50'} BDT</strong>
            </div>
          </div>

          <Link
            to="/medicines"
            className="text-xs text-sky-600 font-semibold hover:underline block text-center"
          >
            Check DGDA Generic Drug Alternatives →
          </Link>
        </div>
      </section>

      {/* Divisional Healthcare Risk Matrix */}
      <section className="pulse-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Divisional Healthcare Risk Surveillance</h2>
            <p className="text-xs text-slate-500">Live multi-district snapshot comparing environmental risks across divisions</p>
          </div>
          <button
            onClick={forceRefresh}
            disabled={isRefreshing}
            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1.5 transition"
          >
            <Activity className="w-3.5 h-3.5 text-sky-600" />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh Matrix'}</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="pb-2 font-semibold">Division</th>
                <th className="pb-2 font-semibold">Air Quality (AQI)</th>
                <th className="pb-2 font-semibold">AQI Category</th>
                <th className="pb-2 font-semibold">Dengue Risk Level</th>
                <th className="pb-2 font-semibold">Score</th>
                <th className="pb-2 font-semibold">Climate Hazard</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {regionalRisks.map((reg, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 font-bold text-slate-800">{reg.name}</td>
                  <td className="py-3 font-semibold text-slate-700">{reg.aqi}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                      reg.aqi > 150 ? 'bg-rose-100 text-rose-800' : (reg.aqi > 100 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800')
                    }`}>
                      {reg.aqiStatus}
                    </span>
                  </td>
                  <td className="py-3 font-medium text-slate-700">{reg.dengueRisk}</td>
                  <td className="py-3">
                    <span className="font-bold text-slate-900">{reg.dengueScore}</span>/100
                  </td>
                  <td className="py-3 text-slate-600">{reg.heatIndex}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Home;
