const MicroStructure = require('../models/MicroStructure');

exports.getAllEntries = async (req, res) => {
    try {
        const entries = await MicroStructure.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: entries.length,
            data: entries
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching MicroStructure entries.'
        });
    }
};

exports.createEntry = async (req, res) => {
    try {
        const entry = await MicroStructure.create(req.body);

        res.status(201).json({
            success: true,
            data: entry,
            message: 'MicroStructure entry created successfully.'
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Error creating MicroStructure entry.',
            errors: error.errors
        });
    }
};

exports.updateEntry = async (req, res) => {
    try {
        const entry = await MicroStructure.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!entry) {
            return res.status(404).json({
                success: false,
                message: 'MicroStructure entry not found.'
            });
        }

        res.status(200).json({
            success: true,
            data: entry,
            message: 'MicroStructure entry updated successfully.'
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Error updating MicroStructure entry.',
            errors: error.errors
        });
    }
};

exports.deleteEntry = async (req, res) => {
    try {
        const entry = await MicroStructure.findByIdAndDelete(req.params.id);

        if (!entry) {
            return res.status(404).json({
                success: false,
                message: 'MicroStructure entry not found.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'MicroStructure entry deleted successfully.'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error deleting MicroStructure entry.'
        });
    }
};

// Initialize today's entry if it doesn't exist (called on server startup)
exports.initializeTodayEntry = async () => {
    try {
        const { getCurrentDate } = require('../utils/dateUtils');
        const todayStr = getCurrentDate();

        // Check if entry exists for today
        const existingEntry = await MicroStructure.findOne({
            date: todayStr
        });

        if (!existingEntry) {
            // Create empty entry for today
            const newEntry = new MicroStructure({
                insDate: todayStr,
                partName: '',
                dateCode: '',
                heatCode: '',
                disa: '',
                microStructure: {
                    nodularityGraphiteType: '',
                    ferritePercent: '',
                    pearlitePercent: '',
                    carbidePercent: ''
                }
            });
            // Bypass validation for initial empty entry creation
            await newEntry.save({ validateBeforeSave: false });
        }
    } catch (error) {
        console.error('❌ Error initializing MicroStructure entry:', error.message);
    }
};
