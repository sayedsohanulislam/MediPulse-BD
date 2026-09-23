const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['citizen', 'donor', 'hospital', 'admin'], 
    default: 'citizen' 
  },
  phone: { type: String, default: '' },
  bloodGroup: { type: String, default: '' },
  district: { type: String, default: 'Dhaka' },
  organization: { type: String, default: '' }, // For hospital staff
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
