import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { Building2, Heart, ShieldAlert, Wind, Thermometer, Layers, Filter } from 'lucide-react';
import { hospitalApi, bloodApi } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { useTelemetry } from '../context/TelemetryContext';

// Fix Leaflet Default Icon issue in React/Vite
const hospitalIcon = new L.DivIcon({
  className: 'custom-hosp-icon',
  html: `<div style="background-color: #0284c7; color: white; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">🏥</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});

const donorIcon = new L.DivIcon({
  className: 'custom-donor-icon',
  html: `<div style="background-color: #e11d48; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">🩸</div>`,
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

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
            {t('nav_live_grid')} (GIS Command Map)
          </h1>
          <p className="text-xs text-slate-500">
            Interactive real-time map displaying hospitals, available ICU beds, blood donors, and vector hazard clusters
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowHospitals(!showHospitals)}
            className={`text-xs px-3 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition ${
              showHospitals ? 'bg-sky-50 border-sky-300 text-sky-700' : 'bg-white border-slate-200 text-slate-400'
            }`}
          >
            <span>🏥 Hospitals ({filteredHospitals.length})</span>
          </button>

          <button
            onClick={() => setShowDonors(!showDonors)}
            className={`text-xs px-3 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition ${
              showDonors ? 'bg-rose-50 border-rose-300 text-rose-700' : 'bg-white border-slate-200 text-slate-400'
            }`}
          >
            <span>🩸 Donors ({donors.length})</span>
          </button>

          <button
            onClick={() => setShowDengue(!showDengue)}
            className={`text-xs px-3 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition ${
              showDengue ? 'bg-amber-50 border-amber-300 text-amber-700' : 'bg-white border-slate-200 text-slate-400'
            }`}
          >
            <span>🦟 Dengue Hotspots</span>
          </button>

          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="text-xs py-1.5"
          >
            <option value="All">All Districts</option>
            <option value="Dhaka">Dhaka</option>
            <option value="Chittagong">Chittagong</option>
            <option value="Sylhet">Sylhet</option>
          </select>
        </div>
      </div>

      {/* Map Canvas */}
      <div className="pulse-card overflow-hidden h-[540px] relative border border-slate-300 shadow-md">
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
                    <div className="text-slate-500 mb-2">{hosp.address}</div>
                    
                    <div className="grid grid-cols-2 gap-1.5 bg-slate-50 p-2 rounded border border-slate-200 mb-2">
                      <div>
                        <div className="text-[10px] text-slate-500">ICU Available:</div>
                        <div className="font-extrabold text-rose-600 text-sm">
                          {hosp.beds?.icu?.available || 0} / {hosp.beds?.icu?.total || 0}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500">General Beds:</div>
                        <div className="font-bold text-slate-800 text-sm">
                          {hosp.beds?.general?.available || 0} / {hosp.beds?.general?.total || 0}
                        </div>
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-500 mb-2">
                      📞 Hotline: <strong>{hosp.emergencyHotline || hosp.phone}</strong>
                    </div>

                    <a
                      href={`tel:${hosp.emergencyHotline || hosp.phone}`}
                      className="block text-center bg-sky-600 hover:bg-sky-700 text-white font-bold py-1 px-2 rounded text-[11px] text-decoration-none"
                    >
                      Call Emergency Admission
                    </a>
                  </div>
                </Popup>
              </Marker>
            )
          ))}

          {/* Blood Donors (Simulated coordinates in district) */}
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
                  <div className="text-emerald-600 font-semibold text-[11px] mb-2">
                    ✓ Available for Emergency Call
                  </div>
                  <a
                    href={`tel:${don.phone}`}
                    className="block text-center bg-rose-600 hover:bg-rose-700 text-white font-bold py-1 px-2 rounded text-[11px] text-decoration-none"
                  >
                    Call Donor: {don.phone}
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Dengue Risk Cluster Hazard Rings */}
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
                  <div className="text-slate-600 mb-1">Vector Density Score: <strong>{cluster.score}/100</strong></div>
                  <div className="text-[10px] text-slate-500">
                    High Aedes mosquito infestation reported. Nearby clinics stocked with IV saline.
                  </div>
                </div>
              </Popup>
            </Circle>
          ))}
        </MapContainer>

        {/* Floating Map Legend */}
        <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur-sm p-3 rounded-xl border border-slate-200 shadow-lg text-xs space-y-1.5">
          <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-1">Live Map Legend</div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-sky-600"></span>
            <span>Hospital with Live ICU status</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-600"></span>
            <span>Verified Ready Blood Donor</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-400 border border-dashed border-rose-600"></span>
            <span>Dengue Outbreak Hotspot Zone</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveHealthGrid;
