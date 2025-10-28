const TensileTest = require('../models/TensileTest');

// @desc    Get all Tensile Test entries
// @route   GET /api/v1/tensile-tests
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

// @desc    Create a new Tensile Test entry
// @route   POST /api/v1/tensile-tests
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
