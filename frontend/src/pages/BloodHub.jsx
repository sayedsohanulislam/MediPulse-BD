import React, { useState, useEffect } from 'react';
import { 
  Heart, ShieldAlert, Search, PhoneCall, Calendar, Award, 
  UserPlus, CheckCircle, Clock, AlertTriangle, Send 
} from 'lucide-react';
import { bloodApi } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const BloodHub = () => {
  const { t, lang } = useLanguage();
  const [donors, setDonors] = useState([]);
  const [activeSos, setActiveSos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [bloodGroup, setBloodGroup] = useState('All');
  const [district, setDistrict] = useState('All');

  // SOS Form state
  const [showSosForm, setShowSosForm] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [sosBloodGroup, setSosBloodGroup] = useState('O+');
  const [unitsRequired, setUnitsRequired] = useState(2);
  const [hospitalName, setHospitalName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [sosSuccess, setSosSuccess] = useState('');

  // Eligibility Calculator
  const [lastDate, setLastDate] = useState('');
  const [eligibilityResult, setEligibilityResult] = useState(null);

  useEffect(() => {
    fetchDonors();
    fetchSos();
  }, [bloodGroup, district]);

  const fetchDonors = async () => {
    setLoading(true);
    try {
      const params = {};
      if (bloodGroup !== 'All') params.bloodGroup = bloodGroup;
      if (district !== 'All') params.district = district;
      const res = await bloodApi.searchDonors(params);
      if (res.data.success) setDonors(res.data.data);
    } catch (err) {
      console.warn('Error fetching donors:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSos = async () => {
    try {
      const res = await bloodApi.getActiveSos();
      if (res.data.success) setActiveSos(res.data.data);
    } catch (err) {}
  };

  const handleCreateSos = async (e) => {
    e.preventDefault();
    setSosSuccess('');
    try {
      const res = await bloodApi.triggerSos({
        patientName,
        bloodGroup: sosBloodGroup,
        unitsRequired,
        hospitalName,
        contactPhone
      });
      if (res.data.success) {
        setSosSuccess(res.data.message);
        fetchSos();
        setShowSosForm(false);
        setPatientName('');
        setHospitalName('');
        setContactPhone('');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error triggering SOS');
    }
  };

  const handleCheckEligibility = async (e) => {
    e.preventDefault();
    if (!lastDate) return;
    try {
      const res = await bloodApi.checkEligibility({ lastDonationDate: lastDate });
      if (res.data.success) {
        setEligibilityResult(res.data);
      }
    } catch (err) {}
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-600 fill-rose-600" />
            <span>Emergency Blood SOS & Donor Network</span>
          </h1>
          <p className="text-xs text-slate-500">
            Real-time donor matchmaking across 8 blood groups and 64 districts in Bangladesh
          </p>
        </div>

        <button
          onClick={() => setShowSosForm(!showSosForm)}
          className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center gap-2 transition"
        >
          <ShieldAlert className="w-4 h-4 animate-bounce" />
          <span>{showSosForm ? 'Close SOS Form' : 'Broadcast Urgent SOS'}</span>
        </button>
      </div>

      {/* SOS Form Modal/Drawer */}
      {showSosForm && (
        <div className="pulse-card p-5 border-2 border-rose-400 bg-rose-50/60 shadow-lg">
          <h2 className="text-sm font-bold text-rose-900 mb-1 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>Broadcast Emergency Blood SOS to Ready Donors</span>
          </h2>
          <p className="text-xs text-slate-600 mb-4">
            Submitting this instantly posts your emergency request to the live broadcast marquee and triggers SMS simulations to nearby donors.
          </p>

          <form onSubmit={handleCreateSos} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Patient Name</label>
              <input
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="e.g. Khadija Begum"
                className="w-full text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Blood Group</label>
              <select
                value={sosBloodGroup}
                onChange={(e) => setSosBloodGroup(e.target.value)}
                className="w-full text-xs"
              >
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Units (Bags)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={unitsRequired}
                onChange={(e) => setUnitsRequired(e.target.value)}
                className="w-full text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Hospital / Clinic</label>
              <input
                type="text"
                required
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                placeholder="e.g. DMCH Emergency Ward"
                className="w-full text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Contact Phone</label>
              <input
                type="text"
                required
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="017xxxxxxxx"
                className="w-full text-xs"
              />
            </div>

            <div className="lg:col-span-5 flex justify-end">
              <button
                type="submit"
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-6 py-2 rounded-lg shadow transition flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Confirm & Dispatch Urgent SOS</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {sosSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{sosSuccess}</span>
        </div>
      )}

      {/* Top Banner: Active Emergency SOS Broadcasts */}
      {activeSos.length > 0 && (
        <div className="pulse-card p-4 border-l-4 border-l-rose-600">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping"></span>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Live Urgent SOS Broadcasts ({activeSos.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeSos.map((sos) => (
              <div key={sos.id} className="bg-rose-50/70 p-3 rounded-xl border border-rose-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="bg-rose-600 text-white font-extrabold text-xs px-2 py-0.5 rounded">
                      {sos.bloodGroup}
                    </span>
                    <span className="text-[10px] bg-rose-200 text-rose-900 font-bold px-1.5 py-0.5 rounded">
                      Urgent ({sos.unitsRequired} Bag)
                    </span>
                  </div>
                  <strong className="text-xs text-slate-900 block">{sos.patientName}</strong>
                  <div className="text-[11px] text-slate-600 mt-1">🏥 {sos.hospitalName}</div>
                </div>

                <a
                  href={`tel:${sos.contactPhone}`}
                  className="mt-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-1.5 px-3 rounded-lg text-center flex items-center justify-center gap-1.5 text-decoration-none"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Attendant: {sos.contactPhone}</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Donors Filter & List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="pulse-card p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-slate-600">Filter Donors:</span>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="text-xs py-1.5"
              >
                <option value="All">{t('all_blood_groups')}</option>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>

              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="text-xs py-1.5"
              >
                <option value="All">{t('all_districts')}</option>
                <option value="Dhaka">Dhaka</option>
                <option value="Chittagong">Chittagong</option>
                <option value="Sylhet">Sylhet</option>
              </select>
            </div>

            <div className="text-xs text-slate-500">
              Showing <strong>{donors.length}</strong> Ready Donors
            </div>
          </div>

          {/* Donors Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {loading ? (
              <div className="col-span-2 text-center py-10 text-slate-400 text-xs">Finding available donors...</div>
            ) : donors.length === 0 ? (
              <div className="col-span-2 pulse-card p-8 text-center text-slate-500 text-xs">
                No matching donors found. Broadcast an Urgent SOS to reach donors across nearby areas!
              </div>
            ) : (
              donors.map((don) => (
                <div key={don._id || don.id} className="pulse-card p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-rose-600 text-white font-extrabold text-sm px-2.5 py-0.5 rounded-lg shadow-sm">
                        {don.bloodGroup}
                      </span>
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Award className="w-3 h-3 text-amber-600" />
                        <span>{don.heroBadge || 'Bronze'}</span>
                      </span>
                    </div>

                    <strong className="text-sm text-slate-900 block">{don.name}</strong>
                    <div className="text-xs text-slate-500 mt-0.5">
                      📍 {don.upazila ? `${don.upazila}, ` : ''}{don.district}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Donations: <strong>{don.donationCount || 0} times</strong>
                    </div>
                  </div>

                  <a
                    href={`tel:${don.phone}`}
                    className="mt-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2 px-3 rounded-lg text-center flex items-center justify-center gap-1.5 transition text-decoration-none"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Call Donor: {don.phone}</span>
                  </a>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar: Safe Blood Donation Next Date Calculator */}
        <div className="space-y-4">
          <div className="pulse-card p-5 border-t-4 border-t-rose-500">
            <h2 className="font-bold text-sm text-slate-900 flex items-center gap-1.5 mb-2">
              <Calendar className="w-4 h-4 text-rose-600" />
              <span>Next Safe Donation Date Calculator</span>
            </h2>
            <p className="text-xs text-slate-500 mb-3">
              In Bangladesh, male donors should wait 90 days and females 120 days between whole blood donations for safe hemoglobin recovery.
            </p>

            <form onSubmit={handleCheckEligibility} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Last Donation Date
                </label>
                <input
                  type="date"
                  required
                  value={lastDate}
                  onChange={(e) => setLastDate(e.target.value)}
                  className="w-full text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2 rounded-lg text-xs shadow-sm transition"
              >
                Check My Eligibility
              </button>
            </form>

            {eligibilityResult && (
              <div className={`mt-3 p-3 rounded-xl border text-xs ${
                eligibilityResult.isEligibleNow 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}>
                <div className="font-bold mb-1">
                  {eligibilityResult.isEligibleNow ? '✓ Eligible to Donate Now' : '⏳ Recovery Period Active'}
                </div>
                <div>{eligibilityResult.guidance}</div>
                <div className="mt-1 text-[11px] text-slate-500">
                  Next eligible date: <strong>{eligibilityResult.nextEligibleDate}</strong>
                </div>
              </div>
            )}
          </div>

          {/* Blood Compatibility Quick Reference */}
          <div className="pulse-card p-4 text-xs text-slate-600">
            <div className="font-bold text-slate-900 mb-2">🩸 Universal Compatibility</div>
            <ul className="space-y-1 text-[11px]">
              <li>• <strong>O- Negative:</strong> Universal Donor (can give to all groups)</li>
              <li>• <strong>AB+ Positive:</strong> Universal Recipient (can receive from all)</li>
              <li>• <strong>Platelet Need:</strong> Dengue shock patients require matched platelets urgently!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BloodHub;
