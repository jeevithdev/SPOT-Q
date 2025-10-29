const express = require('express');
const router = express.Router();
const DPRController = require('../controllers/Moulding-DismaticProductReportDISA');

// Create new report
router.post('/', DPRController.createDismaticReport);
// Get all reports
router.get('/', DPRController.getAllDismaticReports);
// Get report by ID
router.get('/:id', DPRController.getDismaticReportById);
// Get reports by date range
router.get('/range', DPRController.getDismaticReportsByDateRange);
// Get reports by shift
router.get('/shift', DPRController.getDismaticReportsByShift);
// Update report
router.put('/:id', DPRController.updateDismaticReport);
// Delete report
router.delete('/:id', DPRController.deleteDismaticReport);

module.exports = router;
