const HealthAlert = require('../models/HealthAlert');
const OperationLog = require('../models/OperationLog');
const { getStore, getIsConnected } = require('../config/db');
const { healthAlertsSeed, speedDialContacts, epiVaccineSchedule } = require('../services/mockDataService');

const store = getStore();
if (store.alerts.length === 0) {
  store.alerts = JSON.parse(JSON.stringify(healthAlertsSeed));
}

exports.getHealthAlerts = async (req, res) => {
  try {
    const { category, severity } = req.query;

    if (getIsConnected()) {
      let query = { isActive: true };
      if (category && category !== 'All') query.category = category;
      if (severity && severity !== 'All') query.severity = severity;
      const alerts = await HealthAlert.find(query).sort({ publishedAt: -1 });
      return res.json({ success: true, count: alerts.length, data: alerts });
    } else {
      let results = store.alerts.filter(a => a.isActive);
      if (category && category !== 'All') results = results.filter(a => a.category === category);
      if (severity && severity !== 'All') results = results.filter(a => a.severity === severity);
      return res.json({ success: true, count: results.length, data: results });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.publishAlert = async (req, res) => {
  try {
    const { title, titleBn, severity, category, affectedAreas, description, descriptionBn, advisory } = req.body;
    if (!title || !severity || !category || !description) {
      return res.status(400).json({ success: false, message: 'Title, severity, category, and description required' });
    }

    const payload = {
      title,
      titleBn: titleBn || '',
      severity,
      category,
      affectedAreas: Array.isArray(affectedAreas) ? affectedAreas : ['Nationwide'],
      description,
      descriptionBn: descriptionBn || '',
      advisory: advisory || 'Follow official DGHS guidelines.',
      isActive: true,
      source: req.user ? `${req.user.name} (${req.user.role})` : 'DGHS Authority',
      publishedAt: new Date()
    };

    if (getIsConnected()) {
      const alert = await HealthAlert.create(payload);
      await OperationLog.create({
        action: 'BROADCAST_HEALTH_ALERT',
        performedBy: req.user ? req.user.name : 'Authority',
        role: req.user ? req.user.role : 'admin',
        targetEntity: alert.title,
        details: payload
      });
      return res.status(201).json({ success: true, message: 'Health alert broadcasted', data: alert });
    } else {
      const alert = { _id: 'alert-' + Date.now(), ...payload };
      store.alerts.unshift(alert);
      store.operationLogs.push({
        action: 'BROADCAST_HEALTH_ALERT',
        performedBy: req.user ? req.user.name : 'Authority',
        role: req.user ? req.user.role : 'admin',
        targetEntity: alert.title,
        details: payload,
        timestamp: new Date()
      });
      return res.status(201).json({ success: true, message: 'Health alert broadcasted', data: alert });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getOperationLogs = async (req, res) => {
  try {
    if (getIsConnected()) {
      const logs = await OperationLog.find().sort({ timestamp: -1 }).limit(100);
      return res.json({ success: true, count: logs.length, data: logs });
    } else {
      return res.json({ success: true, count: store.operationLogs.length, data: store.operationLogs });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getEmergencySpeedDial = (req, res) => {
  return res.json({ success: true, data: speedDialContacts });
};

exports.getVaccineSchedule = (req, res) => {
  return res.json({ success: true, data: epiVaccineSchedule });
};
