const express = require('express');
const router = express.Router();
const hospitalController = require('../controllers/hospitalController');
const { verifyToken, requireRole } = require('../middleware/auth');

router.get('/', hospitalController.getAllHospitals);
router.get('/:id', hospitalController.getHospitalById);
router.put('/:id/beds', verifyToken, requireRole('hospital', 'admin'), hospitalController.updateHospitalBeds);
router.put('/:id/surge-mode', verifyToken, requireRole('hospital', 'admin'), hospitalController.toggleSurgeMode);

module.exports = router;
