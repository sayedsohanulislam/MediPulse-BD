const express = require('express');
const router = express.Router();
const bloodController = require('../controllers/bloodController');

router.get('/donors', bloodController.searchDonors);
router.post('/register-donor', bloodController.registerDonor);
router.post('/urgent-sos', bloodController.triggerUrgentSos);
router.get('/urgent-sos', bloodController.getActiveSos);
router.post('/check-eligibility', bloodController.calculateNextEligibleDate);

module.exports = router;
