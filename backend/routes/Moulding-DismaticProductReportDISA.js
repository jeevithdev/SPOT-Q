const express = require('express');
const router = express.Router();
const DPRController = require('../controllers/Moulding-DismaticProductReportDISA');

// Create new report
router.post('/', DPRController.createDismaticReport);
// Get all reports
router.get('/', DPRController.getAllDismaticReports);
// Get reports by date range (must come before /:id)
router.get('/range', DPRController.getDismaticReportsByDateRange);
// Get report by date (primary identifier) - must come before /:id
router.get('/date', DPRController.getDismaticReportByDate);
// Get report by ID (must come after specific routes)
router.get('/:id', DPRController.getDismaticReportById);
// Update report
router.put('/:id', DPRController.updateDismaticReport);
// Delete report
router.delete('/:id', DPRController.deleteDismaticReport);

module.exports = router;
