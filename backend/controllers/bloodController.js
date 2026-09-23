const BloodDonor = require('../models/BloodDonor');
const { getStore, getIsConnected } = require('../config/db');
const { donorsSeed } = require('../services/mockDataService');

const store = getStore();
if (store.donors.length === 0) {
  store.donors = JSON.parse(JSON.stringify(donorsSeed));
}

let activeSosBroadcasts = [
  {
    id: 'sos-001',
    patientName: 'Khadija Begum (Postpartum Hemorrhage)',
    bloodGroup: 'O-',
    unitsRequired: 2,
    hospitalName: 'Dhaka Medical College Hospital',
    contactPhone: '01711-234567',
    urgency: 'IMMEDIATE_LIFE_CRITICAL',
    timeRemainingMins: 35,
    timestamp: new Date()
  },
  {
    id: 'sos-002',
    patientName: 'Tanvir Hossain (Dengue Platelet Shock)',
    bloodGroup: 'A+',
    unitsRequired: 3,
    hospitalName: 'Mugda Medical College Hospital',
    contactPhone: '01819-334455',
    urgency: 'HIGH',
    timeRemainingMins: 90,
    timestamp: new Date()
  }
];

exports.searchDonors = async (req, res) => {
  try {
    const { bloodGroup, district, upazila } = req.query;

    if (getIsConnected()) {
      let query = { isAvailable: true };
      if (bloodGroup && bloodGroup !== 'All') query.bloodGroup = bloodGroup;
      if (district && district !== 'All') query.district = new RegExp(district, 'i');
      if (upazila) query.upazila = new RegExp(upazila, 'i');

      const donors = await BloodDonor.find(query);
      return res.json({ success: true, count: donors.length, data: donors });
    } else {
      let results = store.donors.filter(d => d.isAvailable);
      if (bloodGroup && bloodGroup !== 'All') {
        results = results.filter(d => d.bloodGroup === bloodGroup);
      }
      if (district && district !== 'All') {
        results = results.filter(d => d.district.toLowerCase() === district.toLowerCase());
      }
      if (upazila) {
        results = results.filter(d => d.upazila && d.upazila.toLowerCase().includes(upazila.toLowerCase()));
      }
      return res.json({ success: true, count: results.length, data: results });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.registerDonor = async (req, res) => {
  try {
    const { name, phone, bloodGroup, district, upazila } = req.body;
    if (!name || !phone || !bloodGroup || !district) {
      return res.status(400).json({ success: false, message: 'Name, phone, blood group, and district required' });
    }

    if (getIsConnected()) {
      const newDonor = await BloodDonor.create({
        name, phone, bloodGroup, district, upazila: upazila || '', isAvailable: true
      });
      return res.status(201).json({ success: true, message: 'Registered as blood donor!', data: newDonor });
    } else {
      const newDonor = {
        _id: 'don-' + Date.now(),
        name, phone, bloodGroup, district, upazila: upazila || '',
        isAvailable: true, donationCount: 0, heroBadge: 'Bronze'
      };
      store.donors.push(newDonor);
      return res.status(201).json({ success: true, message: 'Registered as blood donor!', data: newDonor });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.triggerUrgentSos = (req, res) => {
  try {
    const { patientName, bloodGroup, unitsRequired, hospitalName, contactPhone, urgency } = req.body;
    if (!patientName || !bloodGroup || !hospitalName || !contactPhone) {
      return res.status(400).json({ success: false, message: 'Patient details, blood group, hospital, and contact required' });
    }

    const newSos = {
      id: 'sos-' + Date.now(),
      patientName,
      bloodGroup,
      unitsRequired: Number(unitsRequired) || 1,
      hospitalName,
      contactPhone,
      urgency: urgency || 'HIGH',
      timeRemainingMins: 120,
      timestamp: new Date()
    };

    activeSosBroadcasts.unshift(newSos);

    return res.status(201).json({
      success: true,
      message: `Emergency SOS Broadcast Activated for ${bloodGroup}! SMS notifications queued for local donors.`,
      data: newSos
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getActiveSos = (req, res) => {
  return res.json({ success: true, count: activeSosBroadcasts.length, data: activeSosBroadcasts });
};

exports.calculateNextEligibleDate = (req, res) => {
  const { lastDonationDate } = req.body;
  if (!lastDonationDate) {
    return res.status(400).json({ success: false, message: 'Last donation date required' });
  }

  const lastDate = new Date(lastDonationDate);
  const nextEligible = new Date(lastDate);
  nextEligible.setDate(nextEligible.getDate() + 90); // 90 days standard in BD

  const today = new Date();
  const diffDays = Math.ceil((nextEligible - today) / (1000 * 60 * 60 * 24));
  const isEligibleNow = diffDays <= 0;

  return res.json({
    success: true,
    lastDonationDate: lastDate.toISOString().split('T')[0],
    nextEligibleDate: nextEligible.toISOString().split('T')[0],
    daysRemaining: isEligibleNow ? 0 : diffDays,
    isEligibleNow,
    guidance: isEligibleNow 
      ? 'You are healthy and eligible to donate blood today!' 
      : `Please wait ${diffDays} more days for safe hemoglobin recovery.`
  });
};
