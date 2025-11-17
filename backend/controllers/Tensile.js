const Tensile = require('../models/Tensile');

exports.getAllEntries = async (req, res) => {
    try {
        const entries = await Tensile.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: entries.length,
            data: entries
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching Tensile entries.'
        });
    }
};

exports.createEntry = async (req, res) => {
    try {
        const entry = await Tensile.create(req.body);

        res.status(201).json({
            success: true,
            data: entry,
            message: 'Tensile entry created successfully.'
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Error creating Tensile entry.',
            errors: error.errors
        });
    }
};

exports.updateEntry = async (req, res) => {
    try {
        const entry = await Tensile.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!entry) {
            return res.status(404).json({
                success: false,
                message: 'Tensile entry not found.'
            });
        }

        res.status(200).json({
            success: true,
            data: entry,
            message: 'Tensile entry updated successfully.'
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Error updating Tensile entry.',
            errors: error.errors
        });
    }
};

exports.deleteEntry = async (req, res) => {
    try {
        const entry = await Tensile.findByIdAndDelete(req.params.id);

        if (!entry) {
            return res.status(404).json({
                success: false,
                message: 'Tensile entry not found.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Tensile entry deleted successfully.'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error deleting Tensile entry.'
        });
    }
};

// Initialize today's entry if it doesn't exist (called on server startup)
exports.initializeTodayEntry = async () => {
    try {
        const { getCurrentDate } = require('../utils/dateUtils');
        const todayStr = getCurrentDate();

        // Check if entry exists for today
        const existingEntry = await Tensile.findOne({
            date: todayStr
        });

        if (!existingEntry) {
            // Create empty entry for today
            const newEntry = new Tensile({
                dateOfInspection: todayStr,
                item: '',
                heatCode: '',
                dia: '',
                lo: '',
                li: '',
                breakingLoad: '',
                yieldLoad: '',
                uts: '',
                ys: '',
                elongation: '',
                testedBy: ''
            });
            // Bypass validation for initial empty entry creation
            await newEntry.save({ validateBeforeSave: false });
        }
    } catch (error) {
        console.error(' Error initializing Tensile entry:', error.message);
    }
};
