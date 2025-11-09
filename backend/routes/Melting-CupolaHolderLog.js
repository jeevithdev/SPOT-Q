const express = require('express');
const { createPrimaryEntry, createEntry, getAllEntries, updateEntry, deleteEntry } = require('../controllers/Melting-CupolaHolderLog');

const router = express.Router();

router.route('/')
    .get(getAllEntries)
    .post(createEntry);

// Primary data endpoint - must be before /:id route
router.post('/primary', createPrimaryEntry);

router.route('/:id')
    .put(updateEntry)
    .delete(deleteEntry);

module.exports = router;
