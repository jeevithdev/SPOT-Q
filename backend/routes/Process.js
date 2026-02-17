const express = require('express');
const router = express.Router();
const { 
    getAllEntries, 
    createEntry,
    checkDateDisaEntries,
    savePrimary
} = require('../controllers/Process');

router.route('/')
    .get(getAllEntries)
    .post(createEntry);

router.route('/check')
    .get(checkDateDisaEntries);

router.route('/save-primary')
    .post(savePrimary);

module.exports = router;