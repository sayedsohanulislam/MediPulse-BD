import React, { useState, useEffect } from 'react';
import {
  Building2, Search, MapPin, PhoneCall, Bed, Navigation,
  Clock, ShieldAlert, CheckCircle, Activity, User, AlertCircle, ChevronDown, ChevronUp
} from 'lucide-react';
import { hospitalApi, healthApi } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const BedBar = ({ available, total, color = 'bg-sky-500', label }) => {
  const pct = total > 0 ? Math.min((available / total) * 100, 100) : 0;
  const barColor = available <= 2 ? 'bg-rose-500' : available <= 7 ? 'bg-amber-500' : 'bg-emerald-500';
  return (
    <div>
      <div className="flex justify-between items-baseline mb-1">
        <span className="text-[10px] text-slate-500">{label}</span>
        <span className={`text-xs font-extrabold ${
          available <= 2 ? 'text-rose-600' : available <= 7 ? 'text-amber-600' : 'text-emerald-600'
        }`}>{available}<span className="text-slate-400 font-normal">/{total}</span></span>
      </div>
      <div className="progress-bar">
        <div className={`progress-bar-fill ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

const facilityColors = {
  'ICU': 'bg-rose-100 text-rose-800 border-rose-200',
  'Blood Bank': 'bg-red-100 text-red-800 border-red-200',
  'Trauma Center': 'bg-amber-100 text-amber-800 border-amber-200',
  'Oxygen Plant': 'bg-sky-100 text-sky-800 border-sky-200',
  'Burn Unit': 'bg-orange-100 text-orange-800 border-orange-200',
  'Dialysis Center': 'bg-purple-100 text-purple-800 border-purple-200',
  'default': 'bg-slate-100 text-slate-700 border-slate-200',
};

const getUrgencyBorder = (icu) => {
  const a = icu?.available ?? 5;
  if (a <= 2) return 'border-rose-400 ring-1 ring-rose-100';
  if (a <= 7) return 'border-amber-300';
  return 'border-slate-200';
};

const HospitalFinder = () => {
  const { t, lang } = useLanguage();
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [district, setDistrict] = useState('All');
  const [type, setType] = useState('All');
  const [facility, setFacility] = useState('');
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [userLocation] = useState({ lat: 23.8103, lng: 90.4125 });
  const [routeData, setRouteData] = useState(null);
  const [routingLoading, setRoutingLoading] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => { fetchHospitals(); }, [district, type, facility]);

  const fetchHospitals = async () => {
    setLoading(true);
    try {
      const params = {};
      if (district !== 'All') params.district = district;
      if (type !== 'All') params.type = type;
      if (facility) params.facility = facility;
      if (search) params.search = search;
      const res = await hospitalApi.getAll(params);
      if (res.data.success) {
        setHospitals(res.data.data);
        if (res.data.data.length > 0 && !selectedHospital) setSelectedHospital(res.data.data[0]);
      }
    } catch (err) {
      console.warn('Failed to fetch hospitals:', err.message);
    } finally { setLoading(false); }
  };

  const handleSearchSubmit = (e) => { e.preventDefault(); fetchHospitals(); };

  const handleCalculateRoute = async (hosp) => {
    setSelectedHospital(hosp);
    setRoutingLoading(true);
    setRouteData(null);
    try {
      const res = await healthApi.calculateRoute({
        originLat: userLocation.lat, originLng: userLocation.lng,
        destLat: hosp.coordinates.lat, destLng: hosp.coordinates.lng
      });
      if (res.data.success) setRouteData(res.data.data);
    } catch (err) { console.warn('Route error:', err.message); }
    finally { setRoutingLoading(false); }
  };

  return (
    <div className="space-y-5 page-container">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-sky-100 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-sky-600" />
          </div>
          Hospital &amp; ICU Capacity Directory
        </h1>
        <p className="text-xs text-slate-400 mt-1 ml-11">
          Live verified bed occupancy, OSRM dynamic routing, and OPD queue estimators across Bangladesh
        </p>
      </div>

      {/* Filter Bar */}
      <div className="pulse-card p-4">
        <form onSubmit={handleSearchSubmit}>
          <div className="flex gap-2 mb-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('hospital_search_ph')}
                className="w-full pl-9 text-xs h-10"
              />
            </div>
            <button
              type="submit"
              className="bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs px-4 rounded-lg transition"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="sm:hidden border border-slate-200 text-slate-600 text-xs px-3 rounded-lg flex items-center gap-1"
            >
              Filter {filtersOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
          <div className={`grid grid-cols-1 sm:grid-cols-3 gap-2 ${!filtersOpen ? 'hidden sm:grid' : 'grid'}`}>
            <select value={district} onChange={(e) => setDistrict(e.target.value)} className="w-full text-xs h-9">
              <option value="All">{t('all_districts')}</option>
              <option value="Dhaka">Dhaka</option>
              <option value="Chittagong">Chittagong</option>
              <option value="Sylhet">Sylhet</option>
            </select>
            <select value={type} onChange={(e) => setType(e.target.value)} className="w-full text-xs h-9">
              <option value="All">All Types</option>
              <option value="public">Government / Public</option>
              <option value="private">Private</option>
              <option value="specialized">Specialized</option>
            </select>
            <select value={facility} onChange={(e) => setFacility(e.target.value)} className="w-full text-xs h-9">
              <option value="">Any Facilities</option>
              <option value="Oxygen Plant">Oxygen Plant</option>
              <option value="Burn Unit">Burn Unit</option>
              <option value="Dialysis Center">Dialysis Center</option>
              <option value="Trauma Center">Trauma Center</option>
              <option value="Blood Bank">Blood Bank</option>
            </select>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Hospitals List */}
        <div className="lg:col-span-2 space-y-3">
          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton-loader h-36 rounded-2xl" />
              ))}
            </div>
          ) : hospitals.length === 0 ? (
            <div className="pulse-card p-10 text-center">
              <Building2 className="w-10 h-10 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No hospitals matching your filters.</p>
            </div>
          ) : (
            hospitals.map((hosp) => {
              const isSelected = selectedHospital?._id === hosp._id;
              const urgencyBorder = getUrgencyBorder(hosp.beds?.icu);
              return (
                <div
                  key={hosp._id || hosp.id}
                  className={`pulse-card hover-lift p-4 border-2 cursor-pointer transition-all ${
                    isSelected ? 'border-sky-500 ring-2 ring-sky-100 shadow-sky-100/50 shadow-lg' : urgencyBorder
                  }`}
                  onClick={() => setSelectedHospital(hosp)}
                >
                  {/* Hospital header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h2 className="text-sm font-extrabold text-slate-900">{hosp.name}</h2>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{hosp.type}</span>
                        {hosp.surgeTriageActive && (
                          <span className="text-[10px] bg-rose-500 text-white font-bold px-2 py-0.5 rounded-full animate-pulse">SURGE ACTIVE</span>
                        )}
                        {(hosp.beds?.icu?.available ?? 5) <= 2 && (
                          <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> ICU Critical
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        {hosp.address}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleCalculateRoute(hosp); }}
                        className="bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition"
                      >
                        <Navigation className="w-3.5 h-3.5" /> Route
                      </button>
                      <a
                        href={`tel:${hosp.emergencyHotline || hosp.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 no-underline transition"
                      >
                        <PhoneCall className="w-3.5 h-3.5" /> Hotline
                      </a>
                    </div>
                  </div>

                  {/* Bed Occupancy Progress Bars */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <BedBar available={hosp.beds?.general?.available || 0} total={hosp.beds?.general?.total || 0} label="General" />
                    <BedBar available={hosp.beds?.icu?.available || 0} total={hosp.beds?.icu?.total || 0} label="ICU" />
                    <BedBar available={hosp.beds?.ccu?.available || 0} total={hosp.beds?.ccu?.total || 0} label="CCU" />
                    <BedBar available={hosp.beds?.nicu?.available || 0} total={hosp.beds?.nicu?.total || 0} label="NICU" />
                  </div>

                  {/* Facility Tags */}
                  {hosp.facilities?.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                      {hosp.facilities.map((f, idx) => (
                        <span key={idx} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${facilityColors[f] || facilityColors['default']}`}>
                          ✓ {f}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {selectedHospital ? (
            <>
              {/* Route Calculator */}
              <div className="pulse-card p-4 border-t-4 border-t-sky-500">
                <h2 className="font-bold text-sm text-slate-900 flex items-center gap-1.5 mb-3">
                  <Navigation className="w-4 h-4 text-sky-600" /> Dynamic Ambulance Route
                </h2>
                <div className="text-xs text-slate-500 mb-3">
                  Target: <strong className="text-slate-800">{selectedHospital.name}</strong>
                </div>
                <button
                  onClick={() => handleCalculateRoute(selectedHospital)}
                  disabled={routingLoading}
                  className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition disabled:opacity-50"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  {routingLoading ? 'Calculating...' : 'Calculate Live Route & Fare'}
                </button>
                {routeData && (
                  <div className="mt-3 bg-sky-50 p-3 rounded-xl border border-sky-200 text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Distance:</span>
                      <strong className="text-slate-900">{routeData.distanceKm} km</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Ambulance ETA:</span>
                      <strong className="text-sky-700">{routeData.durationMinutes} mins</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Traffic:</span>
                      <span className="font-semibold text-amber-700">{routeData.trafficChokeRisk}</span>
                    </div>
                    <div className="flex justify-between border-t border-sky-200 pt-2">
                      <span className="font-semibold text-slate-700">Fare Cap:</span>
                      <strong className="text-emerald-700">৳ {routeData.estimatedAmbulanceFare} BDT</strong>
                    </div>
                  </div>
                )}
              </div>

              {/* OPD Queue */}
              <div className="pulse-card p-4 border-t-4 border-t-emerald-500">
                <h2 className="font-bold text-sm text-slate-900 flex items-center gap-1.5 mb-3">
                  <Clock className="w-4 h-4 text-emerald-600" /> OPD Queue Simulator
                </h2>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-2 mb-3">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Patients in Queue:</span>
                    <strong className="text-slate-800">{selectedHospital.opdQueue?.currentWaiting || 35}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Active Doctors:</span>
                    <strong className="text-slate-800">{selectedHospital.opdQueue?.activeDoctors || 8}</strong>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-1.5">
                    <span className="font-semibold text-slate-700">Est. Wait:</span>
                    <strong className="text-emerald-700">~{selectedHospital.opdQueue?.avgWaitMinutes || 30} mins</strong>
                  </div>
                </div>
                {selectedHospital.doctorRoster?.length > 0 && (
                  <div>
                    <div className="text-xs font-bold text-slate-700 mb-2">On-Duty Doctors</div>
                    <div className="space-y-1.5">
                      {selectedHospital.doctorRoster.map((doc, idx) => (
                        <div key={idx} className="bg-white p-2 rounded-lg border border-slate-100 text-xs flex justify-between">
                          <div>
                            <div className="font-semibold text-slate-800">{doc.doctorName}</div>
                            <div className="text-[10px] text-slate-400">{doc.specialty} ({doc.roomNo})</div>
                          </div>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-full self-start">{doc.shift}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="pulse-card p-8 text-center">
              <Building2 className="w-8 h-8 text-slate-200 mx-auto mb-2" />
              <p className="text-slate-400 text-xs">Select a hospital to view routing and doctor rosters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HospitalFinder;
