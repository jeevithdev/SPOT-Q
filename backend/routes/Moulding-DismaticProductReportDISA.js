const express = require('express');
const router = express.Router();
const {
    createDismaticReport,
    getDismaticReportsByDateRange,
    getDismaticReportByDate
} = require('../controllers/Moulding-DismaticProductReportDISA');

router.get('/by-date', getDismaticReportByDate);
router.get('/range', getDismaticReportsByDateRange);
router.post('/', createDismaticReport);

module.exports = router;
