const express = require('express');
const router = express.Router();
const healthApiController = require('../controllers/healthApiController');

router.get('/live-telemetry', healthApiController.getLiveTelemetry);
router.post('/force-sync', healthApiController.forceRefreshSync);
router.post('/ambulance-route', healthApiController.calculateAmbulanceRoute);
router.get('/regional-risks', healthApiController.getRegionalRiskSummary);

module.exports = router;
