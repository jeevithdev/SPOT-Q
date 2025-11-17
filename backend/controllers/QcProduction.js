const QcProduction = require('../models/QcProduction');

exports.getAllEntries = async (req, res) => {
    try {
        const entries = await QcProduction.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: entries.length,
            data: entries
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching QcProduction entries.'
        });
    }
};

exports.createEntry = async (req, res) => {
    try {
        const entry = await QcProduction.create(req.body);

        res.status(201).json({
            success: true,
            data: entry,
            message: 'QcProduction entry created successfully.'
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Error creating QcProduction entry.',
            errors: error.errors
        });
    }
};

exports.updateEntry = async (req, res) => {
    try {
        const entry = await QcProduction.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!entry) {
            return res.status(404).json({
                success: false,
                message: 'QcProduction entry not found.'
            });
        }

        res.status(200).json({
            success: true,
            data: entry,
            message: 'QcProduction entry updated successfully.'
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Error updating QcProduction entry.',
            errors: error.errors
        });
    }
};

exports.deleteEntry = async (req, res) => {
    try {
        const entry = await QcProduction.findByIdAndDelete(req.params.id);

        if (!entry) {
            return res.status(404).json({
                success: false,
                message: 'QcProduction entry not found.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'QcProduction entry deleted successfully.'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error deleting QcProduction entry.'
        });
    }
};

// Initialize today's entry if it doesn't exist (called on server startup)
exports.initializeTodayEntry = async () => {
    try {
        const { getCurrentDate } = require('../utils/dateUtils');
        const todayStr = getCurrentDate();
        const QcProduction = require('../models/QcProduction');

        // Check if entry exists for today
        const existingEntry = await QcProduction.findOne({
            date: todayStr
        });

        if (!existingEntry) {
            // Create empty entry for today
            const newEntry = new QcProduction({
                date: todayStr,
                partName: '',
                noOfMoulds: '',
                cPercent: '',
                siPercent: '',
                mnPercent: '',
                pPercent: '',
                sPercent: '',
                mgPercent: '',
                cuPercent: '',
                crPercent: '',
                nodularity: '',
                graphiteType: '',
                pearliteFerrite: '',
                hardnessBHN: '',
                ts: '',
                ys: '',
                el: ''
            });
            // Bypass validation for initial empty entry creation
            await newEntry.save({ validateBeforeSave: false });
        }
    } catch (error) {
        console.error('❌ Error initializing QcProduction entry:', error.message);
    }
};
