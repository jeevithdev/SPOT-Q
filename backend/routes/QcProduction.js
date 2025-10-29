const express = require('express');
const { createEntry, getAllEntries, updateEntry, deleteEntry } = require('../controllers/QcProduction');

const router = express.Router();

router.route('/')
    .get(getAllEntries)
    .post(createEntry);

router.route('/:id')
    .put(updateEntry)
    .delete(deleteEntry);

module.exports = router;
