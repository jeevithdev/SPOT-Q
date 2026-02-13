const express = require('express');
const router = express.Router();
const {
    createDismaticReport,
    getDismaticReportsByDateRange,
    getDismaticReportByDate,
    getPrimaryDataByDateShift,
    savePrimaryData
} = require('../controllers/Moulding-DismaticProductReportDISA');

router.get('/by-date', getDismaticReportByDate);
router.get('/range', getDismaticReportsByDateRange);
router.get('/primary', getPrimaryDataByDateShift);
router.post('/', createDismaticReport);
router.post('/primary', savePrimaryData);

module.exports = router;
