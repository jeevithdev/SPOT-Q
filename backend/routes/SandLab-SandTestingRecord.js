const express = require('express');
const { 
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

