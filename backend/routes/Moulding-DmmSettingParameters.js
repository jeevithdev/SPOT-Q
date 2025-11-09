const express = require('express');
const router = express.Router();
const DMMController = require('../controllers/Moulding-DmmSettingParameters');

// Create new settings
router.post('/', DMMController.createDMMSettings);
// Get all settings
router.get('/', DMMController.getAllDMMSettings);
// Get settings by date range (must be before /:id)
router.get('/range', DMMController.getDMMSettingsByDateRange);
// Get settings by machine (must be before /:id)
router.get('/machine', DMMController.getDMMSettingsByMachine);
// Get settings by shift (must be before /:id)
router.get('/shift', DMMController.getDMMSettingsByShift);
// Get settings by customer (must be before /:id)
router.get('/customer', DMMController.getDMMSettingsByCustomer);
// Get settings by primary (date + machine) (must be before /:id)
router.get('/primary', DMMController.getDMMSettingsByPrimary);
// Get settings by ID (must be last to avoid conflicts)
router.get('/:id', DMMController.getDMMSettingsById);
// Update settings
router.put('/:id', DMMController.updateDMMSettings);
// Delete settings
router.delete('/:id', DMMController.deleteDMMSettings);

module.exports = router;
