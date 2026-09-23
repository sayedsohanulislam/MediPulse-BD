const mongoose = require('mongoose');

const MedicineSchema = new mongoose.Schema({
  brandName: { type: String, required: true },
  genericName: { type: String, required: true },
  strength: { type: String, required: true },
  dosageForm: { type: String, default: 'Tablet' }, // Tablet, Syrup, Injection, Capsule
  manufacturer: { type: String, required: true },
  dgdaMaxPrice: { type: Number, required: true }, // Official price cap in BDT
  marketPrice: { type: Number, required: true },
  therapeuticClass: { type: String, default: 'General' },
  isBannedOrRecalled: { type: Boolean, default: false },
  recallReason: { type: String, default: '' },
  cheaperGenerics: [{
    brandName: String,
    manufacturer: String,
    price: Number,
    savingsPercent: Number
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Medicine', MedicineSchema);
