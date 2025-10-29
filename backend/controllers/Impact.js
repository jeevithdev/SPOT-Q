const ImpactTest = require('../models/ImpactTest');

exports.getAllEntries = async (req, res) => {
    try {
        const entries = await ImpactTest.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: entries.length,
            data: entries
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching Impact Test entries.'
        });
    }
};

exports.createEntry = async (req, res) => {
    try {
        const entry = await ImpactTest.create(req.body);

        res.status(201).json({
            success: true,
            data: entry,
            message: 'Impact Test entry created successfully.'
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Error creating Impact Test entry.',
            errors: error.errors
        });
    }
};

exports.updateEntry = async (req, res) => {
    try {
        const entry = await ImpactTest.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!entry) {
            return res.status(404).json({
                success: false,
                message: 'Impact Test entry not found.'
            });
        }

        res.status(200).json({
            success: true,
            data: entry,
            message: 'Impact Test entry updated successfully.'
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Error updating Impact Test entry.',
            errors: error.errors
        });
    }
};

exports.deleteEntry = async (req, res) => {
    try {
        const entry = await ImpactTest.findByIdAndDelete(req.params.id);

        if (!entry) {
            return res.status(404).json({
                success: false,
                message: 'Impact Test entry not found.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Impact Test entry deleted successfully.'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error deleting Impact Test entry.'
        });
    }
};
