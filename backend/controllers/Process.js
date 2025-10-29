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

exports.createEntry = async (req, res) => {
    try {
        const entry = await Process.create(req.body);

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
