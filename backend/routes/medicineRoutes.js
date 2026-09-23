const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicineController');

router.get('/search', medicineController.searchMedicines);
router.get('/banned-recalled', medicineController.getBannedAndRecalled);
router.post('/calculate-savings', medicineController.calculateGenericSavings);

module.exports = router;
