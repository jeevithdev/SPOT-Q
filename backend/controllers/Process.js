const Process = require('../models/Process');

exports.getAllEntries = async (req, res) => {
    try {
        const entries = await Process.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: entries.length,
            data: entries
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching Process entries.'
        });
    }
};

// Create or update primary data (date + disa)
exports.createPrimaryEntry = async (req, res) => {
    try {
        const { date, disa } = req.body;

        if (!date || !disa) {
            return res.status(400).json({
                success: false,
                message: 'Date and DISA are required.'
            });
        }

        // Check if primary data already exists for this date and disa combination
        const existing = await Process.findOne({ date, disa });

        if (existing) {
            // Update existing entry with primary data only
            existing.date = date;
            existing.disa = disa;
            await existing.save();

            return res.status(200).json({
                success: true,
                data: existing,
                message: 'Primary data updated successfully.'
            });
        }

        // Create new entry with primary data
        const entry = await Process.create({ date, disa });

        res.status(201).json({
            success: true,
            data: entry,
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
        const { date, disa } = req.body;

        if (!date || !disa) {
            return res.status(400).json({
                success: false,
                message: 'Date and DISA are required.'
            });
        }

        // Find existing entry by date and disa (primary identifiers)
        let entry = await Process.findOne({ date, disa });

        if (entry) {
            // Update existing entry with all provided data
            Object.keys(req.body).forEach(key => {
                if (req.body[key] !== undefined && req.body[key] !== '') {
                    entry[key] = req.body[key];
                }
            });
            await entry.save();

            return res.status(200).json({
                success: true,
                data: entry,
                message: 'Process entry updated successfully.'
            });
        }

        // Create new entry if it doesn't exist
        entry = await Process.create(req.body);

        res.status(201).json({
            success: true,
            data: entry,
            message: 'Process entry created successfully.'
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: error.message || 'Error creating Process entry.',
            errors: error.errors
        });
    }
};

exports.updateEntry = async (req, res) => {
    try {
        const entry = await Process.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!entry) {
            return res.status(404).json({
                success: false,
                message: 'Process entry not found.'
            });
        }

        res.status(200).json({
            success: true,
            data: entry,
            message: 'Process entry updated successfully.'
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: error.message || 'Error updating Process entry.',
            errors: error.errors
        });
    }
};

exports.deleteEntry = async (req, res) => {
    try {
        const entry = await Process.findByIdAndDelete(req.params.id);

        if (!entry) {
            return res.status(404).json({
                success: false,
                message: 'Process entry not found.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Process entry deleted successfully.'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error deleting Process entry.'
        });
    }
};

// Initialize today's entry if it doesn't exist (called on server startup)
exports.initializeTodayEntry = async () => {
    try {
        const { getCurrentDate } = require('../utils/dateUtils');
        const todayStr = getCurrentDate();
        const Process = require('../models/Process');

        // Check if entry exists for today
        const existingEntry = await Process.findOne({
            date: todayStr
        });

        if (!existingEntry) {
            // Create empty entry for today
            await Process.create({
                date: todayStr,
                processName: '',
                details: '',
                remarks: ''
            });
        }
    } catch (error) {
        console.error(' Error initializing Process entry:', error.message);
    }
};
