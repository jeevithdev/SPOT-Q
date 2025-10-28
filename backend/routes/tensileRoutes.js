const express = require('express');
const { createEntry, getAllEntries } = require('../controllers/tensileController');

const router = express.Router();

router.route('/')
    .get(getAllEntries)
    .post(createEntry);

module.exports = router;
