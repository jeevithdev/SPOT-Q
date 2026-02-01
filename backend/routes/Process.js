const express = require('express');
const router = express.Router();
const { 
    getAllEntries, 
    createEntry
} = require('../controllers/Process');

router.route('/')
    .get(getAllEntries)
    .post(createEntry);

module.exports = router;