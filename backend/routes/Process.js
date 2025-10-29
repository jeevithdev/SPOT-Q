const express = require('express');
const { getAllEntries, createEntry, updateEntry, deleteEntry } = require('../controllers/Process');

const router = express.Router();

router.route('/')
    .get(getAllEntries)
    .post(createEntry);

router.route('/:id')
    .put(updateEntry)
    .delete(deleteEntry);

module.exports = router;
