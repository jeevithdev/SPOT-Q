const express = require('express');
const { createEntry, getAllEntries } = require('../controllers/qcProductionController');

const router = express.Router();

router.route('/')
    .get(getAllEntries)
    .post(createEntry);

module.exports = router;
