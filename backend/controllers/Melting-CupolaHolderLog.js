const CupolaHolderLog = require('../models/Melting-CupolaHolderLog');

// @desc    Get primary data by date, shift, and holderNumber
// @route   GET /api/v1/cupola-holder-logs/primary/:date/:shift/:holderNumber
// @access  Private
exports.getPrimaryByDate = async (req, res) => {
    try {
        const { date, shift, holderNumber } = req.params;
        
        if (!date || !shift || !holderNumber) {
            return res.status(400).json({
                success: false,
                message: 'Date, Shift, and Holder Number parameters are required.'
            });
        }

        const dateObj = new Date(date);
        dateObj.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const holderNo = parseInt(holderNumber) || holderNumber;

        const entry = await CupolaHolderLog.findOne({
            date: {
                $gte: dateObj,
                $lte: endOfDay
            },
            shift: shift,
            holderno: holderNo
        });

        if (!entry) {
            return res.status(200).json({
                success: true,
                data: null,
                message: 'No entry found for this date, shift, and holder number combination.'
            });
        }

        // Extract primary data
        const primaryData = {
            _id: entry._id,
            date: entry.date,
            shift: entry.shift,
            holderNumber: entry.holderno.toString(),
            heatNo: entry.heatNo || ''
        };

        res.status(200).json({
            success: true,
            data: primaryData,
            message: 'Primary data fetched successfully.'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching primary data.'
        });
    }
};

exports.getAllEntries = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        let query = {};
        
        // Filter by date range if provided
        if (startDate || endDate) {
            query.date = {};
            if (startDate) {
                const start = new Date(startDate);
                start.setHours(0, 0, 0, 0);
                query.date.$gte = start;
            }
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                query.date.$lte = end;
            }
        }
        
        const entries = await CupolaHolderLog.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: entries.length,
            data: entries
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching CupolaHolderLog entries.'
        });
    }
};

// Create or update primary data (date + shift + holderNumber)
exports.createPrimaryEntry = async (req, res) => {
    try {
        const { primaryData } = req.body;
        const { date, shift, holderNumber, heatNo } = primaryData || req.body;

        if (!date || !shift || !holderNumber) {
            return res.status(400).json({
                success: false,
                message: 'Date, Shift, and Holder Number are required.'
            });
        }

        // Parse date if it's a string
        const dateObj = date instanceof Date ? date : new Date(date);
        dateObj.setHours(0, 0, 0, 0);

        const holderNo = parseInt(holderNumber) || holderNumber;

        // Check if primary data already exists for this date, shift, and holderNumber combination
        let entry = await CupolaHolderLog.findOne({ 
            date: dateObj, 
            shift, 
            holderno: holderNo 
        });

        if (entry) {
            // Update existing entry with primary data only
            entry.date = dateObj;
            entry.shift = shift;
            entry.holderno = holderNo;
            if (heatNo !== undefined) entry.heatNo = heatNo || '';
            await entry.save();

            return res.status(200).json({
                success: true,
                data: {
                    _id: entry._id,
                    date: entry.date,
                    shift: entry.shift,
                    holderNumber: entry.holderno.toString(),
                    heatNo: entry.heatNo || ''
                },
                message: 'Primary data updated successfully.'
            });
        }

        // Create new entry with primary data
        entry = await CupolaHolderLog.create({ 
            date: dateObj, 
            shift, 
            holderno: holderNo,
            heatNo: heatNo || ''
        });

        res.status(201).json({
            success: true,
            data: {
                _id: entry._id,
                date: entry.date,
                shift: entry.shift,
                holderNumber: entry.holderno.toString(),
                heatNo: entry.heatNo || ''
            },
            message: 'Primary data saved successfully.'
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: error.message || 'Error saving primary data.',
            errors: error.errors
        });
    }
};

exports.createEntry = async (req, res) => {
    try {
        const { date, shift, holderNumber, holderno } = req.body;

        // Use holderNumber or holderno from request
        const holderNo = holderNumber || holderno;

        if (!date || !shift || !holderNo) {
            return res.status(400).json({
                success: false,
                message: 'Date, Shift, and Holder Number are required.'
            });
        }

        // Parse date if it's a string
        const dateObj = date instanceof Date ? date : new Date(date);
        dateObj.setHours(0, 0, 0, 0);

        // Find existing entry by date, shift, and holderNumber (primary identifiers)
        let entry = await CupolaHolderLog.findOne({ 
            date: dateObj, 
            shift, 
            holderno: parseInt(holderNo) || holderNo 
        });

        if (entry) {
            // Update existing entry with all provided data
            Object.keys(req.body).forEach(key => {
                if (req.body[key] !== undefined && req.body[key] !== '') {
                    // Handle nested objects properly
                    if (key === 'additions' || key === 'tapping' || key === 'pouring' || key === 'electrical') {
                        entry[key] = { ...entry[key], ...req.body[key] };
                    } else if (key === 'holderNumber') {
                        entry.holderno = parseInt(req.body[key]) || req.body[key];
                    } else if (key === 'date') {
                        entry.date = dateObj;
                    } else {
                        entry[key] = req.body[key];
                    }
                }
            });
            await entry.save();

            return res.status(200).json({
                success: true,
                data: entry,
                message: 'CupolaHolderLog entry updated successfully.'
            });
        }

        // Create new entry if it doesn't exist
        const entryData = { ...req.body, date: dateObj };
        if (holderNumber) {
            entryData.holderno = parseInt(holderNumber) || holderNumber;
            delete entryData.holderNumber;
        }
        entry = await CupolaHolderLog.create(entryData);

        res.status(201).json({
            success: true,
            data: entry,
            message: 'CupolaHolderLog entry created successfully.'
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: error.message || 'Error creating CupolaHolderLog entry.',
            errors: error.errors
        });
    }
};

exports.updateEntry = async (req, res) => {
    try {
        const entry = await CupolaHolderLog.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!entry) {
            return res.status(404).json({
                success: false,
                message: 'CupolaHolderLog entry not found.'
            });
        }

        res.status(200).json({
            success: true,
            data: entry,
            message: 'CupolaHolderLog entry updated successfully.'
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: error.message || 'Error updating CupolaHolderLog entry.',
            errors: error.errors
        });
    }
};

exports.deleteEntry = async (req, res) => {
    try {
        const entry = await CupolaHolderLog.findByIdAndDelete(req.params.id);

        if (!entry) {
            return res.status(404).json({
                success: false,
                message: 'CupolaHolderLog entry not found.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'CupolaHolderLog entry deleted successfully.'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error deleting CupolaHolderLog entry.'
        });
    }
};
