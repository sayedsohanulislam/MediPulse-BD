import React, { useState, useEffect } from 'react';
import { 
  Pill, Search, AlertTriangle, Calculator, ShieldCheck, 
  Send, DollarSign, CheckCircle, ArrowDownRight, FileText 
} from 'lucide-react';
import { medicineApi, incidentApi } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const MedicineGuide = () => {
  const { t, lang } = useLanguage();
  const [medicines, setMedicines] = useState([]);
  const [bannedMeds, setBannedMeds] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Savings Calculator State
  const [brandPrice, setBrandPrice] = useState(3.5);
  const [genericPrice, setGenericPrice] = useState(2.75);
  const [monthlyQty, setMonthlyQty] = useState(60);
  const [savingsResult, setSavingsResult] = useState(null);

  // Incident / Fake Drug Report Form
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

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const res = await medicineApi.search({ search });
      if (res.data.success) setMedicines(res.data.data);
    } catch (err) {
      console.warn('Medicine fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchBanned = async () => {
    try {
      const res = await medicineApi.getBanned();
      if (res.data.success) setBannedMeds(res.data.data);
    } catch (err) {}
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMedicines();
  };

  const calculateSavings = async () => {
    try {
      const res = await medicineApi.calculateSavings({
        currentBrandPrice: brandPrice,
        genericPrice: genericPrice,
        monthlyTablets: monthlyQty
      });
      if (res.data.success) setSavingsResult(res.data.data);
    } catch (err) {}
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
        setReportTitle('');
        setReportDesc('');
      }
    } catch (err) {
      alert('Error submitting report: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Pill className="w-6 h-6 text-emerald-600" />
            <span>DGDA Generic Drug Guide & Price Intelligence</span>
          </h1>
          <p className="text-xs text-slate-500">
            Compare brand prices against generic alternatives, calculate family savings, and verify recalled batches
          </p>
        </div>

        <button
          onClick={() => setShowReportForm(!showReportForm)}
          className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow flex items-center gap-1.5 transition"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Report Counterfeit Drug</span>
        </button>
      </div>

      {/* Whistleblower Form */}
      {showReportForm && (
        <div className="pulse-card p-5 border-2 border-rose-400 bg-rose-50/50 shadow-lg">
          <h2 className="text-sm font-bold text-rose-900 mb-1 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>File Counterfeit Medicine / Overpricing Report</span>
          </h2>
          <p className="text-xs text-slate-600 mb-4">
            Submissions are audited by the Directorate General of Drug Administration (DGDA) and consumer rights taskforces.
          </p>

          <form onSubmit={handleSubmitReport} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Medicine Brand Name & Issue</label>
              <input
                type="text"
                required
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                placeholder="e.g. Faded Napa Extra packaging"
                className="w-full text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Batch Number (from packaging)</label>
              <input
                type="text"
                value={batchNo}
                onChange={(e) => setBatchNo(e.target.value)}
                placeholder="e.g. NX-2024-88"
                className="w-full text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Pharmacy Name / Vendor</label>
              <input
                type="text"
                value={pharmacyName}
                onChange={(e) => setPharmacyName(e.target.value)}
                placeholder="e.g. Al-Madina Drug Corner"
                className="w-full text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Price Charged (BDT)</label>
              <input
                type="number"
                value={priceCharged}
                onChange={(e) => setPriceCharged(e.target.value)}
                placeholder="e.g. 150"
                className="w-full text-xs"
              />
            </div>

            <div className="lg:col-span-4">
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Detailed Description of Defect</label>
              <textarea
                required
                rows="2"
                value={reportDesc}
                onChange={(e) => setReportDesc(e.target.value)}
                placeholder="Describe why you believe the medicine is counterfeit (strange smell, crumbling tablet, missing holographic seal, or refusal of receipt)..."
                className="w-full text-xs"
              ></textarea>
            </div>

            <div className="lg:col-span-4 flex justify-end">
              <button
                type="submit"
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-6 py-2 rounded-lg shadow flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit to DGDA Review</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {reportSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{reportSuccess}</span>
        </div>
      )}

      {/* DGDA Banned & Recalled Alerts Section */}
      {bannedMeds.length > 0 && (
        <div className="pulse-card p-4 border-l-4 border-l-rose-600 bg-rose-50/40">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <h2 className="text-xs font-bold text-rose-900 uppercase tracking-wide">
              Official DGDA Recalls & Confiscation Circulars ({bannedMeds.length})
            </h2>
          </div>
          <div className="space-y-2">
            {bannedMeds.map((b) => (
              <div key={b._id || b.id} className="bg-white p-3 rounded-xl border border-rose-200 text-xs flex justify-between items-center">
                <div>
                  <strong className="text-rose-900 text-sm">{b.brandName}</strong>
                  <span className="text-slate-500 ml-2">({b.genericName} • {b.strength})</span>
                  <div className="text-rose-700 font-medium text-[11px] mt-0.5">
                    ⚠️ {b.recallReason}
                  </div>
                </div>
                <span className="text-[10px] bg-rose-600 text-white font-extrabold px-2 py-1 rounded">
                  BANNED
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Medicine Search & Generic Alternates */}
        <div className="lg:col-span-2 space-y-4">
          <div className="pulse-card p-4">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search brand name (e.g. Napa, Cef-3, Nexum) or generic (Paracetamol)..."
                  className="w-full pl-9 text-xs"
                />
              </div>
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-lg text-xs"
              >
                Search
              </button>
            </form>
          </div>

          <div className="space-y-3.5">
            {loading ? (
              <div className="text-center py-10 text-slate-400 text-xs">Searching drug database...</div>
            ) : medicines.length === 0 ? (
              <div className="pulse-card p-8 text-center text-slate-500 text-xs">
                No medicines found. Try searching by generic name like Paracetamol or Esomeprazole.
              </div>
            ) : (
              medicines.map((med) => (
                <div key={med._id || med.id} className="pulse-card p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm font-bold text-slate-900">{med.brandName}</h2>
                        <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                          {med.strength} {med.dosageForm}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Generic: <strong className="text-slate-700">{med.genericName}</strong> • {med.manufacturer}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] text-slate-500">DGDA Price Cap:</div>
                      <div className="text-sm font-extrabold text-slate-900">
                        ৳ {med.dgdaMaxPrice.toFixed(2)} <span className="text-[10px] font-normal text-slate-400">/unit</span>
                      </div>
                    </div>
                  </div>

                  {/* Cheaper Generic Alternatives */}
                  {med.cheaperGenerics && med.cheaperGenerics.length > 0 && (
                    <div className="mt-3 bg-emerald-50/50 p-3 rounded-xl border border-emerald-200/80">
                      <div className="text-xs font-bold text-emerald-900 mb-2 flex items-center gap-1">
                        <ArrowDownRight className="w-4 h-4 text-emerald-600" />
                        <span>Cheaper Equivalent Generics (Identical Chemical Salt):</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {med.cheaperGenerics.map((gen, idx) => (
                          <div key={idx} className="bg-white p-2 rounded-lg border border-emerald-100 text-xs">
                            <strong className="text-slate-900 block">{gen.brandName}</strong>
                            <div className="text-[10px] text-slate-500 truncate">{gen.manufacturer}</div>
                            <div className="mt-1 flex justify-between items-center">
                              <span className="text-emerald-700 font-bold">৳ {gen.price.toFixed(2)}</span>
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.2 rounded">
                                -{gen.savingsPercent}%
                              </span>
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

        {/* Sidebar: Generic Medicine Savings Calculator */}
        <div className="space-y-4">
          <div className="pulse-card p-5 border-t-4 border-t-emerald-600">
            <h2 className="font-bold text-sm text-slate-900 flex items-center gap-1.5 mb-2">
              <Calculator className="w-4 h-4 text-emerald-600" />
              <span>Generic Medicine Savings Calculator</span>
            </h2>
            <p className="text-xs text-slate-500 mb-3">
              Calculate how much your household can save on chronic medications (diabetes, blood pressure, gastric) by switching to certified lower-cost generics.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Current Brand Price (৳ / tablet)
                </label>
                <input
                  type="number"
                  step="0.25"
                  value={brandPrice}
                  onChange={(e) => setBrandPrice(e.target.value)}
                  className="w-full text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cheaper Generic Alternative Price (৳)
                </label>
                <input
                  type="number"
                  step="0.25"
                  value={genericPrice}
                  onChange={(e) => setGenericPrice(e.target.value)}
                  className="w-full text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Monthly Dosage (Tablets per month)
                </label>
                <input
                  type="number"
                  value={monthlyQty}
                  onChange={(e) => setMonthlyQty(e.target.value)}
                  className="w-full text-xs"
                />
              </div>

              <button
                type="button"
                onClick={calculateSavings}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg text-xs shadow-sm transition"
              >
                Recalculate Savings
              </button>
            </div>

            {savingsResult && (
              <div className="mt-4 bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">Monthly Expense Now:</span>
                  <strong className="text-slate-900">৳ {savingsResult.currentMonthlyExpense}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">With Cheaper Generic:</span>
                  <strong className="text-slate-900">৳ {savingsResult.genericMonthlyExpense}</strong>
                </div>
                <div className="flex justify-between border-t border-emerald-200 pt-1.5">
                  <span className="font-semibold text-emerald-900">Monthly Savings:</span>
                  <strong className="text-emerald-700 font-extrabold text-sm">৳ {savingsResult.monthlySavings} ({savingsResult.percentageSavings}%)</strong>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-emerald-900">Annual Family Savings:</span>
                  <strong className="text-emerald-800 font-extrabold text-sm">৳ {savingsResult.yearlySavings} BDT</strong>
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
