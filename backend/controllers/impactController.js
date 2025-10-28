const ImpactTest = require('../models/ImpactTest');

exports.getAllEntries = async (req, res) => {
    try {
        const entries = await ImpactTest.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: entries.length,
            data: entries
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching Impact Test entries.'
        });
    }
};



exports.createEntry = async (req, res) => {
    try {
        const entry = await ImpactTest.create(req.body);

        res.status(201).json({
            success: true,
            data: entry,
            message: 'Impact Test entry created successfully.'
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Error creating Impact Test entry.',
            errors: error.errors
        });
    }
};
