import React, { useState, useEffect } from 'react';
import {
  Heart, ShieldAlert, Search, PhoneCall, Calendar, Award,
  UserPlus, CheckCircle, Clock, AlertTriangle, Send, X, Users
} from 'lucide-react';
import { bloodApi } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const BADGE_STYLES = {
  'Gold Hero': { bg: 'bg-yellow-50 border-yellow-200', text: 'text-yellow-700', icon: '🥇' },
  'Silver Hero': { bg: 'bg-slate-50 border-slate-200', text: 'text-slate-600', icon: '🥈' },
  'Bronze': { bg: 'bg-orange-50 border-orange-200', text: 'text-orange-700', icon: '🥉' },
  'default': { bg: 'bg-slate-50 border-slate-200', text: 'text-slate-500', icon: '🥉' },
};

const BloodGroupPicker = ({ selected, onChange, label = 'Filter' }) => (
  <div>
    <div className="text-xs font-semibold text-slate-600 mb-2">{label}:</div>
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange('All')}
        className={`blood-group-btn text-xs ${
          selected === 'All'
            ? 'bg-slate-800 text-white border-slate-800 shadow-sm'
            : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
        }`}
      >
        All Groups
      </button>
      {BLOOD_GROUPS.map(bg => (
        <button
          key={bg}
          onClick={() => onChange(bg)}
          className={`blood-group-btn ${
            selected === bg ? 'active shadow-sm' : ''
          }`}
        >
          {bg}
        </button>
      ))}
    </div>
  </div>
);

const BloodHub = () => {
  const { t, lang } = useLanguage();
  const [donors, setDonors] = useState([]);
  const [activeSos, setActiveSos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bloodGroup, setBloodGroup] = useState('All');
  const [district, setDistrict] = useState('All');
  const [showSosForm, setShowSosForm] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [sosBloodGroup, setSosBloodGroup] = useState('O+');
  const [unitsRequired, setUnitsRequired] = useState(2);
  const [hospitalName, setHospitalName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [sosSuccess, setSosSuccess] = useState('');
  const [lastDate, setLastDate] = useState('');
  const [eligibilityResult, setEligibilityResult] = useState(null);

  useEffect(() => { fetchDonors(); fetchSos(); }, [bloodGroup, district]);

  const fetchDonors = async () => {
    setLoading(true);
    try {
      const params = {};
      if (bloodGroup !== 'All') params.bloodGroup = bloodGroup;
      if (district !== 'All') params.district = district;
      const res = await bloodApi.searchDonors(params);
      if (res.data.success) setDonors(res.data.data);
    } catch (err) { console.warn('Donor fetch error:', err.message); }
    finally { setLoading(false); }
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
      const res = await bloodApi.triggerSos({ patientName, bloodGroup: sosBloodGroup, unitsRequired, hospitalName, contactPhone });
      if (res.data.success) {
        setSosSuccess(res.data.message);
        fetchSos();
        setShowSosForm(false);
        setPatientName(''); setHospitalName(''); setContactPhone('');
      }
    } catch (err) { alert(err.response?.data?.message || 'Error triggering SOS'); }
  };

  const handleCheckEligibility = async (e) => {
    e.preventDefault();
    if (!lastDate) return;
    try {
      const res = await bloodApi.checkEligibility({ lastDonationDate: lastDate });
      if (res.data.success) setEligibilityResult(res.data);
    } catch (err) {}
  };

  return (
    <div className="space-y-6 page-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center">
              <Heart className="w-5 h-5 text-rose-600 fill-rose-200" />
            </div>
            Emergency Blood SOS &amp; Donor Network
          </h1>
          <p className="text-xs text-slate-400 mt-1 ml-11">
            Real-time donor matchmaking across 8 blood groups and 64 districts in Bangladesh
          </p>
        </div>
        <button
          onClick={() => setShowSosForm(true)}
          className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm px-5 py-3 rounded-xl shadow-lg shadow-rose-600/20 flex items-center gap-2 transition animate-sos"
        >
          <ShieldAlert className="w-4 h-4" />
          Broadcast Urgent SOS
        </button>
      </div>

      {/* SOS Success */}
      {sosSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm p-4 rounded-2xl flex items-center gap-2.5 animate-fade-in-up">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{sosSuccess}</span>
        </div>
      )}

      {/* Active SOS Broadcasts */}
      {activeSos.length > 0 && (
        <div className="pulse-card p-4 border-l-4 border-l-rose-600 bg-rose-50/30">
          <div className="flex items-center gap-2 mb-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute h-full w-full rounded-full bg-rose-500 opacity-75" />
              <span className="relative rounded-full h-3 w-3 bg-rose-600" />
            </span>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Live Urgent SOS ({activeSos.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeSos.map((sos) => (
              <div key={sos.id} className="bg-white p-3.5 rounded-2xl border border-rose-200 shadow-sm hover-lift">
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-rose-600 text-white font-extrabold text-sm px-2.5 py-0.5 rounded-lg shadow-sm">{sos.bloodGroup}</span>
                  <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-full">Urgent • {sos.unitsRequired} Bag(s)</span>
                </div>
                <strong className="text-sm text-slate-900 block mb-0.5">{sos.patientName}</strong>
                <div className="text-xs text-slate-500 mb-3">🏥 {sos.hospitalName}</div>
                <a
                  href={`tel:${sos.contactPhone}`}
                  className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-2 px-3 rounded-xl text-center flex items-center justify-center gap-1.5 no-underline transition"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  Call: {sos.contactPhone}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Filter Controls */}
          <div className="pulse-card p-4 space-y-4">
            <BloodGroupPicker selected={bloodGroup} onChange={setBloodGroup} label="Filter by Blood Group" />
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-slate-600">District:</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="text-xs py-1.5 pr-6"
                >
                  <option value="All">{t('all_districts')}</option>
                  <option value="Dhaka">Dhaka</option>
                  <option value="Chittagong">Chittagong</option>
                  <option value="Sylhet">Sylhet</option>
                </select>
              </div>
              <div className="ml-auto text-xs text-slate-500 font-medium">
                <Users className="w-3.5 h-3.5 inline mr-1 text-sky-500" />
                <strong>{donors.length}</strong> Ready Donors
              </div>
            </div>
          </div>

          {/* Donors Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {loading ? (
              [...Array(6)].map((_, i) => (
                <div key={i} className="skeleton-loader h-36 rounded-2xl" />
              ))
            ) : donors.length === 0 ? (
              <div className="col-span-2 pulse-card p-10 text-center">
                <Heart className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">No donors found. Broadcast a SOS to reach nearby donors!</p>
              </div>
            ) : (
              donors.map((don) => {
                const badge = BADGE_STYLES[don.heroBadge] || BADGE_STYLES['default'];
                return (
                  <div key={don._id || don.id} className="pulse-card hover-lift p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center">
                            <span className="text-xl font-extrabold text-rose-600">{don.bloodGroup}</span>
                          </div>
                          <div>
                            <strong className="text-sm text-slate-900 block">{don.name}</strong>
                            <div className="text-xs text-slate-400">
                              📍 {don.upazila ? `${don.upazila}, ` : ''}{don.district}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              {don.donationCount || 0} donations
                            </div>
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full border flex items-center gap-1 ${badge.bg} ${badge.text}`}>
                          {badge.icon} {don.heroBadge || 'Bronze'}
                        </span>
                      </div>
                    </div>
                    <a
                      href={`tel:${don.phone}`}
                      className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2.5 px-3 rounded-xl text-center flex items-center justify-center gap-1.5 no-underline transition"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                      Call Donor: {don.phone}
                    </a>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Eligibility Calculator */}
          <div className="pulse-card p-5 border-t-4 border-t-rose-500">
            <h2 className="font-bold text-sm text-slate-900 flex items-center gap-1.5 mb-2">
              <Calendar className="w-4 h-4 text-rose-600" />
              Donation Eligibility Check
            </h2>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Male donors wait 90 days, females 120 days between whole blood donations.
            </p>
            <form onSubmit={handleCheckEligibility} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Last Donation Date</label>
                <input
                  type="date"
                  required
                  value={lastDate}
                  onChange={(e) => setLastDate(e.target.value)}
                  className="w-full text-xs"
                />
              </div>
              <button type="submit" className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2.5 rounded-xl text-xs transition">
                Check My Eligibility
              </button>
            </form>

            {eligibilityResult && (
              <div className={`mt-3 p-3 rounded-xl border text-xs ${
                eligibilityResult.isEligibleNow
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}>
                <div className="font-bold mb-1 flex items-center gap-1.5">
                  {eligibilityResult.isEligibleNow ? (
                    <><CheckCircle className="w-4 h-4 text-emerald-600" /> You Can Donate Now!</>
                  ) : (
                    <><Clock className="w-4 h-4 text-amber-600" /> Recovery Period Active</>
                  )}
                </div>
                <p>{eligibilityResult.guidance}</p>
                <p className="mt-1 text-[11px] opacity-75">
                  Next eligible: <strong>{eligibilityResult.nextEligibleDate}</strong>
                </p>
              </div>
            )}
          </div>

          {/* Compatibility Chart */}
          <div className="pulse-card p-4">
            <div className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-1.5">
              🩸 Universal Compatibility
            </div>
            <div className="space-y-2 text-xs">
              {[
                { group: 'O−', role: 'Universal Donor', note: 'Can give to ALL groups', color: 'bg-rose-600' },
                { group: 'AB+', role: 'Universal Recipient', note: 'Can receive from ALL', color: 'bg-purple-600' },
                { group: 'Plt.', role: 'Dengue Critical', note: 'Matched platelets urgently', color: 'bg-amber-500' },
              ].map(item => (
                <div key={item.group} className="flex items-start gap-2.5">
                  <span className={`${item.color} text-white font-extrabold text-[11px] px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5`}>{item.group}</span>
                  <div>
                    <div className="font-bold text-slate-800">{item.role}</div>
                    <div className="text-[11px] text-slate-400">{item.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SOS Modal */}
      {showSosForm && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="mobile-menu-overlay absolute inset-0" onClick={() => setShowSosForm(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl border border-rose-200 w-full max-w-lg mx-auto animate-fade-in-up">
            <div className="bg-rose-600 text-white p-5 rounded-t-3xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5" />
                <h2 className="font-bold text-base">Broadcast Emergency Blood SOS</h2>
              </div>
              <button onClick={() => setShowSosForm(false)} className="w-8 h-8 rounded-full bg-rose-700 flex items-center justify-center hover:bg-rose-800 transition">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5">
              <p className="text-xs text-slate-500 mb-4">
                This instantly posts your request to the live broadcast and triggers SMS simulations to nearby donors.
              </p>
              <div className="mb-4">
                <BloodGroupPicker selected={sosBloodGroup} onChange={setSosBloodGroup} label="Required Blood Group" />
              </div>
              <form onSubmit={handleCreateSos} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Patient Name</label>
                    <input type="text" required value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder="e.g. Khadija Begum" className="w-full text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Units (Bags)</label>
                    <input type="number" min="1" max="10" value={unitsRequired} onChange={(e) => setUnitsRequired(e.target.value)} className="w-full text-xs" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Hospital / Clinic</label>
                  <input type="text" required value={hospitalName} onChange={(e) => setHospitalName(e.target.value)} placeholder="e.g. DMCH Emergency Ward" className="w-full text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone</label>
                  <input type="text" required value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="017xxxxxxxx" className="w-full text-xs" />
                </div>
                <button type="submit" className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-rose-600/20">
                  <Send className="w-4 h-4" />
                  Confirm &amp; Dispatch Urgent SOS
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BloodHub;
