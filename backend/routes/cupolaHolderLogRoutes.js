const express = require('express');
const { createEntry, getAllEntries, updateEntry, deleteEntry } = require('../controllers/cupolaHolderLogController');

const router = express.Router();

// Define GET and POST routes
router.route('/')
    .get(getAllEntries)
    .post(createEntry);

router.route('/:id')
    .put(updateEntry)
    .delete(deleteEntry);

module.exports = router;