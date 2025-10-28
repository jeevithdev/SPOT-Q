const QCProductionReport = require('../models/QCProductionReport');

// @desc    Get all QC Production Report entries
// @route   GET /api/v1/qc-reports
exports.getAllEntries = async (req, res) => {
    try {
        const entries = await QCProductionReport.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: entries.length,
            data: entries
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching QC Production Report entries.'
        });
    }
};

// @desc    Create a new QC Production Report entry
// @route   POST /api/v1/qc-reports
exports.createEntry = async (req, res) => {
    try {
        const entry = await QCProductionReport.create(req.body);

        res.status(201).json({
            success: true,
            data: entry,
            message: 'QC Production Report entry created successfully.'
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Error creating QC Production Report entry.',
            errors: error.errors
        });
    }
};
