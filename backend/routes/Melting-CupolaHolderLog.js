const express = require('express');
const { getPrimaryByDate, createPrimaryEntry, createEntry, getAllEntries, updateEntry, deleteEntry } = require('../controllers/Melting-CupolaHolderLog');

const router = express.Router();

router.route('/')
    .get(getAllEntries)
    .post(createEntry);

// Primary data endpoints - must be before /:id route
router.get('/primary/:date/:shift/:holderNumber', getPrimaryByDate);
router.post('/primary', createPrimaryEntry);

router.route('/:id')
    .put(updateEntry)
    .delete(deleteEntry);

module.exports = router;
