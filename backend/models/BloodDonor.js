const mongoose = require('mongoose');

const BloodDonorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  bloodGroup: { 
    type: String, 
    required: true, 
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] 
  },
  district: { type: String, required: true },
  upazila: { type: String, default: '' },
  lastDonationDate: { type: Date, default: null },
  isAvailable: { type: Boolean, default: true },
  donationCount: { type: Number, default: 0 },
  heroBadge: { 
    type: String, 
    enum: ['Bronze', 'Silver', 'Gold', 'LifeSaver Champion'], 
    default: 'Bronze' 
  },
  registeredAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BloodDonor', BloodDonorSchema);
