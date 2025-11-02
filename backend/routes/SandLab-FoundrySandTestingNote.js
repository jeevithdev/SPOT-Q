const express = require('express');
const { createEntry, getAllEntries, getEntryByPrimary, updateEntry, deleteEntry } = require('../controllers/SandLab-FoundrySandTestingNote');

const router = express.Router();

router.route('/')
    .get(getAllEntries)
    .post(createEntry);

router.get('/primary', getEntryByPrimary);

router.route('/:id')
    .put(updateEntry)
    .delete(deleteEntry);

module.exports = router;

