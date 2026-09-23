const mongoose = require('mongoose');

const HealthAlertSchema = new mongoose.Schema({
  title: { type: String, required: true },
  titleBn: { type: String, default: '' },
  severity: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'critical_emergency'], 
    default: 'medium' 
  },
  category: { 
    type: String, 
    enum: ['dengue', 'air_quality', 'heatwave', 'medicine_recall', 'flood_epidemic', 'blood_emergency'], 
    required: true 
  },
  affectedAreas: [{ type: String }],
  description: { type: String, required: true },
  descriptionBn: { type: String, default: '' },
  advisory: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  source: { type: String, default: 'DGHS / MediPulse Telemetry' },
  publishedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('HealthAlert', HealthAlertSchema);
