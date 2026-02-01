const express = require('express');
const router = express.Router();
const cupolaController = require('../controllers/Melting-CupolaHolderLog');

router.get('/filter', cupolaController.filterByDateRange);
router.get('/primary/:date/:shift/:holderNumber', cupolaController.getPrimaryByDate);
router.post('/primary', cupolaController.createPrimary);
router.route('/')
    .get(cupolaController.getAllEntries)
    .post(cupolaController.createEntry);

module.exports = router;