const MicroTensile = require('../models/MicroTensile');

exports.getAllEntries = async (req, res) => {
    try {
        const entries = await MicroTensile.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: entries.length,
            data: entries
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching MicroTensile entries.'
        });
    }
};

exports.createEntry = async (req, res) => {
    try {
        const entry = await MicroTensile.create(req.body);

        res.status(201).json({
            success: true,
            data: entry,
            message: 'MicroTensile entry created successfully.'
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Error creating MicroTensile entry.',
            errors: error.errors
        });
    }
};

exports.updateEntry = async (req, res) => {
    try {
        const entry = await MicroTensile.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!entry) {
            return res.status(404).json({
                success: false,
                message: 'MicroTensile entry not found.'
            });
        }

        res.status(200).json({
            success: true,
            data: entry,
            message: 'MicroTensile entry updated successfully.'
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Error updating MicroTensile entry.',
            errors: error.errors
        });
    }
};

exports.deleteEntry = async (req, res) => {
    try {
        const entry = await MicroTensile.findByIdAndDelete(req.params.id);

        if (!entry) {
            return res.status(404).json({
                success: false,
                message: 'MicroTensile entry not found.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'MicroTensile entry deleted successfully.'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error deleting MicroTensile entry.'
        });
    }
};
