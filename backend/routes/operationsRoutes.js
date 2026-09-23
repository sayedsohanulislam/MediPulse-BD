const express = require('express');
const router = express.Router();
const operationsController = require('../controllers/operationsController');
const { verifyToken, requireRole } = require('../middleware/auth');

router.get('/alerts', operationsController.getHealthAlerts);
router.post('/alerts', verifyToken, requireRole('admin', 'hospital'), operationsController.publishAlert);
router.get('/audit-logs', verifyToken, requireRole('admin'), operationsController.getOperationLogs);
router.get('/speed-dial', operationsController.getEmergencySpeedDial);
router.get('/vaccines', operationsController.getVaccineSchedule);

module.exports = router;
