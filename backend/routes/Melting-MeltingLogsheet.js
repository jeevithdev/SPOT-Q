const express = require('express');
const { 
    createEntry, 
    getAllEntries, 
    updateEntry, 
    deleteEntry,
    getPrimaryByDate,
    createOrUpdatePrimary,
    createTableEntry
} = require('../controllers/Melting-MeltingLogsheet');

const router = express.Router();

// Primary data routes - must be before :id route
router.get('/primary/:date', getPrimaryByDate);
router.post('/primary', createOrUpdatePrimary);

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

// Main routes
router.route('/')
    .get(getAllEntries)
    .post(createEntry);

router.route('/:id')
    .put(updateEntry)
    .delete(deleteEntry);

module.exports = router;
