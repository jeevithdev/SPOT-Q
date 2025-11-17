// backend/routes/system.js

const express = require('express');
const router = express.Router();
const { getCurrentDate } = require('../utils/dateUtils');

// === PUBLIC ROUTES ===
// Get current server date
router.get('/current-date', (req, res) => {
    try {
        const currentDate = getCurrentDate();
        res.json({
            success: true,
            data: {
                date: currentDate
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get current date',
            error: error.message
        });
    }
});

module.exports = router;
