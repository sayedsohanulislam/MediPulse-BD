import React, { useState, useEffect } from 'react';
import { 
  Building2, Search, MapPin, PhoneCall, Bed, Navigation, 
  Clock, ShieldAlert, CheckCircle, Activity, User, AlertCircle 
} from 'lucide-react';
import { hospitalApi, healthApi } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const HospitalFinder = () => {
  const { t, lang } = useLanguage();
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [district, setDistrict] = useState('All');
  const [type, setType] = useState('All');
  const [facility, setFacility] = useState('');

  // Selected hospital for route calculation & OPD queue
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [userLocation, setUserLocation] = useState({ lat: 23.8103, lng: 90.4125 }); // Default Farmgate/Dhaka
  const [routeData, setRouteData] = useState(null);
  const [routingLoading, setRoutingLoading] = useState(false);

  useEffect(() => {
    fetchHospitals();
  }, [district, type, facility]);

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
        if (res.data.data.length > 0 && !selectedHospital) {
          setSelectedHospital(res.data.data[0]);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch hospitals:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchHospitals();
  };

  const handleCalculateRoute = async (hosp) => {
    setSelectedHospital(hosp);
    setRoutingLoading(true);
    setRouteData(null);
    try {
      const res = await healthApi.calculateRoute({
        originLat: userLocation.lat,
        originLng: userLocation.lng,
        destLat: hosp.coordinates.lat,
        destLng: hosp.coordinates.lng
      });
      if (res.data.success) {
        setRouteData(res.data.data);
      }
    } catch (err) {
      console.warn('Route calculation error:', err.message);
    } finally {
      setRoutingLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Building2 className="w-6 h-6 text-sky-600" />
          <span>Hospital & ICU Capacity Directory</span>
        </h1>
        <p className="text-xs text-slate-500">
          Live verified bed occupancy, OSRM dynamic emergency ambulance routing, and OPD queue estimators across Bangladesh
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="pulse-card p-4">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('hospital_search_ph')}
              className="w-full pl-9 text-xs"
            />
          </div>

          <div>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full text-xs"
            >
              <option value="All">{t('all_districts')}</option>
              <option value="Dhaka">Dhaka</option>
              <option value="Chittagong">Chittagong</option>
              <option value="Sylhet">Sylhet</option>
            </select>
          </div>

          <div>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full text-xs"
            >
              <option value="All">All Hospital Types</option>
              <option value="public">Government / Public</option>
              <option value="private">Private Hospitals</option>
              <option value="specialized">Specialized Institutes</option>
            </select>
          </div>

          <div>
            <select
              value={facility}
              onChange={(e) => setFacility(e.target.value)}
              className="w-full text-xs"
            >
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hospitals List */}
        <div className="lg:col-span-2 space-y-3.5">
          {loading ? (
            <div className="text-center py-12 text-slate-400 text-xs">Loading hospital telemetry...</div>
          ) : hospitals.length === 0 ? (
            <div className="pulse-card p-8 text-center text-slate-500 text-xs">
              No hospitals matching the selected filters. Try broadening your criteria.
            </div>
          ) : (
            hospitals.map((hosp) => (
              <div 
                key={hosp._id || hosp.id}
                className={`pulse-card p-4 transition cursor-pointer border ${
                  selectedHospital?._id === hosp._id ? 'border-sky-500 ring-2 ring-sky-100' : 'border-slate-200'
                }`}
                onClick={() => setSelectedHospital(hosp)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-bold text-slate-900">{hosp.name}</h2>
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                        {hosp.type}
                      </span>
                      {hosp.surgeTriageActive && (
                        <span className="text-[10px] bg-rose-500 text-white font-bold px-1.5 py-0.5 rounded animate-pulse">
                          Surge Active
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{hosp.address}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCalculateRoute(hosp);
                      }}
                      className="bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Route</span>
                    </button>

                    <a
                      href={`tel:${hosp.emergencyHotline || hosp.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 text-decoration-none"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Hotline</span>
                    </a>
                  </div>
                </div>

                {/* Bed Availability Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs mt-3">
                  <div>
                    <span className="text-[10px] text-slate-500 block">General Ward:</span>
                    <strong className="text-slate-800 text-sm">
                      {hosp.beds?.general?.available || 0}
                    </strong>
                    <span className="text-[10px] text-slate-400"> / {hosp.beds?.general?.total || 0}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 block">ICU Beds:</span>
                    <strong className="text-rose-600 text-sm">
                      {hosp.beds?.icu?.available || 0}
                    </strong>
                    <span className="text-[10px] text-slate-400"> / {hosp.beds?.icu?.total || 0}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 block">CCU Beds:</span>
                    <strong className="text-amber-600 text-sm">
                      {hosp.beds?.ccu?.available || 0}
                    </strong>
                    <span className="text-[10px] text-slate-400"> / {hosp.beds?.ccu?.total || 0}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 block">NICU Beds:</span>
                    <strong className="text-purple-600 text-sm">
                      {hosp.beds?.nicu?.available || 0}
                    </strong>
                    <span className="text-[10px] text-slate-400"> / {hosp.beds?.nicu?.total || 0}</span>
                  </div>
                </div>

                {/* Facility Tags */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                  {hosp.facilities?.map((f, idx) => (
                    <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                      ✓ {f}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Selected Hospital Sidebar: OSRM Dynamic Routing & OPD Queue */}
        <div className="space-y-4">
          {selectedHospital ? (
            <>
              {/* OSRM Route Box */}
              <div className="pulse-card p-4 border-t-4 border-t-sky-500">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                    <Navigation className="w-4 h-4 text-sky-600" />
                    <span>Dynamic Ambulance Navigation</span>
                  </h2>
                </div>

                <div className="text-xs text-slate-600 mb-3">
                  Target: <strong>{selectedHospital.name}</strong>
                </div>

                <button
                  onClick={() => handleCalculateRoute(selectedHospital)}
                  disabled={routingLoading}
                  className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 rounded-lg text-xs shadow-sm flex items-center justify-center gap-1.5 transition disabled:opacity-50"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{routingLoading ? 'Calculating OSRM Telemetry...' : 'Calculate Live Route & Fare'}</span>
                </button>

                {routeData && (
                  <div className="mt-3 bg-sky-50 p-3 rounded-xl border border-sky-200 text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Road Distance:</span>
                      <strong className="text-slate-900">{routeData.distanceKm} km</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Ambulance ETA:</span>
                      <strong className="text-sky-700">{routeData.durationMinutes} mins</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Traffic Congestion:</span>
                      <span className="font-semibold text-amber-700">{routeData.trafficChokeRisk}</span>
                    </div>
                    <div className="flex justify-between border-t border-sky-200 pt-2">
                      <span className="text-slate-700 font-semibold">Standard Fare Cap:</span>
                      <strong className="text-emerald-700 font-bold">৳ {routeData.estimatedAmbulanceFare} BDT</strong>
                    </div>
                  </div>
                )}
              </div>

              {/* OPD Queue Wait Estimator */}
              <div className="pulse-card p-4 border-t-4 border-t-emerald-500">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span>OPD Queue Waiting Simulator</span>
                  </h2>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-2 mb-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Patients in Queue:</span>
                    <strong className="text-slate-900">{selectedHospital.opdQueue?.currentWaiting || 35}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Active Duty Doctors:</span>
                    <strong className="text-slate-900">{selectedHospital.opdQueue?.activeDoctors || 8}</strong>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-1.5">
                    <span className="text-slate-700 font-semibold">Est. Wait to see Doctor:</span>
                    <strong className="text-emerald-700 font-bold">~{selectedHospital.opdQueue?.avgWaitMinutes || 30} mins</strong>
                  </div>
                </div>

                {/* Doctor Duty Roster */}
                <div className="font-bold text-xs text-slate-800 mb-2">Live On-Duty Doctors:</div>
                <div className="space-y-1.5">
                  {selectedHospital.doctorRoster?.map((doc, idx) => (
                    <div key={idx} className="bg-white p-2 rounded-lg border border-slate-200 text-xs flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-slate-800 text-[11px]">{doc.doctorName}</div>
                        <div className="text-[10px] text-slate-500">{doc.specialty} ({doc.roomNo})</div>
                      </div>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                        {doc.shift}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="pulse-card p-6 text-center text-slate-400 text-xs">
              Select a hospital from the list to view live routing and doctor rosters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HospitalFinder;
