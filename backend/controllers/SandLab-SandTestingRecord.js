const SandTestingRecord = require('../models/SandLab-SandTestingRecord');

exports.getAllEntries = async (req, res) => {
    try {
        const entries = await SandTestingRecord.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: entries.length,
            data: entries
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching Sand Testing Record entries.'
        });
    }
};

exports.createEntry = async (req, res) => {
    try {
        const entry = await SandTestingRecord.create(req.body);

        res.status(201).json({
            success: true,
            data: entry,
            message: 'Sand Testing Record entry created successfully.'
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Error creating Sand Testing Record entry.',
            errors: error.errors
        });
    }
};

exports.updateEntry = async (req, res) => {
    try {
        const entry = await SandTestingRecord.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!entry) {
            return res.status(404).json({
                success: false,
                message: 'Sand Testing Record entry not found.'
            });
        }

        res.status(200).json({
            success: true,
            data: entry,
            message: 'Sand Testing Record entry updated successfully.'
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Error updating Sand Testing Record entry.',
            errors: error.errors
        });
    }
};

exports.deleteEntry = async (req, res) => {
    try {
        const entry = await SandTestingRecord.findByIdAndDelete(req.params.id);

        if (!entry) {
            return res.status(404).json({
                success: false,
                message: 'Sand Testing Record entry not found.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Sand Testing Record entry deleted successfully.'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error deleting Sand Testing Record entry.'
        });
    }
};

