const TensileTest = require('../models/TensileTest');

exports.getAllEntries = async (req, res) => {
    try {
        const entries = await TensileTest.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: entries.length,
            data: entries
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching Tensile Test entries.'
        });
    }
};

exports.createEntry = async (req, res) => {
    try {
        const entry = await TensileTest.create(req.body);

        res.status(201).json({
            success: true,
            data: entry,
            message: 'Tensile Test entry created successfully.'
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Error creating Tensile Test entry.',
            errors: error.errors
        });
    }
};

exports.updateEntry = async (req, res) => {
    try {
        const entry = await TensileTest.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!entry) {
            return res.status(404).json({
                success: false,
                message: 'Tensile Test entry not found.'
            });
        }

        res.status(200).json({
            success: true,
            data: entry,
            message: 'Tensile Test entry updated successfully.'
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Error updating Tensile Test entry.',
            errors: error.errors
        });
    }
};

exports.deleteEntry = async (req, res) => {
    try {
        const entry = await TensileTest.findByIdAndDelete(req.params.id);

        if (!entry) {
            return res.status(404).json({
                success: false,
                message: 'Tensile Test entry not found.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Tensile Test entry deleted successfully.'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error deleting Tensile Test entry.'
        });
    }
};
