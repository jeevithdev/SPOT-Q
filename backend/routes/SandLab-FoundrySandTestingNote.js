const express = require('express');
const router = express.Router();
const { 
    getAllEntries, 
    getEntriesByDate,
    createEntry
} = require('../controllers/SandLab-FoundrySandTestingNote');

router.get('/date/:date', getEntriesByDate);
router.route('/')
    .get(getAllEntries)
    .post(createEntry);

module.exports = router;