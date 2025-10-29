const MicroTensileTest = require('../models/MicroTensileTest');

exports.getAllEntries = async (req, res) => {
    try {
        const entries = await MicroTensileTest.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: entries.length,
            data: entries
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching Micro Tensile Test entries.'
        });
    }
};

exports.createEntry = async (req, res) => {
    try {
        const entry = await MicroTensileTest.create(req.body);

        res.status(201).json({
            success: true,
            data: entry,
            message: 'Micro Tensile Test entry created successfully.'
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Error creating Micro Tensile Test entry.',
            errors: error.errors
        });
    }
};

exports.updateEntry = async (req, res) => {
    try {
        const entry = await MicroTensileTest.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!entry) {
            return res.status(404).json({
                success: false,
                message: 'Micro Tensile Test entry not found.'
            });
        }

        res.status(200).json({
            success: true,
            data: entry,
            message: 'Micro Tensile Test entry updated successfully.'
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Error updating Micro Tensile Test entry.',
            errors: error.errors
        });
    }
};

exports.deleteEntry = async (req, res) => {
    try {
        const entry = await MicroTensileTest.findByIdAndDelete(req.params.id);

        if (!entry) {
            return res.status(404).json({
                success: false,
                message: 'Micro Tensile Test entry not found.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Micro Tensile Test entry deleted successfully.'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error deleting Micro Tensile Test entry.'
        });
    }
};
