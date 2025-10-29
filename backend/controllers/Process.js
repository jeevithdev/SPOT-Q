const ProcessLog = require('../models/ProcessLog');

exports.getAllEntries = async (req, res) => {
    try {
        const entries = await ProcessLog.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: entries.length,
            data: entries
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching Process Log entries.'
        });
    }
};

exports.createEntry = async (req, res) => {
    try {
        const entry = await ProcessLog.create(req.body);

        res.status(201).json({
            success: true,
            data: entry,
            message: 'Process Log entry created successfully.'
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: error.message || 'Error creating Process Log entry.',
            errors: error.errors
        });
    }
};

exports.updateEntry = async (req, res) => {
    try {
        const entry = await ProcessLog.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!entry) {
            return res.status(404).json({
                success: false,
                message: 'Process Log entry not found.'
            });
        }

        res.status(200).json({
            success: true,
            data: entry,
            message: 'Process Log entry updated successfully.'
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: error.message || 'Error updating Process Log entry.',
            errors: error.errors
        });
    }
};

exports.deleteEntry = async (req, res) => {
    try {
        const entry = await ProcessLog.findByIdAndDelete(req.params.id);

        if (!entry) {
            return res.status(404).json({
                success: false,
                message: 'Process Log entry not found.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Process Log entry deleted successfully.'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error deleting Process Log entry.'
        });
    }
};