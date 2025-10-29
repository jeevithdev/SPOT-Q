const Impact = require('../models/Impact');

exports.getAllEntries = async (req, res) => {
    try {
        const entries = await Impact.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: entries.length,
            data: entries
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching Impact entries.'
        });
    }
};

exports.createEntry = async (req, res) => {
    try {
        const entry = await Impact.create(req.body);

        res.status(201).json({
            success: true,
            data: entry,
            message: 'Impact entry created successfully.'
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Error creating Impact entry.',
            errors: error.errors
        });
    }
};

exports.updateEntry = async (req, res) => {
    try {
        const entry = await Impact.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!entry) {
            return res.status(404).json({
                success: false,
                message: 'Impact entry not found.'
            });
        }

        res.status(200).json({
            success: true,
            data: entry,
            message: 'Impact entry updated successfully.'
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Error updating Impact entry.',
            errors: error.errors
        });
    }
};

exports.deleteEntry = async (req, res) => {
    try {
        const entry = await Impact.findByIdAndDelete(req.params.id);

        if (!entry) {
            return res.status(404).json({
                success: false,
                message: 'Impact entry not found.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Impact entry deleted successfully.'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error deleting Impact entry.'
        });
    }
};
