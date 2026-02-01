const express = require('express');
const router = express.Router();
const {
    getAllEntries,
    getEntriesByDate,
    createTableEntry,
    getStats
} = require('../controllers/SandLab-SandTestingRecord');

router.get('/stats', getStats);
router.get('/date/:date', getEntriesByDate);
router.post('/table/:tableNum', createTableEntry);
router.post('/table-update', createTableEntry);
router.route('/')
    .get(getAllEntries);

module.exports = router;