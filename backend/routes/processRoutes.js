const express = require('express');
const router = express.Router();
const processController = require('../controllers/processController');
const { protect } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(protect);

// Create a new process record
router.post('/', processController.createProcessRecord);

// Get all process records
router.get('/', processController.getAllProcessRecords);

// Get process statistics
router.get('/statistics', processController.getProcessStatistics);

// Filter process records
router.get('/filter', processController.filterProcessRecords);

// Get process record by ID
router.get('/:id', processController.getProcessRecordById);

// Update process record
router.put('/:id', processController.updateProcessRecord);

// Delete process record
router.delete('/:id', processController.deleteProcessRecord);

module.exports = router;

