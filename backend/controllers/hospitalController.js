const Hospital = require('../models/Hospital');
const OperationLog = require('../models/OperationLog');
const { getStore, getIsConnected } = require('../config/db');
const { hospitalsSeed } = require('../services/mockDataService');

// Initialize in-memory hospitals if empty
const store = getStore();
if (store.hospitals.length === 0) {
  store.hospitals = JSON.parse(JSON.stringify(hospitalsSeed));
}

exports.getAllHospitals = async (req, res) => {
  try {
    const { district, facility, type, search } = req.query;

    if (getIsConnected()) {
      let query = {};
      if (district && district !== 'All') query.district = new RegExp(district, 'i');
      if (type && type !== 'All') query.type = type;
      if (facility) query.facilities = facility;
      if (search) {
        query.$or = [
          { name: new RegExp(search, 'i') },
          { banglaName: new RegExp(search, 'i') },
          { address: new RegExp(search, 'i') }
        ];
      }
      const hospitals = await Hospital.find(query);
      return res.json({ success: true, count: hospitals.length, data: hospitals });
    } else {
      let results = [...store.hospitals];
      if (district && district !== 'All') {
        results = results.filter(h => h.district.toLowerCase() === district.toLowerCase());
      }
      if (type && type !== 'All') {
        results = results.filter(h => h.type === type);
      }
      if (facility) {
        results = results.filter(h => h.facilities && h.facilities.includes(facility));
      }
      if (search) {
        const s = search.toLowerCase();
        results = results.filter(h => 
          h.name.toLowerCase().includes(s) || 
          (h.banglaName && h.banglaName.includes(s)) ||
          h.address.toLowerCase().includes(s)
        );
      }
      return res.json({ success: true, count: results.length, data: results });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getHospitalById = async (req, res) => {
  try {
    const { id } = req.params;
    if (getIsConnected()) {
      const hospital = await Hospital.findById(id);
      if (!hospital) return res.status(404).json({ success: false, message: 'Hospital not found' });
      return res.json({ success: true, data: hospital });
    } else {
      const hospital = store.hospitals.find(h => h._id === id || h.id === id);
      if (!hospital) return res.status(404).json({ success: false, message: 'Hospital not found' });
      return res.json({ success: true, data: hospital });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateHospitalBeds = async (req, res) => {
  try {
    const { id } = req.params;
    const { beds } = req.body;
    if (!beds) return res.status(400).json({ success: false, message: 'Bed occupancy data required' });

    if (getIsConnected()) {
      const hospital = await Hospital.findById(id);
      if (!hospital) return res.status(404).json({ success: false, message: 'Hospital not found' });

      hospital.beds = { ...hospital.beds, ...beds };
      hospital.lastUpdated = new Date();
      await hospital.save();

      await OperationLog.create({
        action: 'UPDATE_BED_OCCUPANCY',
        performedBy: req.user ? req.user.name : 'Hospital Authority',
        role: req.user ? req.user.role : 'hospital',
        targetEntity: hospital.name,
        details: { beds }
      });

      return res.json({ success: true, message: 'Beds updated successfully', data: hospital });
    } else {
      const hospital = store.hospitals.find(h => h._id === id || h.id === id);
      if (!hospital) return res.status(404).json({ success: false, message: 'Hospital not found' });

      hospital.beds = { ...hospital.beds, ...beds };
      hospital.lastUpdated = new Date();

      store.operationLogs.push({
        action: 'UPDATE_BED_OCCUPANCY',
        performedBy: req.user ? req.user.name : 'Hospital Authority',
        role: req.user ? req.user.role : 'hospital',
        targetEntity: hospital.name,
        details: { beds },
        timestamp: new Date()
      });

      return res.json({ success: true, message: 'Beds updated successfully', data: hospital });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.toggleSurgeMode = async (req, res) => {
  try {
    const { id } = req.params;
    const { active } = req.body;

    if (getIsConnected()) {
      const hospital = await Hospital.findById(id);
      if (!hospital) return res.status(404).json({ success: false, message: 'Hospital not found' });
      hospital.surgeTriageActive = active !== undefined ? active : !hospital.surgeTriageActive;
      await hospital.save();

      await OperationLog.create({
        action: 'TOGGLE_SURGE_TRIAGE',
        performedBy: req.user ? req.user.name : 'Hospital Authority',
        role: req.user ? req.user.role : 'hospital',
        targetEntity: hospital.name,
        details: { surgeTriageActive: hospital.surgeTriageActive }
      });

      return res.json({ success: true, message: 'Surge Triage Mode toggled', data: hospital });
    } else {
      const hospital = store.hospitals.find(h => h._id === id || h.id === id);
      if (!hospital) return res.status(404).json({ success: false, message: 'Hospital not found' });
      hospital.surgeTriageActive = active !== undefined ? active : !hospital.surgeTriageActive;

      store.operationLogs.push({
        action: 'TOGGLE_SURGE_TRIAGE',
        performedBy: req.user ? req.user.name : 'Hospital Authority',
        role: req.user ? req.user.role : 'hospital',
        targetEntity: hospital.name,
        details: { surgeTriageActive: hospital.surgeTriageActive },
        timestamp: new Date()
      });

      return res.json({ success: true, message: 'Surge Triage Mode toggled', data: hospital });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
