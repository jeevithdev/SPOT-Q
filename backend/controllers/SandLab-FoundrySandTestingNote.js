const FoundrySandTestingNote = require('../models/SandLab-FoundrySandTestingNote');

exports.getAllEntries = async (req, res) => {
    try {
        const entries = await FoundrySandTestingNote.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: entries.length,
            data: entries
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching Foundry Sand Testing Note entries.'
        });
    }
};

exports.createEntry = async (req, res) => {
    try {
        const entry = await FoundrySandTestingNote.create(req.body);

        res.status(201).json({
            success: true,
            data: entry,
            message: 'Foundry Sand Testing Note entry created successfully.'
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Error creating Foundry Sand Testing Note entry.',
            errors: error.errors
        });
    }
};

exports.updateEntry = async (req, res) => {
    try {
        const entry = await FoundrySandTestingNote.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!entry) {
            return res.status(404).json({
                success: false,
                message: 'Foundry Sand Testing Note entry not found.'
            });
        }

        res.status(200).json({
            success: true,
            data: entry,
            message: 'Foundry Sand Testing Note entry updated successfully.'
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Error updating Foundry Sand Testing Note entry.',
            errors: error.errors
        });
    }
};

exports.deleteEntry = async (req, res) => {
    try {
        const entry = await FoundrySandTestingNote.findByIdAndDelete(req.params.id);

        if (!entry) {
            return res.status(404).json({
                success: false,
                message: 'Foundry Sand Testing Note entry not found.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Foundry Sand Testing Note entry deleted successfully.'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error deleting Foundry Sand Testing Note entry.'
        });
    }
};

