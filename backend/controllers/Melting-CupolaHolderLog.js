const CupolaHolderLog = require('../models/Melting-CupolaHolderLog');

exports.getAllEntries = async (req, res) => {
    try {
        const entries = await CupolaHolderLog.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: entries.length,
            data: entries
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching CupolaHolderLog entries.'
        });
    }
};

exports.createEntry = async (req, res) => {
    try {
        const entry = await CupolaHolderLog.create(req.body);

        res.status(201).json({
            success: true,
            data: entry,
            message: 'CupolaHolderLog entry created successfully.'
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: error.message || 'Error creating CupolaHolderLog entry.',
            errors: error.errors
        });
    }
};

exports.updateEntry = async (req, res) => {
    try {
        const entry = await CupolaHolderLog.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!entry) {
            return res.status(404).json({
                success: false,
                message: 'CupolaHolderLog entry not found.'
            });
        }

        res.status(200).json({
            success: true,
            data: entry,
            message: 'CupolaHolderLog entry updated successfully.'
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: error.message || 'Error updating CupolaHolderLog entry.',
            errors: error.errors
        });
    }
};

exports.deleteEntry = async (req, res) => {
    try {
        const entry = await CupolaHolderLog.findByIdAndDelete(req.params.id);

        if (!entry) {
            return res.status(404).json({
                success: false,
                message: 'CupolaHolderLog entry not found.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'CupolaHolderLog entry deleted successfully.'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error deleting CupolaHolderLog entry.'
        });
    }
};
