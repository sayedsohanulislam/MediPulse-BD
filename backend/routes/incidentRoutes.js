const express = require('express');
const router = express.Router();
const incidentController = require('../controllers/incidentController');
const { verifyToken, requireRole } = require('../middleware/auth');

router.post('/', incidentController.submitIncident);
router.get('/', incidentController.getIncidents);
router.put('/:id/status', verifyToken, requireRole('admin', 'hospital'), incidentController.updateIncidentStatus);

module.exports = router;
