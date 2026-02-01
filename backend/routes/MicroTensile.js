const express = require('express');
const router = express.Router();
const microTensileController = require('../controllers/MicroTensile');
router.get('/current-date', microTensileController.getCurrentDate);
router.get('/grouped', microTensileController.getGroupedByDate);
router.get('/by-date', microTensileController.getEntriesByDate);
router.get('/filter', microTensileController.filterEntries);

router.post('/', microTensileController.createEntry);

module.exports = router;