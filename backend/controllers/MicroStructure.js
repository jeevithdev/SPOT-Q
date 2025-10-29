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
