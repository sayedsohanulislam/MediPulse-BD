const mongoose = require('mongoose');

const IncidentReportSchema = new mongoose.Schema({
  reporterName: { type: String, default: 'Anonymous Citizen' },
  reporterPhone: { type: String, default: '' },
  type: { 
    type: String, 
    enum: ['fake_medicine', 'price_gouging', 'bed_refusal', 'emergency_road_block', 'other'], 
    required: true 
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: {
    district: { type: String, required: true },
    areaOrHospital: { type: String, required: true },
    lat: { type: Number, default: 23.8103 },
    lng: { type: Number, default: 90.4125 }
  },
  medicineBatchNo: { type: String, default: '' },
  pharmacyOrClinic: { type: String, default: '' },
  priceCharged: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['pending', 'investigating', 'verified_action_taken', 'rejected'], 
    default: 'pending' 
  },
  authorityNotes: { type: String, default: '' },
  reportedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('IncidentReport', IncidentReportSchema);
