import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { Building2, Heart, ShieldAlert, Wind, Thermometer, Layers } from 'lucide-react';
import { hospitalApi, bloodApi } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { useTelemetry } from '../context/TelemetryContext';

// Fix Leaflet Default Icon issue in React/Vite
const hospitalIcon = new L.DivIcon({
  className: 'custom-hosp-icon',
  html: `<div style="background-color:#0284c7;color:white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-weight:bold;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);">🏥</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});

const donorIcon = new L.DivIcon({
  className: 'custom-donor-icon',
  html: `<div style="background-color:#e11d48;color:white;border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:bold;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);">🩸</div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

const dengueClusters = [
  { name: 'Dhaka South Hotspot (Babubazar/Old Dhaka)', lat: 23.7150, lng: 90.4020, radius: 1800, score: 88 },
  { name: 'Dhaka North Hotspot (Mirpur/Pallabi)', lat: 23.8150, lng: 90.3650, radius: 2200, score: 85 },
  { name: 'Mugda-Khilgaon Corridor', lat: 23.7320, lng: 90.4350, radius: 1500, score: 92 },
  { name: 'Chittagong Panchlaish Cluster', lat: 22.3650, lng: 91.8250, radius: 1400, score: 72 }
];

const LiveHealthGrid = () => {
  const { t, lang } = useLanguage();
  const { telemetry } = useTelemetry();
  const [hospitals, setHospitals] = useState([]);
  const [donors, setDonors] = useState([]);
  const [showHospitals, setShowHospitals] = useState(true);
  const [showDonors, setShowDonors] = useState(true);
  const [showDengue, setShowDengue] = useState(true);
  const [selectedDistrict, setSelectedDistrict] = useState('All');

  useEffect(() => {
    hospitalApi.getAll().then(res => {
      if (res.data.success) setHospitals(res.data.data);
    }).catch(() => {});

    bloodApi.searchDonors().then(res => {
      if (res.data.success) setDonors(res.data.data);
    }).catch(() => {});
  }, []);

  const filteredHospitals = selectedDistrict === 'All'
    ? hospitals
    : hospitals.filter(h => h.district.toLowerCase() === selectedDistrict.toLowerCase());

  const aqi = telemetry?.airQuality?.usAqi || '--';

  return (
    <div className="space-y-4 page-container">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative rounded-full h-3 w-3 bg-emerald-500" />
            </span>
          </div>
          {t('nav_live_grid')} — GIS Command Map
        </h1>
        <p className="text-xs text-slate-400 mt-1 ml-11">
          Real-time map: hospital ICU beds, blood donors, and dengue vector hotspots across Bangladesh
        </p>
      </div>

      {/* Live Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Hospitals on Map', value: filteredHospitals.length, color: 'text-sky-600', bg: 'bg-sky-50 border-sky-200', icon: '🏥' },
          { label: 'Blood Donors', value: donors.length, color: 'text-rose-600', bg: 'bg-rose-50 border-rose-200', icon: '🩸' },
          { label: 'Dengue Hotspots', value: dengueClusters.length, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200', icon: '🦟' },
          { label: 'Dhaka AQI', value: aqi, color: 'text-violet-600', bg: 'bg-violet-50 border-violet-200', icon: '💨' },
        ].map((stat, idx) => (
          <div key={idx} className={`pulse-card hover-lift p-3 border ${stat.bg} flex items-center gap-3`}>
            <span className="text-2xl">{stat.icon}</span>
            <div>
              <div className={`text-xl font-extrabold ${stat.color}`}>{stat.value}</div>
              <div className="text-[10px] text-slate-500">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Controls */}
      <div className="pulse-card p-3 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-500 mr-1">Toggle Layers:</span>

        <button
          onClick={() => setShowHospitals(!showHospitals)}
          className={`text-xs px-3 py-1.5 rounded-full border font-semibold transition-all ${
            showHospitals
              ? 'bg-sky-600 border-sky-600 text-white shadow-sm'
              : 'bg-white border-slate-200 text-slate-400 hover:border-sky-300'
          }`}
        >
          🏥 Hospitals ({filteredHospitals.length})
        </button>

        <button
          onClick={() => setShowDonors(!showDonors)}
          className={`text-xs px-3 py-1.5 rounded-full border font-semibold transition-all ${
            showDonors
              ? 'bg-rose-600 border-rose-600 text-white shadow-sm'
              : 'bg-white border-slate-200 text-slate-400 hover:border-rose-300'
          }`}
        >
          🩸 Donors ({donors.length})
        </button>

        <button
          onClick={() => setShowDengue(!showDengue)}
          className={`text-xs px-3 py-1.5 rounded-full border font-semibold transition-all ${
            showDengue
              ? 'bg-amber-500 border-amber-500 text-white shadow-sm'
              : 'bg-white border-slate-200 text-slate-400 hover:border-amber-300'
          }`}
        >
          🦟 Dengue Zones
        </button>

        <div className="ml-auto">
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="text-xs py-1.5 border border-slate-200 rounded-full"
          >
            <option value="All">All Districts</option>
            <option value="Dhaka">Dhaka</option>
            <option value="Chittagong">Chittagong</option>
            <option value="Sylhet">Sylhet</option>
          </select>
        </div>
      </div>

      {/* Map Canvas */}
      <div className="pulse-card overflow-hidden relative border border-slate-200 shadow-md" style={{ height: '560px', borderRadius: '16px' }}>
        <MapContainer
          center={[23.76, 90.39]}
          zoom={12}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Hospitals */}
          {showHospitals && filteredHospitals.map((hosp) => (
            hosp.coordinates && (
              <Marker
                key={hosp._id || hosp.id}
                position={[hosp.coordinates.lat, hosp.coordinates.lng]}
                icon={hospitalIcon}
              >
                <Popup>
                  <div className="text-xs p-1 max-w-[220px]">
                    <div className="font-bold text-slate-900 text-sm mb-1">{hosp.name}</div>
                    <div className="text-slate-500 text-[11px] mb-2">{hosp.address}</div>
                    <div className="grid grid-cols-2 gap-1.5 bg-slate-50 p-2 rounded border border-slate-200 mb-2">
                      <div>
                        <div className="text-[10px] text-slate-500">ICU Available:</div>
                        <div className="font-extrabold text-rose-600 text-sm">
                          {hosp.beds?.icu?.available || 0} / {hosp.beds?.icu?.total || 0}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500">General:</div>
                        <div className="font-bold text-slate-800 text-sm">
                          {hosp.beds?.general?.available || 0} / {hosp.beds?.general?.total || 0}
                        </div>
                      </div>
                    </div>
                    <a
                      href={`tel:${hosp.emergencyHotline || hosp.phone}`}
                      className="block text-center bg-sky-600 hover:bg-sky-700 text-white font-bold py-1.5 px-2 rounded-lg text-[11px] no-underline"
                    >
                      📞 Call Emergency Admission
                    </a>
                  </div>
                </Popup>
              </Marker>
            )
          ))}

          {/* Blood Donors */}
          {showDonors && donors.map((don, idx) => (
            <Marker
              key={don._id || idx}
              position={[
                23.73 + (Math.sin(idx * 2) * 0.06),
                90.39 + (Math.cos(idx * 2) * 0.05)
              ]}
              icon={donorIcon}
            >
              <Popup>
                <div className="text-xs p-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="bg-rose-600 text-white font-bold px-1.5 py-0.5 rounded text-[10px]">
                      {don.bloodGroup}
                    </span>
                    <strong className="text-slate-900">{don.name}</strong>
                  </div>
                  <div className="text-slate-500 text-[11px] mb-1">
                    📍 {don.upazila ? `${don.upazila}, ` : ''}{don.district}
                  </div>
                  <div className="text-emerald-600 font-semibold text-[11px] mb-2">✓ Available for Emergency Call</div>
                  <a
                    href={`tel:${don.phone}`}
                    className="block text-center bg-rose-600 hover:bg-rose-700 text-white font-bold py-1.5 px-2 rounded-lg text-[11px] no-underline"
                  >
                    Call Donor: {don.phone}
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Dengue Risk Cluster Rings */}
          {showDengue && dengueClusters.map((cluster, idx) => (
            <Circle
              key={idx}
              center={[cluster.lat, cluster.lng]}
              radius={cluster.radius}
              pathOptions={{
                color: '#e11d48',
                fillColor: '#f43f5e',
                fillOpacity: 0.18,
                weight: 1.5,
                dashArray: '4, 4'
              }}
            >
              <Popup>
                <div className="text-xs p-1">
                  <div className="font-bold text-rose-600 mb-1">🦟 {cluster.name}</div>
                  <div className="text-slate-600 mb-1">Vector Score: <strong>{cluster.score}/100</strong></div>
                  <div className="text-[10px] text-slate-500">
                    High Aedes infestation. Nearby clinics stocked with IV saline.
                  </div>
                </div>
              </Popup>
            </Circle>
          ))}
        </MapContainer>

        {/* Floating Map Legend */}
        <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur-sm p-3 rounded-xl border border-slate-200 shadow-lg text-xs space-y-1.5">
          <div className="font-bold text-slate-700 text-[11px] uppercase tracking-wider mb-2">Map Legend</div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-sky-600 flex-shrink-0" />
            <span className="text-slate-600">Hospital with Live ICU</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-600 flex-shrink-0" />
            <span className="text-slate-600">Verified Blood Donor</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-300 border border-dashed border-rose-500 flex-shrink-0" />
            <span className="text-slate-600">Dengue Outbreak Zone</span>
          </div>
        </div>

        {/* Floating Live Indicator */}
        <div className="absolute top-4 right-4 z-[400] bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full border border-emerald-200 shadow-sm text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Live Data
        </div>
      </div>
    </div>
  );
};

export default LiveHealthGrid;
