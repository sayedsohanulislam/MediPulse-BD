import React, { useState } from 'react';
import { 
  Baby, Stethoscope, Wind, PhoneCall, HeartHandshake, 
  FileCheck, Shield, Clock, Calculator, MapPin, CheckCircle, ExternalLink 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const SmartServices = () => {
  const { t, lang } = useLanguage();
  const [activeTab, setActiveTab] = useState('vaccine');

  // Vaccine Calculator State
  const [birthDate, setBirthDate] = useState('2026-04-15');
  const [vaccineSchedule, setVaccineSchedule] = useState(null);

  // Ambulance Fare State
  const [fareKm, setFareKm] = useState(12);
  const [acType, setAcType] = useState('ac');

  // Diagnostic Test Comparator State
  const diagnosticData = [
    { test: "MRI of Brain / Spine (1.5T)", publicPrice: 3000, privatePrice: 8500, savings: 5500 },
    { test: "CT Scan of Chest (HRCT)", publicPrice: 2000, privatePrice: 6000, savings: 4000 },
    { test: "Dengue NS1 Antigen & CBC", publicPrice: 300, privatePrice: 1200, savings: 900 },
    { test: "Echocardiogram (Color Doppler)", publicPrice: 800, privatePrice: 3500, savings: 2700 },
    { test: "Complete Blood Count (CBC & ESR)", publicPrice: 150, privatePrice: 500, savings: 350 },
    { test: "Kidney Function (Serum Creatinine)", publicPrice: 100, privatePrice: 400, savings: 300 }
  ];

  // 24/7 Pharmacy Directory
  const pharmacies = [
    { name: "Lazz Pharma (Kalabagan 24/7)", district: "Dhaka", address: "Mirpur Road, Kalabagan", phone: "01711-591942", open: "24 Hours" },
    { name: "Al-Madina Pharmacy (DMCH Gate)", district: "Dhaka", address: "Secretariat Road, Dhaka", phone: "01819-223344", open: "24 Hours" },
    { name: "Popular Pharmacy (Dhanmondi)", district: "Dhaka", address: "House 16, Road 2, Dhanmondi", phone: "02-9669480", open: "24 Hours" },
    { name: "Uttara Pharma Center", district: "Dhaka", address: "Sector 3, Uttara", phone: "01712-445566", open: "24 Hours" },
    { name: "Chittagong Medical Gate Drug Store", district: "Chittagong", address: "K.B. Fazlul Kader Road", phone: "031-654321", open: "24 Hours" }
  ];

  // Emergency Oxygen Vendors
  const oxygenVendors = [
    { name: "Linde Bangladesh Emergency Care", phone: "01713-055555", cylinders: "Stock Available", delivery: "Home Delivery in 45 mins", deposit: "৳ 8,000" },
    { name: "Spectra Oxygen Service", phone: "01711-404040", cylinders: "Stock Available", delivery: "Dhaka Metro Coverage", deposit: "৳ 7,500" },
    { name: "Red Crescent Oxygen Bank", phone: "02-9330188", cylinders: "Free Emergency Loan for Underprivileged", delivery: "Self-Pickup", deposit: "৳ 0" }
  ];

  const handleComputeSchedule = (e) => {
    e.preventDefault();
    if (!birthDate) return;
    const b = new Date(birthDate);

    const addDays = (d, days) => {
      const copy = new Date(d);
      copy.setDate(copy.getDate() + days);
      return copy.toISOString().split('T')[0];
    };

    const schedule = [
      { round: "At Birth", date: addDays(b, 0), vaccines: "BCG, OPV-0", description: "Tuberculosis & initial polio protection." },
      { round: "6 Weeks", date: addDays(b, 42), vaccines: "Penta-1, PCV-1, bOPV-1, Rota-1", description: "First combination round (Diphtheria, Pertussis, Tetanus, HepB, Pneumonia)." },
      { round: "10 Weeks", date: addDays(b, 70), vaccines: "Penta-2, PCV-2, bOPV-2, Rota-2", description: "Second booster dose." },
      { round: "14 Weeks", date: addDays(b, 98), vaccines: "Penta-3, PCV-3, bOPV-3, IPV-1", description: "Completes primary pentavalent series." },
      { round: "9 Months", date: addDays(b, 270), vaccines: "MR-1, IPV-2", description: "Measles & Rubella defense." },
      { round: "15 Months", date: addDays(b, 450), vaccines: "MR-2", description: "Measles & Rubella lasting immunity." }
    ];

    setVaccineSchedule(schedule);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Stethoscope className="w-6 h-6 text-sky-600" />
          <span>Citizen Healthcare Utilities & Smart Tools</span>
        </h1>
        <p className="text-xs text-slate-500">
          Essential tools: EPI vaccination timeline, 24/7 pharmacies, oxygen cylinder rentals, diagnostic cost comparison, and fair ambulance rates
        </p>
      </div>

      {/* Service Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2">
        <button
          onClick={() => setActiveTab('vaccine')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 whitespace-nowrap transition ${
            activeTab === 'vaccine' ? 'border-sky-600 text-sky-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          👶 Child EPI Vaccine Calculator
        </button>

        <button
          onClick={() => setActiveTab('pharmacy')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 whitespace-nowrap transition ${
            activeTab === 'pharmacy' ? 'border-sky-600 text-sky-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          💊 24/7 Emergency Pharmacies
        </button>

        <button
          onClick={() => setActiveTab('oxygen')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 whitespace-nowrap transition ${
            activeTab === 'oxygen' ? 'border-sky-600 text-sky-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          🫁 Oxygen & Equipment Hub
        </button>

        <button
          onClick={() => setActiveTab('diagnostic')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 whitespace-nowrap transition ${
            activeTab === 'diagnostic' ? 'border-sky-600 text-sky-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          🔬 Diagnostic Test Cost Matcher
        </button>

        <button
          onClick={() => setActiveTab('ambulance')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 whitespace-nowrap transition ${
            activeTab === 'ambulance' ? 'border-sky-600 text-sky-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          🚑 Ambulance Fair Fare Calculator
        </button>
      </div>

      {/* Tab 1: Vaccine Calculator */}
      {activeTab === 'vaccine' && (
        <div className="pulse-card p-6 border-t-4 border-t-sky-500 space-y-4">
          <div className="max-w-xl">
            <h2 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Baby className="w-5 h-5 text-sky-600" />
              <span>National Expanded Program on Immunization (EPI) Auto-Scheduler</span>
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Enter your child's date of birth. Our clinical logic engine calculates the exact government-mandated vaccination milestone dates.
            </p>

            <form onSubmit={handleComputeSchedule} className="flex gap-2 mb-4">
              <input
                type="date"
                required
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="text-xs py-2 flex-1"
              />
              <button
                type="submit"
                className="bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs px-5 py-2 rounded-lg"
              >
                Generate Milestone Dates
              </button>
            </form>
          </div>

          {vaccineSchedule && (
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="pb-2 font-semibold">Stage</th>
                    <th className="pb-2 font-semibold">Scheduled Date</th>
                    <th className="pb-2 font-semibold">Vaccines</th>
                    <th className="pb-2 font-semibold">Clinical Coverage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {vaccineSchedule.map((v, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2.5 font-bold text-sky-700">{v.round}</td>
                      <td className="py-2.5 font-semibold text-slate-800">📅 {v.date}</td>
                      <td className="py-2.5 font-bold text-slate-900">{v.vaccines}</td>
                      <td className="py-2.5 text-slate-600">{v.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: 24/7 Pharmacies */}
      {activeTab === 'pharmacy' && (
        <div className="space-y-3">
          <div className="pulse-card p-4">
            <h2 className="text-sm font-bold text-slate-900 mb-1">
              Verified 24-Hour Emergency Pharmacies in Bangladesh
            </h2>
            <p className="text-xs text-slate-500">
              Pharmacies with certified pharmacists available round-the-clock for critical injections, saline, and emergency medications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {pharmacies.map((p, idx) => (
              <div key={idx} className="pulse-card p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full">
                      ✓ {p.open}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">{p.district}</span>
                  </div>
                  <strong className="text-sm text-slate-900 block">{p.name}</strong>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{p.address}</span>
                  </div>
                </div>

                <a
                  href={`tel:${p.phone}`}
                  className="mt-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2 px-3 rounded-lg text-center flex items-center justify-center gap-1.5 text-decoration-none"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Call Pharmacy: {p.phone}</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Oxygen Vendors */}
      {activeTab === 'oxygen' && (
        <div className="space-y-3">
          <div className="pulse-card p-4">
            <h2 className="text-sm font-bold text-slate-900 mb-1">
              Emergency Medical Oxygen & Concentrator Rental Hub
            </h2>
            <p className="text-xs text-slate-500">
              Direct contacts for home oxygen cylinders, flow meters, and BiPAP machine emergency rentals in Dhaka & divisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {oxygenVendors.map((ox, idx) => (
              <div key={idx} className="pulse-card p-4 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded">
                    {ox.cylinders}
                  </span>
                  <strong className="text-sm text-slate-900 block mt-2">{ox.name}</strong>
                  <div className="text-xs text-slate-600 mt-1">🚚 {ox.delivery}</div>
                  <div className="text-xs text-slate-500 mt-0.5">Security Deposit: <strong>{ox.deposit}</strong></div>
                </div>

                <a
                  href={`tel:${ox.phone}`}
                  className="mt-4 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold py-2 px-3 rounded-lg text-center flex items-center justify-center gap-1.5 text-decoration-none"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Emergency Oxygen</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Diagnostic Test Comparator */}
      {activeTab === 'diagnostic' && (
        <div className="pulse-card p-5 border-t-4 border-t-purple-500 space-y-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 mb-1">
              Public Hospital vs Private Diagnostic Center Price Benchmark
            </h2>
            <p className="text-xs text-slate-500">
              Standardized comparison of essential imaging and pathology laboratory rates in Bangladesh.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="pb-2 font-semibold">Diagnostic Test Name</th>
                  <th className="pb-2 font-semibold">Govt/Public Hospital (DMCH/BSMMU)</th>
                  <th className="pb-2 font-semibold">Private Diagnostic Average</th>
                  <th className="pb-2 font-semibold">Patient Savings at Public Lab</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {diagnosticData.map((d, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-3 font-bold text-slate-800">{d.test}</td>
                    <td className="py-3 font-semibold text-emerald-700">৳ {d.publicPrice} BDT</td>
                    <td className="py-3 text-slate-600">৳ {d.privatePrice} BDT</td>
                    <td className="py-3">
                      <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[11px]">
                        Save ৳ {d.savings} BDT
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Ambulance Fair Fare Calculator */}
      {activeTab === 'ambulance' && (
        <div className="pulse-card p-6 border-t-4 border-t-amber-500 max-w-xl space-y-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-amber-600" />
              <span>Standard Ambulance Fair Fare Calculator</span>
            </h2>
            <p className="text-xs text-slate-500">
              Official distance-based calculation model preventing arbitrary price gouging during emergency medical transit.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Estimated Transit Distance (Kilometers)
              </label>
              <input
                type="number"
                min="1"
                max="500"
                value={fareKm}
                onChange={(e) => setFareKm(Number(e.target.value))}
                className="w-full text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Vehicle Type
              </label>
              <select
                value={acType}
                onChange={(e) => setAcType(e.target.value)}
                className="w-full text-xs"
              >
                <option value="non-ac">Standard Non-AC Ambulance (৳ 40/km)</option>
                <option value="ac">AC Emergency Patient Transport (৳ 50/km)</option>
                <option value="icu">ICU / Life-Support Ambulance (৳ 120/km)</option>
              </select>
            </div>
          </div>

          {/* Result */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-600">Base Flag-Drop Tariff:</span>
              <strong className="text-slate-900">৳ {acType === 'icu' ? 2500 : (acType === 'ac' ? 600 : 450)} BDT</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Distance Component ({fareKm} km):</span>
              <strong className="text-slate-900">
                ৳ {fareKm * (acType === 'icu' ? 120 : (acType === 'ac' ? 50 : 40))} BDT
              </strong>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-bold">
              <span className="text-slate-900">Fair Maximum Price Cap:</span>
              <span className="text-rose-600">
                ৳ {(acType === 'icu' ? 2500 : (acType === 'ac' ? 600 : 450)) + (fareKm * (acType === 'icu' ? 120 : (acType === 'ac' ? 50 : 40)))} BDT
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartServices;
