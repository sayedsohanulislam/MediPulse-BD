import React, { useState, useEffect } from 'react';
import { 
  Shield, Building2, AlertTriangle, CheckCircle, XCircle, 
  RotateCcw, Radio, Clock, User, PlusCircle, Save, Lock 
} from 'lucide-react';
import { hospitalApi, incidentApi, operationsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const AuthorityPortal = ({ onOpenAuth }) => {
  const { user } = useAuth();
  const { t, lang } = useLanguage();
  const [hospitals, setHospitals] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Bed update state
  const [selectedHospId, setSelectedHospId] = useState('');
  const [generalAvail, setGeneralAvail] = useState(140);
  const [icuAvail, setIcuAvail] = useState(4);
  const [ccuAvail, setCcuAvail] = useState(2);
  const [nicuAvail, setNicuAvail] = useState(3);
  const [bedUpdateSuccess, setBedUpdateSuccess] = useState('');

  // New alert broadcast state
  const [alertTitle, setAlertTitle] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('high');
  const [alertCategory, setAlertCategory] = useState('dengue');
  const [alertDesc, setAlertDesc] = useState('');
  const [alertAdvisory, setAlertAdvisory] = useState('');
  const [alertSuccess, setAlertSuccess] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, [user]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [hospRes, incRes, logRes] = await Promise.all([
        hospitalApi.getAll(),
        incidentApi.getAll(),
        operationsApi.getAuditLogs().catch(() => ({ data: { success: true, data: [] } }))
      ]);

      if (hospRes.data.success && hospRes.data.data.length > 0) {
        setHospitals(hospRes.data.data);
        const first = hospRes.data.data[0];
        setSelectedHospId(first._id || first.id);
        setGeneralAvail(first.beds?.general?.available || 0);
        setIcuAvail(first.beds?.icu?.available || 0);
        setCcuAvail(first.beds?.ccu?.available || 0);
        setNicuAvail(first.beds?.nicu?.available || 0);
      }

      if (incRes.data.success) {
        setIncidents(incRes.data.data);
      }

      if (logRes.data.success) {
        setAuditLogs(logRes.data.data);
      }
    } catch (err) {
      console.warn('Authority portal data load error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectHospital = (hospId) => {
    setSelectedHospId(hospId);
    const found = hospitals.find(h => (h._id || h.id) === hospId);
    if (found) {
      setGeneralAvail(found.beds?.general?.available || 0);
      setIcuAvail(found.beds?.icu?.available || 0);
      setCcuAvail(found.beds?.ccu?.available || 0);
      setNicuAvail(found.beds?.nicu?.available || 0);
    }
  };

  const handleSaveBeds = async (e) => {
    e.preventDefault();
    setBedUpdateSuccess('');
    try {
      const target = hospitals.find(h => (h._id || h.id) === selectedHospId);
      const updatedBeds = {
        general: { total: target.beds.general.total, available: Number(generalAvail) },
        icu: { total: target.beds.icu.total, available: Number(icuAvail) },
        ccu: { total: target.beds.ccu.total, available: Number(ccuAvail) },
        nicu: { total: target.beds.nicu.total, available: Number(nicuAvail) }
      };

      const res = await hospitalApi.updateBeds(selectedHospId, { beds: updatedBeds });
      if (res.data.success) {
        setBedUpdateSuccess(`Beds updated for ${target.name}`);
        fetchInitialData();
      }
    } catch (err) {
      alert('Error saving beds: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleToggleSurge = async (hosp) => {
    try {
      const res = await hospitalApi.toggleSurge(hosp._id || hosp.id, {});
      if (res.data.success) {
        fetchInitialData();
      }
    } catch (err) {
      alert('Error updating surge mode');
    }
  };

  const handleUpdateIncidentStatus = async (id, status, notes) => {
    try {
      const res = await incidentApi.updateStatus(id, { status, authorityNotes: notes });
      if (res.data.success) {
        fetchInitialData();
      }
    } catch (err) {
      alert('Error updating incident: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleBroadcastAlert = async (e) => {
    e.preventDefault();
    setAlertSuccess('');
    try {
      const res = await operationsApi.publishAlert({
        title: alertTitle,
        severity: alertSeverity,
        category: alertCategory,
        description: alertDesc,
        advisory: alertAdvisory
      });
      if (res.data.success) {
        setAlertSuccess('Health alert broadcasted live to all citizens.');
        setAlertTitle('');
        setAlertDesc('');
        setAlertAdvisory('');
        fetchInitialData();
      }
    } catch (err) {
      alert('Error publishing alert: ' + (err.response?.data?.message || err.message));
    }
  };

  // Check role authorization
  const isAuthorized = user && (user.role === 'hospital' || user.role === 'admin');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-6 h-6 text-sky-700" />
            <span>Hospital Authority & DGDS Administrator Command</span>
          </h1>
          <p className="text-xs text-slate-500">
            Protected workspace for updating bed counts, managing disaster surge triage, and moderating citizen drug reports
          </p>
        </div>

        {!isAuthorized && (
          <button
            onClick={onOpenAuth}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow flex items-center gap-1.5 transition"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Login as Hospital / Admin Demo</span>
          </button>
        )}
      </div>

      {!isAuthorized && (
        <div className="bg-purple-50 border border-purple-200 p-4 rounded-2xl flex items-center justify-between gap-3">
          <div className="text-xs text-purple-900">
            <strong>Viewing in Public Inspector Mode:</strong> To modify hospital beds, toggle disaster surge modes, or moderate reports, click <strong>"Login as Hospital / Admin Demo"</strong> above.
          </div>
          <button
            onClick={onOpenAuth}
            className="text-xs font-bold text-purple-700 underline shrink-0"
          >
            One-Click Login →
          </button>
        </div>
      )}

      {/* Grid: Bed Manager & Surge Triage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module 1: Live Bed & ICU Capacity Updater */}
        <div className="pulse-card p-5 border-t-4 border-t-sky-600">
          <h2 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-sky-600" />
            <span>Real-Time Bed Occupancy Management</span>
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Changes made here synchronize immediately across the live health grid and hospital finder.
          </p>

          <form onSubmit={handleSaveBeds} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Select Hospital</label>
              <select
                value={selectedHospId}
                onChange={(e) => handleSelectHospital(e.target.value)}
                className="w-full text-xs"
              >
                {hospitals.map(h => (
                  <option key={h._id || h.id} value={h._id || h.id}>
                    {h.name} ({h.district})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Available General Beds</label>
                <input
                  type="number"
                  min="0"
                  value={generalAvail}
                  onChange={(e) => setGeneralAvail(e.target.value)}
                  className="w-full text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-rose-700 mb-1">Available ICU Beds</label>
                <input
                  type="number"
                  min="0"
                  value={icuAvail}
                  onChange={(e) => setIcuAvail(e.target.value)}
                  className="w-full text-xs font-bold text-rose-700"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-amber-700 mb-1">Available CCU Beds</label>
                <input
                  type="number"
                  min="0"
                  value={ccuAvail}
                  onChange={(e) => setCcuAvail(e.target.value)}
                  className="w-full text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-purple-700 mb-1">Available NICU Beds</label>
                <input
                  type="number"
                  min="0"
                  value={nicuAvail}
                  onChange={(e) => setNicuAvail(e.target.value)}
                  className="w-full text-xs"
                />
              </div>
            </div>

            {bedUpdateSuccess && (
              <div className="bg-emerald-50 text-emerald-800 text-xs p-2 rounded-lg border border-emerald-200">
                ✓ {bedUpdateSuccess}
              </div>
            )}

            <button
              type="submit"
              disabled={!isAuthorized}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 rounded-lg text-xs shadow-sm flex items-center justify-center gap-1.5 transition disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save & Publish Live Bed Counts</span>
            </button>
          </form>
        </div>

        {/* Module 2: Mass-Casualty Surge Triage & Alert Engine */}
        <div className="pulse-card p-5 border-t-4 border-t-rose-600 space-y-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Radio className="w-4 h-4 text-rose-600 animate-pulse" />
              <span>Mass-Casualty Disaster Surge Control</span>
            </h2>
            <p className="text-xs text-slate-500">
              Emergency activation converts non-critical observation beds into emergency trauma lines during factory fires, train crashes, or major river ferry accidents.
            </p>
          </div>

          <div className="space-y-2">
            {hospitals.slice(0, 4).map(h => (
              <div key={h._id || h.id} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                <div>
                  <strong className="text-slate-900 block">{h.name}</strong>
                  <span className="text-[11px] text-slate-500">
                    Status: {h.surgeTriageActive ? (
                      <span className="text-rose-600 font-bold">Surge Active</span>
                    ) : (
                      <span className="text-slate-500">Standard Intake</span>
                    )}
                  </span>
                </div>

                <button
                  onClick={() => handleToggleSurge(h)}
                  disabled={!isAuthorized}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition disabled:opacity-50 ${
                    h.surgeTriageActive 
                      ? 'bg-rose-600 text-white border-rose-600' 
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {h.surgeTriageActive ? 'Deactivate Surge' : 'Activate Surge'}
                </button>
              </div>
            ))}
          </div>

          {/* Broadcast Health Notice */}
          <div className="border-t border-slate-200 pt-3">
            <h3 className="font-bold text-xs text-slate-900 mb-2">Publish Public DGHS Health Bulletin</h3>
            <form onSubmit={handleBroadcastAlert} className="space-y-2">
              <input
                type="text"
                required
                value={alertTitle}
                onChange={(e) => setAlertTitle(e.target.value)}
                placeholder="Alert headline (e.g. Unseasonal Dengue Surge Notice)"
                className="w-full text-xs"
              />
              <textarea
                required
                rows="2"
                value={alertDesc}
                onChange={(e) => setAlertDesc(e.target.value)}
                placeholder="Official advisory text for citizens..."
                className="w-full text-xs"
              ></textarea>

              {alertSuccess && (
                <div className="text-emerald-700 text-xs font-semibold">✓ {alertSuccess}</div>
              )}

              <button
                type="submit"
                disabled={!isAuthorized}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-1.5 px-4 rounded-lg disabled:opacity-50"
              >
                Broadcast Notice Live
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Crowdsourced Citizen Incidents Moderation Queue */}
      <div className="pulse-card p-5 border-t-4 border-t-amber-500">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Crowdsourced Fake Medicine & Overpricing Review Queue ({incidents.length})
            </h2>
            <p className="text-xs text-slate-500">
              Submissions filed by citizens requiring DGDA / magistrate verification
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {incidents.map((inc) => (
            <div key={inc._id || inc.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-sm text-slate-900">{inc.title}</strong>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      inc.status === 'verified_action_taken' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : (inc.status === 'investigating' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700')
                    }`}>
                      {inc.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Reported by: {inc.reporterName} • {inc.location?.district} ({inc.location?.areaOrHospital})
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleUpdateIncidentStatus(inc._id || inc.id, 'investigating', 'Assigned to field inspector.')}
                    disabled={!isAuthorized}
                    className="bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold px-2.5 py-1 rounded text-[11px] disabled:opacity-50"
                  >
                    Investigate
                  </button>
                  <button
                    onClick={() => handleUpdateIncidentStatus(inc._id || inc.id, 'verified_action_taken', 'Magistrate confiscated stock and issued penalty.')}
                    disabled={!isAuthorized}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1 rounded text-[11px] disabled:opacity-50"
                  >
                    Action Taken
                  </button>
                  <button
                    onClick={() => handleUpdateIncidentStatus(inc._id || inc.id, 'rejected', 'Insufficient evidence provided.')}
                    disabled={!isAuthorized}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-2.5 py-1 rounded text-[11px] disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              </div>

              <p className="text-slate-700 leading-relaxed mb-2">{inc.description}</p>
              
              <div className="flex flex-wrap gap-4 text-[11px] text-slate-500">
                {inc.pharmacyOrClinic && <div>🏪 Vendor: <strong>{inc.pharmacyOrClinic}</strong></div>}
                {inc.medicineBatchNo && <div>🏷️ Batch: <strong>{inc.medicineBatchNo}</strong></div>}
                {inc.priceCharged > 0 && <div>💰 Charged: <strong>৳ {inc.priceCharged} BDT</strong></div>}
                {inc.authorityNotes && <div className="text-sky-700">⚖️ Note: <strong>{inc.authorityNotes}</strong></div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Audit Trail */}
      {auditLogs.length > 0 && (
        <div className="pulse-card p-5">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
            Immutable Administrative Audit Trail ({auditLogs.length} Actions)
          </h2>
          <div className="space-y-1.5 max-h-48 overflow-y-auto text-xs">
            {auditLogs.map((log, idx) => (
              <div key={idx} className="bg-slate-50 p-2 rounded border border-slate-200 flex justify-between items-center text-[11px]">
                <div>
                  <strong className="text-slate-800">{log.action}</strong> on <em>{log.targetEntity || 'System'}</em> by <span className="font-semibold text-sky-700">{log.performedBy} ({log.role})</span>
                </div>
                <span className="text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorityPortal;
