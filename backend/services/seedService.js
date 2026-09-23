const mongoose = require('mongoose');
const Hospital = require('../models/Hospital');
const BloodDonor = require('../models/BloodDonor');
const Medicine = require('../models/Medicine');
const HealthAlert = require('../models/HealthAlert');
const { 
  hospitalsSeed, 
  donorsSeed, 
  medicinesSeed, 
  healthAlertsSeed 
} = require('./mockDataService');

const seedDatabaseIfEmpty = async () => {
  try {
    const hospCount = await Hospital.countDocuments();
    if (hospCount === 0) {
      console.log('[MediPulse BD] Seeding initial hospitals into MongoDB...');
      const cleanHospitals = hospitalsSeed.map(h => {
        const copy = { ...h };
        delete copy._id;
        return copy;
      });
      await Hospital.insertMany(cleanHospitals);
      console.log(`[MediPulse BD] Seeded ${cleanHospitals.length} hospitals.`);
    }

    const donorCount = await BloodDonor.countDocuments();
    if (donorCount === 0) {
      console.log('[MediPulse BD] Seeding initial donors into MongoDB...');
      const cleanDonors = donorsSeed.map(d => {
        const copy = { ...d };
        delete copy._id;
        return copy;
      });
      await BloodDonor.insertMany(cleanDonors);
      console.log(`[MediPulse BD] Seeded ${cleanDonors.length} donors.`);
    }

    const medCount = await Medicine.countDocuments();
    if (medCount === 0) {
      console.log('[MediPulse BD] Seeding initial medicines into MongoDB...');
      const cleanMeds = medicinesSeed.map(m => {
        const copy = { ...m };
        delete copy._id;
        return copy;
      });
      await Medicine.insertMany(cleanMeds);
      console.log(`[MediPulse BD] Seeded ${cleanMeds.length} medicines.`);
    }

    const alertCount = await HealthAlert.countDocuments();
    if (alertCount === 0) {
      console.log('[MediPulse BD] Seeding initial alerts into MongoDB...');
      const cleanAlerts = healthAlertsSeed.map(a => {
        const copy = { ...a };
        delete copy._id;
        return copy;
      });
      await HealthAlert.insertMany(cleanAlerts);
      console.log(`[MediPulse BD] Seeded ${cleanAlerts.length} alerts.`);
    }
  } catch (err) {
    console.error('[MediPulse BD] Seeding error:', err.message);
  }
};

module.exports = { seedDatabaseIfEmpty };
