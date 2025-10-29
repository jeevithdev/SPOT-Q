const QCProductionReport = require('../models/QCProductionReport');

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

exports.updateEntry = async (req, res) => {
    try {
        const entry = await QCProductionReport.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!entry) {
            return res.status(404).json({
                success: false,
                message: 'QC Production Report entry not found.'
            });
        }

        res.status(200).json({
            success: true,
            data: entry,
            message: 'QC Production Report entry updated successfully.'
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Error updating QC Production Report entry.',
            errors: error.errors
        });
    }
};

exports.deleteEntry = async (req, res) => {
    try {
        const entry = await QCProductionReport.findByIdAndDelete(req.params.id);

        if (!entry) {
            return res.status(404).json({
                success: false,
                message: 'QC Production Report entry not found.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'QC Production Report entry deleted successfully.'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error deleting QC Production Report entry.'
        });
    }
};
