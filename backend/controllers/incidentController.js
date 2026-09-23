const IncidentReport = require('../models/IncidentReport');
const OperationLog = require('../models/OperationLog');
const { getStore, getIsConnected } = require('../config/db');

const initialIncidents = [
  {
    _id: "inc-001",
    reporterName: "Dr. Nazmul Hoda",
    reporterPhone: "01711-889977",
    type: "fake_medicine",
    title: "Suspicious Napa Extra packaging with faded foil seal",
    description: "Purchased from a local pharmacy near Babubazar wholesale market. Foil was peeling off and tablets crumbled immediately upon touch.",
    location: { district: "Dhaka", areaOrHospital: "Babubazar Market", lat: 23.7104, lng: 90.4074 },
    medicineBatchNo: "NX-2024-88",
    pharmacyOrClinic: "Al-Madina Drug Corner",
    priceCharged: 4.5,
    status: "investigating",
    authorityNotes: "DGDA taskforce notified. Spot inspection scheduled.",
    reportedAt: new Date(Date.now() - 3600000 * 24),
    updatedAt: new Date()
  },
  {
    _id: "inc-002",
    reporterName: "Shohel Rana",
    reporterPhone: "01819-123456",
    type: "price_gouging",
    title: "Excessive pricing for Dengue NS1 & Platelet test kit",
    description: "Diagnostic center charging 800 BDT for NS1 test instead of the government-fixed 300 BDT ceiling rate.",
    location: { district: "Dhaka", areaOrHospital: "Mirpur-10", lat: 23.8067, lng: 90.3687 },
    medicineBatchNo: "N/A",
    pharmacyOrClinic: "Popular Diagnostics Sub-branch",
    priceCharged: 800,
    status: "verified_action_taken",
    authorityNotes: "Magistrate issued 25,000 BDT penalty under Consumer Rights Protection Act.",
    reportedAt: new Date(Date.now() - 3600000 * 48),
    updatedAt: new Date()
  }
];

const store = getStore();
if (store.incidents.length === 0) {
  store.incidents = JSON.parse(JSON.stringify(initialIncidents));
}

exports.submitIncident = async (req, res) => {
  try {
    const { reporterName, reporterPhone, type, title, description, district, areaOrHospital, medicineBatchNo, pharmacyOrClinic, priceCharged, lat, lng } = req.body;
    if (!type || !title || !description || !district) {
      return res.status(400).json({ success: false, message: 'Type, title, description, and district required' });
    }

    const payload = {
      reporterName: reporterName || (req.user ? req.user.name : 'Anonymous Citizen'),
      reporterPhone: reporterPhone || (req.user ? req.user.phone : ''),
      type,
      title,
      description,
      location: {
        district,
        areaOrHospital: areaOrHospital || 'Dhaka Metropolitan Area',
        lat: Number(lat) || 23.8103,
        lng: Number(lng) || 90.4125
      },
      medicineBatchNo: medicineBatchNo || '',
      pharmacyOrClinic: pharmacyOrClinic || '',
      priceCharged: Number(priceCharged) || 0,
      status: 'pending',
      reportedAt: new Date(),
      updatedAt: new Date()
    };

    if (getIsConnected()) {
      const created = await IncidentReport.create(payload);
      return res.status(201).json({ success: true, message: 'Incident report submitted for authority review', data: created });
    } else {
      const created = { _id: 'inc-' + Date.now(), ...payload };
      store.incidents.unshift(created);
      return res.status(201).json({ success: true, message: 'Incident report submitted for authority review', data: created });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getIncidents = async (req, res) => {
  try {
    const { status, type, district } = req.query;

    if (getIsConnected()) {
      let query = {};
      if (status && status !== 'All') query.status = status;
      if (type && type !== 'All') query.type = type;
      if (district && district !== 'All') query['location.district'] = new RegExp(district, 'i');

      const incidents = await IncidentReport.find(query).sort({ reportedAt: -1 });
      return res.json({ success: true, count: incidents.length, data: incidents });
    } else {
      let results = [...store.incidents];
      if (status && status !== 'All') {
        results = results.filter(i => i.status === status);
      }
      if (type && type !== 'All') {
        results = results.filter(i => i.type === type);
      }
      if (district && district !== 'All') {
        results = results.filter(i => i.location && i.location.district.toLowerCase() === district.toLowerCase());
      }
      return res.json({ success: true, count: results.length, data: results });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateIncidentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, authorityNotes } = req.body;

    if (!['pending', 'investigating', 'verified_action_taken', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    if (getIsConnected()) {
      const incident = await IncidentReport.findById(id);
      if (!incident) return res.status(404).json({ success: false, message: 'Incident not found' });

      incident.status = status;
      if (authorityNotes) incident.authorityNotes = authorityNotes;
      incident.updatedAt = new Date();
      await incident.save();

      await OperationLog.create({
        action: 'VERIFY_INCIDENT',
        performedBy: req.user ? req.user.name : 'Authority',
        role: req.user ? req.user.role : 'admin',
        targetEntity: incident.title,
        details: { newStatus: status, notes: authorityNotes }
      });

      return res.json({ success: true, message: 'Incident status updated', data: incident });
    } else {
      const incident = store.incidents.find(i => i._id === id || i.id === id);
      if (!incident) return res.status(404).json({ success: false, message: 'Incident not found' });

      incident.status = status;
      if (authorityNotes) incident.authorityNotes = authorityNotes;
      incident.updatedAt = new Date();

      store.operationLogs.push({
        action: 'VERIFY_INCIDENT',
        performedBy: req.user ? req.user.name : 'Authority',
        role: req.user ? req.user.role : 'admin',
        targetEntity: incident.title,
        details: { newStatus: status, notes: authorityNotes },
        timestamp: new Date()
      });

      return res.json({ success: true, message: 'Incident status updated', data: incident });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
