import React, { useState, useEffect, useCallback } from 'react';
import {
  Pill, Search, AlertTriangle, Calculator, ShieldCheck,
  Send, DollarSign, CheckCircle, ArrowDownRight, FileText,
  TrendingDown, X
} from 'lucide-react';
import { medicineApi, incidentApi } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const MedicineGuide = () => {
  const { t, lang } = useLanguage();
  const [medicines, setMedicines] = useState([]);
  const [bannedMeds, setBannedMeds] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [brandPrice, setBrandPrice] = useState(3.5);
  const [genericPrice, setGenericPrice] = useState(2.75);
  const [monthlyQty, setMonthlyQty] = useState(60);
  const [savingsResult, setSavingsResult] = useState(null);
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportTitle, setReportTitle] = useState('');
  const [reportDesc, setReportDesc] = useState('');
  const [reportDistrict, setReportDistrict] = useState('Dhaka');
  const [reportArea, setReportArea] = useState('');
  const [pharmacyName, setPharmacyName] = useState('');
  const [batchNo, setBatchNo] = useState('');
  const [priceCharged, setPriceCharged] = useState('');
  const [reportSuccess, setReportSuccess] = useState('');

  useEffect(() => {
    fetchMedicines();
    fetchBanned();
    calculateSavings();
  }, []);

  // Auto-recalculate savings when inputs change
  useEffect(() => { calculateSavings(); }, [brandPrice, genericPrice, monthlyQty]);

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const res = await medicineApi.search({ search });
      if (res.data.success) setMedicines(res.data.data);
    } catch (err) { console.warn('Medicine fetch error:', err.message); }
    finally { setLoading(false); }
  };

  const fetchBanned = async () => {
    try {
      const res = await medicineApi.getBanned();
      if (res.data.success) setBannedMeds(res.data.data);
    } catch (err) {}
  };

  const handleSearch = (e) => { e.preventDefault(); fetchMedicines(); };

  const calculateSavings = async () => {
    try {
      const res = await medicineApi.calculateSavings({
        currentBrandPrice: brandPrice,
        genericPrice: genericPrice,
        monthlyTablets: monthlyQty
      });
      if (res.data.success) setSavingsResult(res.data.data);
    } catch (err) {
      // Client-side fallback
      const b = parseFloat(brandPrice) || 0;
      const g = parseFloat(genericPrice) || 0;
      const qty = parseInt(monthlyQty) || 0;
      const monthlySavings = (b - g) * qty;
      if (monthlySavings >= 0) {
        setSavingsResult({
          currentMonthlyExpense: (b * qty).toFixed(2),
          genericMonthlyExpense: (g * qty).toFixed(2),
          monthlySavings: monthlySavings.toFixed(2),
          percentageSavings: b > 0 ? Math.round(((b - g) / b) * 100) : 0,
          yearlySavings: (monthlySavings * 12).toFixed(2),
        });
      }
    }
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    setReportSuccess('');
    try {
      const res = await incidentApi.submit({
        type: 'fake_medicine',
        title: reportTitle,
        description: reportDesc,
        district: reportDistrict,
        areaOrHospital: reportArea,
        pharmacyOrClinic: pharmacyName,
        medicineBatchNo: batchNo,
        priceCharged: Number(priceCharged) || 0
      });
      if (res.data.success) {
        setReportSuccess('Report submitted to DGDA taskforce review queue.');
        setShowReportForm(false);
        setReportTitle(''); setReportDesc('');
      }
    } catch (err) { alert('Error: ' + err.message); }
  };

  return (
    <div className="space-y-6 page-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Pill className="w-5 h-5 text-emerald-600" />
            </div>
            DGDA Generic Drug Guide &amp; Price Intelligence
          </h1>
          <p className="text-xs text-slate-400 mt-1 ml-11">
            Compare brand vs generic prices, calculate family savings, and report counterfeit drugs
          </p>
        </div>
        <button
          onClick={() => setShowReportForm(!showReportForm)}
          className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm px-4 py-2.5 rounded-xl shadow-md shadow-rose-600/20 flex items-center gap-1.5 transition"
        >
          <AlertTriangle className="w-4 h-4" />
          Report Counterfeit
        </button>
      </div>

      {/* Report Form */}
      {showReportForm && (
        <div className="pulse-card p-5 border-2 border-rose-300 bg-rose-50/50 animate-fade-in-up">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-rose-900 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              File Counterfeit / Overpricing Report
            </h2>
            <button onClick={() => setShowReportForm(false)} className="w-7 h-7 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600 hover:bg-rose-200 transition">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs text-slate-500 mb-4">Submissions are audited by DGDA and consumer rights taskforces.</p>
          <form onSubmit={handleSubmitReport} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Medicine Brand & Issue</label>
              <input type="text" required value={reportTitle} onChange={(e) => setReportTitle(e.target.value)} placeholder="e.g. Faded Napa Extra packaging" className="w-full text-xs" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Batch Number</label>
              <input type="text" value={batchNo} onChange={(e) => setBatchNo(e.target.value)} placeholder="e.g. NX-2024-88" className="w-full text-xs" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Pharmacy Name</label>
              <input type="text" value={pharmacyName} onChange={(e) => setPharmacyName(e.target.value)} placeholder="e.g. Al-Madina Drug Corner" className="w-full text-xs" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Price Charged (BDT)</label>
              <input type="number" value={priceCharged} onChange={(e) => setPriceCharged(e.target.value)} placeholder="e.g. 150" className="w-full text-xs" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Description of Defect</label>
              <textarea required rows="2" value={reportDesc} onChange={(e) => setReportDesc(e.target.value)} placeholder="Describe why you believe the medicine is counterfeit..." className="w-full text-xs" />
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <button type="submit" className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-6 py-2 rounded-lg shadow flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5" /> Submit to DGDA
              </button>
            </div>
          </form>
        </div>
      )}

      {reportSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm p-3.5 rounded-2xl flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          {reportSuccess}
        </div>
      )}

      {/* Banned Medicines Alert */}
      {bannedMeds.length > 0 && (
        <div className="bg-gradient-to-r from-rose-600 to-rose-700 text-white rounded-2xl p-4 shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5" />
            <h2 className="text-sm font-bold uppercase tracking-wide">DGDA Recalls & Confiscation Circulars ({bannedMeds.length})</h2>
          </div>
          <div className="space-y-2">
            {bannedMeds.map((b) => (
              <div key={b._id || b.id} className="bg-white/10 backdrop-blur p-3 rounded-xl flex justify-between items-center">
                <div>
                  <strong className="text-sm">{b.brandName}</strong>
                  <span className="text-rose-200 text-xs ml-2">({b.genericName} • {b.strength})</span>
                  <div className="text-rose-200 text-[11px] mt-0.5">⚠️ {b.recallReason}</div>
                </div>
                <span className="text-[10px] bg-white text-rose-700 font-extrabold px-2 py-1 rounded-lg flex-shrink-0 ml-2">BANNED</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Medicine Search */}
        <div className="lg:col-span-2 space-y-4">
          <div className="pulse-card p-4">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search brand (e.g. Napa, Cef-3, Nexum) or generic (Paracetamol)..."
                  className="w-full pl-9 text-xs"
                />
              </div>
              <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg text-xs transition">
                Search
              </button>
            </form>
          </div>

          <div className="space-y-3">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="skeleton-loader h-28 rounded-2xl" />
              ))
            ) : medicines.length === 0 ? (
              <div className="pulse-card p-10 text-center">
                <Pill className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">No medicines found. Try searching by generic name like Paracetamol or Esomeprazole.</p>
              </div>
            ) : (
              medicines.map((med) => (
                <div key={med._id || med.id} className="pulse-card hover-lift p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-100">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h2 className="text-sm font-extrabold text-slate-900">{med.brandName}</h2>
                        <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">{med.strength} {med.dosageForm}</span>
                      </div>
                      <div className="text-xs text-slate-400">
                        Generic: <strong className="text-slate-600">{med.genericName}</strong> • {med.manufacturer}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-[10px] text-slate-400">DGDA Max Price</div>
                      <div className="text-lg font-extrabold text-slate-900">৳ {med.dgdaMaxPrice?.toFixed(2)}</div>
                      <div className="text-[10px] text-slate-400">/unit</div>
                    </div>
                  </div>

                  {med.cheaperGenerics?.length > 0 && (
                    <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-100">
                      <div className="text-xs font-bold text-emerald-800 mb-2 flex items-center gap-1.5">
                        <TrendingDown className="w-4 h-4 text-emerald-600" />
                        Cheaper Equivalent Generics (Same Chemical Salt)
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {med.cheaperGenerics.map((gen, idx) => (
                          <div key={idx} className="bg-white p-2.5 rounded-xl border border-emerald-100 shadow-sm">
                            <strong className="text-xs text-slate-900 block">{gen.brandName}</strong>
                            <div className="text-[10px] text-slate-400 truncate mb-1">{gen.manufacturer}</div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-extrabold text-emerald-700">৳ {gen.price?.toFixed(2)}</span>
                              <span className="text-[10px] bg-emerald-600 text-white font-extrabold px-1.5 py-0.5 rounded-full">-{gen.savingsPercent}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Savings Calculator Sidebar */}
        <div>
          <div className="pulse-card p-5 border-t-4 border-t-emerald-600 sticky top-24">
            <h2 className="font-bold text-sm text-slate-900 flex items-center gap-1.5 mb-2">
              <Calculator className="w-4 h-4 text-emerald-600" />
              Generic Savings Calculator
            </h2>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Calculate how much your household saves by switching to certified lower-cost generics.
            </p>

            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Brand Price (৳/tablet)
                </label>
                <input
                  type="number" step="0.25" value={brandPrice}
                  onChange={(e) => setBrandPrice(e.target.value)}
                  className="w-full text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Generic Price (৳/tablet)
                </label>
                <input
                  type="number" step="0.25" value={genericPrice}
                  onChange={(e) => setGenericPrice(e.target.value)}
                  className="w-full text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Monthly Dosage (tablets)
                </label>
                <input
                  type="number" value={monthlyQty}
                  onChange={(e) => setMonthlyQty(e.target.value)}
                  className="w-full text-xs"
                />
              </div>
            </div>

            {savingsResult && (
              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 space-y-2">
                <div className="text-center mb-3">
                  <div className="text-3xl font-extrabold text-emerald-700">৳ {savingsResult.monthlySavings}</div>
                  <div className="text-xs text-emerald-600 font-semibold">Monthly Savings ({savingsResult.percentageSavings}% less)</div>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Current monthly:</span>
                    <strong>৳ {savingsResult.currentMonthlyExpense}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">With generic:</span>
                    <strong>৳ {savingsResult.genericMonthlyExpense}</strong>
                  </div>
                  <div className="flex justify-between border-t border-emerald-200 pt-1.5">
                    <span className="font-bold text-emerald-800">Annual savings:</span>
                    <strong className="text-emerald-700 text-sm">৳ {savingsResult.yearlySavings} BDT</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicineGuide;
