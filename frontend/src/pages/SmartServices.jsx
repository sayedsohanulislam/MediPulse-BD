import React, { useState } from 'react';
import {
  Baby, Stethoscope, Wind, PhoneCall, HeartHandshake,
  FileCheck, Shield, Clock, Calculator, MapPin, CheckCircle,
  ExternalLink, Syringe, FlaskConical, Ambulance, Pill
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const TABS = [
  { id: 'vaccine', icon: Baby, label: 'Child Vaccine', sublabel: 'EPI Auto-Scheduler', color: 'from-sky-500 to-blue-600', bg: 'bg-sky-50', border: 'border-sky-200', active: 'border-sky-600 bg-sky-50 text-sky-700' },
  { id: 'pharmacy', icon: Pill, label: '24/7 Pharmacies', sublabel: 'Emergency Verified', color: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-50', border: 'border-emerald-200', active: 'border-emerald-600 bg-emerald-50 text-emerald-700' },
  { id: 'oxygen', icon: Wind, label: 'Oxygen Hub', sublabel: 'Cylinder & Rental', color: 'from-cyan-500 to-blue-500', bg: 'bg-cyan-50', border: 'border-cyan-200', active: 'border-cyan-600 bg-cyan-50 text-cyan-700' },
  { id: 'diagnostic', icon: FlaskConical, label: 'Diagnostic Tests', sublabel: 'Cost Comparison', color: 'from-purple-500 to-violet-600', bg: 'bg-purple-50', border: 'border-purple-200', active: 'border-purple-600 bg-purple-50 text-purple-700' },
  { id: 'ambulance', icon: Ambulance, label: 'Ambulance Fare', sublabel: 'Fair Rate Calc', color: 'from-amber-500 to-orange-500', bg: 'bg-amber-50', border: 'border-amber-200', active: 'border-amber-600 bg-amber-50 text-amber-700' },
];

const SmartServices = () => {
  const { t, lang } = useLanguage();
  const [activeTab, setActiveTab] = useState('vaccine');
  const [birthDate, setBirthDate] = useState('2026-04-15');
  const [vaccineSchedule, setVaccineSchedule] = useState(null);
  const [fareKm, setFareKm] = useState(12);
  const [acType, setAcType] = useState('ac');

  const diagnosticData = [
    { test: 'MRI of Brain / Spine (1.5T)', publicPrice: 3000, privatePrice: 8500 },
    { test: 'CT Scan of Chest (HRCT)', publicPrice: 2000, privatePrice: 6000 },
    { test: 'Dengue NS1 Antigen & CBC', publicPrice: 300, privatePrice: 1200 },
    { test: 'Echocardiogram (Color Doppler)', publicPrice: 800, privatePrice: 3500 },
    { test: 'Complete Blood Count (CBC)', publicPrice: 150, privatePrice: 500 },
    { test: 'Kidney Function (Creatinine)', publicPrice: 100, privatePrice: 400 },
  ];

  const pharmacies = [
    { name: 'Lazz Pharma (Kalabagan 24/7)', district: 'Dhaka', address: 'Mirpur Road, Kalabagan', phone: '01711-591942' },
    { name: 'Al-Madina Pharmacy (DMCH Gate)', district: 'Dhaka', address: 'Secretariat Road, Dhaka', phone: '01819-223344' },
    { name: 'Popular Pharmacy (Dhanmondi)', district: 'Dhaka', address: 'House 16, Road 2, Dhanmondi', phone: '02-9669480' },
    { name: 'Uttara Pharma Center', district: 'Dhaka', address: 'Sector 3, Uttara', phone: '01712-445566' },
    { name: 'Chittagong Medical Gate Drug Store', district: 'Chittagong', address: 'K.B. Fazlul Kader Road', phone: '031-654321' },
  ];

  const oxygenVendors = [
    { name: 'Linde Bangladesh Emergency Care', phone: '01713-055555', cylinders: 'Stock Available', delivery: 'Home Delivery in 45 mins', deposit: '৳ 8,000' },
    { name: 'Spectra Oxygen Service', phone: '01711-404040', cylinders: 'Stock Available', delivery: 'Dhaka Metro Coverage', deposit: '৳ 7,500' },
    { name: 'Red Crescent Oxygen Bank', phone: '02-9330188', cylinders: 'Free for Underprivileged', delivery: 'Self-Pickup', deposit: '৳ 0' },
  ];

  const handleComputeSchedule = (e) => {
    e.preventDefault();
    const b = new Date(birthDate);
    const addDays = (d, days) => { const c = new Date(d); c.setDate(c.getDate() + days); return c.toISOString().split('T')[0]; };
    setVaccineSchedule([
      { round: 'At Birth', date: addDays(b, 0), vaccines: 'BCG, OPV-0', desc: 'Tuberculosis & initial polio protection.', color: 'from-sky-500 to-blue-600' },
      { round: '6 Weeks', date: addDays(b, 42), vaccines: 'Penta-1, PCV-1, bOPV-1, Rota-1', desc: 'First combination round — Diphtheria, Pertussis, Tetanus, HepB, Pneumonia.', color: 'from-emerald-500 to-teal-600' },
      { round: '10 Weeks', date: addDays(b, 70), vaccines: 'Penta-2, PCV-2, bOPV-2, Rota-2', desc: 'Second booster dose.', color: 'from-violet-500 to-purple-600' },
      { round: '14 Weeks', date: addDays(b, 98), vaccines: 'Penta-3, PCV-3, bOPV-3, IPV-1', desc: 'Completes primary pentavalent series.', color: 'from-rose-500 to-pink-600' },
      { round: '9 Months', date: addDays(b, 270), vaccines: 'MR-1, IPV-2', desc: 'Measles & Rubella defense.', color: 'from-amber-500 to-orange-500' },
      { round: '15 Months', date: addDays(b, 450), vaccines: 'MR-2', desc: 'Measles & Rubella lasting immunity.', color: 'from-sky-600 to-indigo-600' },
    ]);
  };

  const rateMap = { 'non-ac': { base: 450, km: 40 }, 'ac': { base: 600, km: 50 }, 'icu': { base: 2500, km: 120 } };
  const fare = rateMap[acType];
  const totalFare = fare.base + fareKm * fare.km;

  const activeTabConfig = TABS.find(t => t.id === activeTab);

  return (
    <div className="space-y-6 page-container">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-sky-100 flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-sky-600" />
          </div>
          Citizen Healthcare Utilities
        </h1>
        <p className="text-xs text-slate-400 mt-1 ml-11">
          EPI vaccines, 24/7 pharmacies, oxygen rentals, diagnostic costs, and fair ambulance rates
        </p>
      </div>

      {/* Tab Grid Nav */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`service-tab-card flex flex-col items-center gap-2 p-4 ${
                isActive ? tab.active + ' border-2' : ''
              }`}
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tab.color} flex items-center justify-center shadow-md`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-center">
                <div className={`text-xs font-bold ${isActive ? '' : 'text-slate-700'}`}>{tab.label}</div>
                <div className="text-[10px] text-slate-400">{tab.sublabel}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Tab 1: EPI Vaccine Calculator */}
      {activeTab === 'vaccine' && (
        <div className="pulse-card p-6 border-t-4 border-t-sky-500">
          <h2 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
            <Baby className="w-5 h-5 text-sky-600" />
            National EPI Auto-Scheduler
          </h2>
          <p className="text-xs text-slate-400 mb-5">
            Enter your child's date of birth. Our engine calculates government-mandated vaccination dates.
          </p>
          <form onSubmit={handleComputeSchedule} className="flex gap-2 mb-6 max-w-md">
            <input type="date" required value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="text-sm flex-1" />
            <button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm px-5 py-2 rounded-xl transition">
              Generate
            </button>
          </form>

          {vaccineSchedule && (
            <div className="space-y-1">
              {vaccineSchedule.map((v, idx) => (
                <div key={idx} className="flex gap-4">
                  {/* Timeline column */}
                  <div className="flex flex-col items-center">
                    <div className={`timeline-dot bg-gradient-to-br ${v.color} text-white text-[10px]`}>
                      {idx + 1}
                    </div>
                    {idx < vaccineSchedule.length - 1 && <div className="timeline-line" />}
                  </div>
                  {/* Card */}
                  <div className={`flex-1 ${idx < vaccineSchedule.length - 1 ? 'mb-1' : ''} pb-1`}>
                    <div className="bg-white border border-slate-100 rounded-2xl p-3.5 shadow-sm hover-lift">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                        <span className={`text-xs font-extrabold bg-gradient-to-r ${v.color} text-transparent bg-clip-text`}>{v.round}</span>
                        <span className="text-xs bg-slate-50 text-slate-600 font-semibold px-2 py-0.5 rounded-full border border-slate-200">📅 {v.date}</span>
                      </div>
                      <div className="text-xs font-bold text-slate-900 mb-0.5">{v.vaccines}</div>
                      <div className="text-[11px] text-slate-400">{v.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Pharmacies */}
      {activeTab === 'pharmacy' && (
        <div className="space-y-3">
          <div className="pulse-card p-4">
            <h2 className="text-sm font-bold text-slate-900 mb-1">Verified 24-Hour Emergency Pharmacies</h2>
            <p className="text-xs text-slate-400">Certified pharmacists available round-the-clock for critical injections, saline, and emergency medications.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {pharmacies.map((p, idx) => (
              <div key={idx} className="pulse-card hover-lift p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full border border-emerald-200">✓ 24 Hours</span>
                    <span className="text-xs font-semibold text-slate-400">{p.district}</span>
                  </div>
                  <strong className="text-sm text-slate-900 block mb-1">{p.name}</strong>
                  <div className="text-xs text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 flex-shrink-0" />{p.address}
                  </div>
                </div>
                <a href={`tel:${p.phone}`} className="mt-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2.5 px-3 rounded-xl text-center flex items-center justify-center gap-1.5 no-underline transition">
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-400" /> {p.phone}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Oxygen */}
      {activeTab === 'oxygen' && (
        <div className="space-y-3">
          <div className="pulse-card p-4">
            <h2 className="text-sm font-bold text-slate-900 mb-1">Emergency Oxygen & Concentrator Hub</h2>
            <p className="text-xs text-slate-400">Home oxygen cylinders, flow meters, and BiPAP emergency rentals in Dhaka & divisions.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {oxygenVendors.map((ox, idx) => (
              <div key={idx} className="pulse-card hover-lift p-4 flex flex-col justify-between">
                <div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    ox.deposit === '৳ 0' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-sky-100 text-sky-800 border border-sky-200'
                  }`}>{ox.cylinders}</span>
                  <strong className="text-sm text-slate-900 block mt-2 mb-1">{ox.name}</strong>
                  <div className="text-xs text-slate-500">🚚 {ox.delivery}</div>
                  <div className="text-xs text-slate-400 mt-0.5">Deposit: <strong className="text-slate-700">{ox.deposit}</strong></div>
                </div>
                <a href={`tel:${ox.phone}`} className="mt-4 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold py-2.5 px-3 rounded-xl text-center flex items-center justify-center gap-1.5 no-underline transition">
                  <PhoneCall className="w-3.5 h-3.5" /> Emergency Oxygen
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Diagnostic */}
      {activeTab === 'diagnostic' && (
        <div className="pulse-card p-5 border-t-4 border-t-purple-500">
          <h2 className="text-sm font-bold text-slate-900 mb-1">Public vs Private Diagnostic Benchmark</h2>
          <p className="text-xs text-slate-400 mb-4">Standardized comparison of essential imaging and pathology rates in Bangladesh.</p>
          <div className="space-y-2">
            {diagnosticData.map((d, idx) => {
              const savings = d.privatePrice - d.publicPrice;
              const savePct = Math.round((savings / d.privatePrice) * 100);
              return (
                <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex-1">
                    <div className="text-xs font-bold text-slate-800">{d.test}</div>
                  </div>
                  <div className="flex items-center gap-3 text-xs flex-shrink-0">
                    <div className="text-center">
                      <div className="text-[10px] text-slate-400">Public</div>
                      <div className="font-bold text-emerald-600">৳ {d.publicPrice}</div>
                    </div>
                    <div className="text-slate-300 font-bold">vs</div>
                    <div className="text-center">
                      <div className="text-[10px] text-slate-400">Private</div>
                      <div className="font-bold text-slate-500">৳ {d.privatePrice}</div>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 font-extrabold px-2 py-1 rounded-lg text-[11px]">Save {savePct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 5: Ambulance */}
      {activeTab === 'ambulance' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="pulse-card p-6 border-t-4 border-t-amber-500">
            <h2 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-amber-600" />
              Fair Ambulance Fare Calculator
            </h2>
            <p className="text-xs text-slate-400 mb-5">Official distance-based model preventing arbitrary price gouging during emergency transit.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Distance (Kilometers): <span className="text-amber-600 text-sm font-extrabold">{fareKm} km</span></label>
                <input
                  type="range" min="1" max="200" value={fareKm}
                  onChange={(e) => setFareKm(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-full cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>1 km</span><span>100 km</span><span>200 km</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Vehicle Type</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { key: 'non-ac', label: 'Standard Non-AC', rate: '৳40/km', emoji: '🚑' },
                    { key: 'ac', label: 'AC Emergency', rate: '৳50/km', emoji: '🚑' },
                    { key: 'icu', label: 'ICU Life-Support', rate: '৳120/km', emoji: '🏥' },
                  ].map(v => (
                    <button
                      key={v.key}
                      onClick={() => setAcType(v.key)}
                      className={`p-3 rounded-xl border-2 text-xs font-semibold text-center transition ${
                        acType === v.key ? 'border-amber-500 bg-amber-50 text-amber-800' : 'border-slate-200 text-slate-600 hover:border-amber-300'
                      }`}
                    >
                      <div className="text-xl mb-1">{v.emoji}</div>
                      <div className="font-bold text-xs">{v.label}</div>
                      <div className="text-[11px] opacity-70">{v.rate}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Fare Result */}
          <div className="pulse-card p-6 border-t-4 border-t-emerald-500">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Fare Breakdown</h3>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500">Base Flag-Drop Tariff</span>
                <strong className="text-slate-900">৳ {fare.base} BDT</strong>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500">{fareKm} km × ৳{fare.km}/km</span>
                <strong className="text-slate-900">৳ {fareKm * fare.km} BDT</strong>
              </div>
              <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-xl border-2 border-emerald-200">
                <span className="text-sm font-bold text-slate-900">Fair Maximum Cap</span>
                <span className="text-xl font-extrabold text-emerald-700">৳ {totalFare.toLocaleString()} BDT</span>
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
              ⚠️ If charged more than this amount, call <strong>16000</strong> (DGDA Consumer Helpline) to report price gouging.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartServices;
