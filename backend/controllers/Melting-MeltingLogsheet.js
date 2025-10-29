const MeltingLogsheet = require('../models/Melting-MeltingLogsheet');

exports.getAllEntries = async (req, res) => {
    try {
        const entries = await MeltingLogsheet.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: entries.length,
            data: entries
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching MeltingLogsheet entries.'
        });
    }
};

exports.createEntry = async (req, res) => {
    try {
        const entry = await MeltingLogsheet.create(req.body);

        res.status(201).json({
            success: true,
            data: entry,
            message: 'MeltingLogsheet entry created successfully.'
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: error.message || 'Error creating MeltingLogsheet entry.',
            errors: error.errors
        });
    }
};

exports.updateEntry = async (req, res) => {
    try {
        const entry = await MeltingLogsheet.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!entry) {
            return res.status(404).json({
                success: false,
                message: 'MeltingLogsheet entry not found.'
            });
        }

        res.status(200).json({
            success: true,
            data: entry,
            message: 'MeltingLogsheet entry updated successfully.'
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: error.message || 'Error updating MeltingLogsheet entry.',
            errors: error.errors
        });
    }
};

exports.deleteEntry = async (req, res) => {
    try {
        const entry = await MeltingLogsheet.findByIdAndDelete(req.params.id);

        if (!entry) {
            return res.status(404).json({
                success: false,
                message: 'MeltingLogsheet entry not found.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'MeltingLogsheet entry deleted successfully.'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error deleting MeltingLogsheet entry.'
        });
    }
};
