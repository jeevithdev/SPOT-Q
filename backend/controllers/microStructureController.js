const MicroStructureReport = require('../models/MicroStructureReport');

exports.getAllEntries = async (req, res) => {
    try {
        const entries = await MicroStructureReport.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: entries.length,
            data: entries
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching Micro Structure Report entries.'
        });
    }
};

exports.createEntry = async (req, res) => {
    try {
        const entry = await MicroStructureReport.create(req.body);

        res.status(201).json({
            success: true,
            data: entry,
            message: 'Micro Structure Report entry created successfully.'
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Error creating Micro Structure Report entry.',
            errors: error.errors
        });
    }
};
