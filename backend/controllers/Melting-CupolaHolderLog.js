const CupolaHolderLog = require('../models/CupolaHolderLog');

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
            message: error.message || 'Error fetching Cupola Holder Log entries.'
        });
    }
};

exports.createEntry = async (req, res) => {
    try {
        const entry = await CupolaHolderLog.create(req.body);

        res.status(201).json({
            success: true,
            data: entry,
            message: 'Cupola Holder Log entry created successfully.'
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: error.message || 'Error creating Cupola Holder Log entry.',
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
                message: 'Cupola Holder Log entry not found.'
            });
        }

        res.status(200).json({
            success: true,
            data: entry,
            message: 'Cupola Holder Log entry updated successfully.'
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: error.message || 'Error updating Cupola Holder Log entry.',
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
                message: 'Cupola Holder Log entry not found.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Cupola Holder Log entry deleted successfully.'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error deleting Cupola Holder Log entry.'
        });
    }
};