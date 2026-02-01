const express = require('express');
const router = express.Router();
const qcController = require('../controllers/QcProduction');

router.route('/')
    .get(qcController.getAllEntries)
    .post(qcController.createEntry);

module.exports = router;