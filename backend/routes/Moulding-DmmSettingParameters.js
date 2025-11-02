const express = require('express');
const router = express.Router();
const DMMController = require('../controllers/Moulding-DmmSettingParameters');

// Create new settings
router.post('/', DMMController.createDMMSettings);
// Get all settings
router.get('/', DMMController.getAllDMMSettings);
// Get settings by ID
router.get('/:id', DMMController.getDMMSettingsById);
// Get settings by date range
router.get('/range', DMMController.getDMMSettingsByDateRange);
// Get settings by machine
router.get('/machine', DMMController.getDMMSettingsByMachine);
// Get settings by shift
router.get('/shift', DMMController.getDMMSettingsByShift);
// Get settings by customer
router.get('/customer', DMMController.getDMMSettingsByCustomer);
// Get settings by primary (date + machine)
router.get('/primary', DMMController.getDMMSettingsByPrimary);
// Update settings
router.put('/:id', DMMController.updateDMMSettings);
// Delete settings
router.delete('/:id', DMMController.deleteDMMSettings);

module.exports = router;
