const express = require('express');
const { 
    createPrimaryEntry,
    createTableEntry,
    createEntry, 
    getAllEntries, 
    getEntryById,
    getEntriesByDate,
    updateEntry, 
    patchEntry,
    deleteEntry,
    bulkDeleteEntries,
    getStats
} = require('../controllers/SandLab-SandTestingRecord');

const router = express.Router();

// Stats route - must be before :id route to avoid conflict
router.get('/stats', getStats);

// Date-specific route
router.get('/date/:date', getEntriesByDate);

// Primary data route - must be before :id route
router.post('/primary', createPrimaryEntry);

// Table-specific routes (table1, table2, etc.) - must be before :id route
router.post('/table1', (req, res) => {
    req.body.tableNum = 1;
    createTableEntry(req, res);
});
router.post('/table2', (req, res) => {
    req.body.tableNum = 2;
    createTableEntry(req, res);
});
router.post('/table3', (req, res) => {
    req.body.tableNum = 3;
    createTableEntry(req, res);
});
router.post('/table4', (req, res) => {
    req.body.tableNum = 4;
    createTableEntry(req, res);
});
router.post('/table5', (req, res) => {
    req.body.tableNum = 5;
    createTableEntry(req, res);
});

// Bulk operations
router.delete('/bulk', bulkDeleteEntries);

// Main routes
router.route('/')
    .get(getAllEntries)
    .post(createEntry);

// ID-specific routes
router.route('/:id')
    .get(getEntryById)
    .put(updateEntry)
    .patch(patchEntry)
    .delete(deleteEntry);

module.exports = router;

