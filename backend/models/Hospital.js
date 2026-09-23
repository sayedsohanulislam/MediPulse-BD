const mongoose = require('mongoose');

const HospitalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  banglaName: { type: String, default: '' },
  type: { type: String, enum: ['public', 'private', 'specialized', 'clinic'], default: 'public' },
  district: { type: String, required: true },
  upazila: { type: String, default: '' },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  emergencyHotline: { type: String, default: '' },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  beds: {
    general: { total: Number, available: Number },
    icu: { total: Number, available: Number },
    ccu: { total: Number, available: Number },
    nicu: { total: Number, available: Number }
  },
  facilities: [{ type: String }], // 'Oxygen Plant', 'Burn Unit', 'Dialysis', 'Trauma Center'
  opdQueue: {
    currentWaiting: { type: Number, default: 0 },
    avgWaitMinutes: { type: Number, default: 45 },
    activeDoctors: { type: Number, default: 5 }
  },
  doctorRoster: [{
    doctorName: String,
    specialty: String,
    shift: { type: String, enum: ['Morning', 'Evening', 'Night'] },
    roomNo: String,
    available: { type: Boolean, default: true }
  }],
  surgeTriageActive: { type: Boolean, default: false },
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Hospital', HospitalSchema);
