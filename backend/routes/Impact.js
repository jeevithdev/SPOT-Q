const express = require('express');
const { createEntry, getAllEntries, getEntriesByDate, getGroupedByDate, updateEntry, deleteEntry, getCurrentDate, filterEntries } = require('../controllers/Impact');

const router = express.Router();

router.route('/')
    .get(getAllEntries)
    .post(createEntry);

router.route('/current-date')
    .get(getCurrentDate);

router.route('/grouped')
    .get(getGroupedByDate);

router.route('/by-date')
    .get(getEntriesByDate);

router.route('/filter')
    .get(filterEntries);

router.route('/:id')
    .put(updateEntry)
    .delete(deleteEntry);

module.exports = router;
