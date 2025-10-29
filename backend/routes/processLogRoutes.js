const express = require('express');
const { getAllEntries, createEntry, updateEntry, deleteEntry } = require('../controllers/processLogController');

const router = express.Router();

// Define GET and POST routes
router.route('/')
    .get(getAllEntries)
    .post(createEntry);

router.route('/:id')
    .put(updateEntry)
    .delete(deleteEntry);

module.exports = router;