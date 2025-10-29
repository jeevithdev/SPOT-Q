const DismaticProductReportDISA = require('../models/Moulding-DismaticProductReportDISA');

// Create new Dismatic Product Report
const createDismaticReport = async (req, res) => {
    try {
        const newReport = new DismaticProductReportDISA(req.body);
        const savedReport = await newReport.save();
        res.status(201).json({
            success: true,
            data: savedReport,
            message: 'Dismatic Report created successfully.'
        });
    } catch (error) {
        res.status(400).json({ 
            success: false,
            message: error.message 
        });
    }
};

// Get all Dismatic Product Reports
const getAllDismaticReports = async (req, res) => {
    try {
        const reports = await DismaticProductReportDISA.find().sort({ date: -1 });
        res.status(200).json({
            success: true,
            count: reports.length,
            data: reports
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// Get Dismatic Product Report by ID
const getDismaticReportById = async (req, res) => {
    try {
        const report = await DismaticProductReportDISA.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ 
                success: false,
                message: 'Report not found' 
            });
        }
        res.status(200).json({
            success: true,
            data: report
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// Get Dismatic Product Reports by Date Range
const getDismaticReportsByDateRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const reports = await DismaticProductReportDISA.find({
            date: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        }).sort({ date: -1 });
        res.status(200).json({
            success: true,
            count: reports.length,
            data: reports
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// Get Reports by Shift
const getDismaticReportsByShift = async (req, res) => {
    try {
        const { shift, date } = req.query;
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const reports = await DismaticProductReportDISA.find({
            shift: shift,
            date: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        });
        res.status(200).json({
            success: true,
            count: reports.length,
            data: reports
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// Update Dismatic Product Report
const updateDismaticReport = async (req, res) => {
    try {
        const updatedReport = await DismaticProductReportDISA.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedReport) {
            return res.status(404).json({ 
                success: false,
                message: 'Report not found' 
            });
        }
        res.status(200).json({
            success: true,
            data: updatedReport,
            message: 'Dismatic Report updated successfully.'
        });
    } catch (error) {
        res.status(400).json({ 
            success: false,
            message: error.message 
        });
    }
};

// Delete Dismatic Product Report
const deleteDismaticReport = async (req, res) => {
    try {
        const report = await DismaticProductReportDISA.findByIdAndDelete(req.params.id);
        if (!report) {
            return res.status(404).json({ 
                success: false,
                message: 'Report not found' 
            });
        }
        res.status(200).json({ 
            success: true,
            message: 'Report deleted successfully' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

module.exports = {
    createDismaticReport,
    getAllDismaticReports,
    getDismaticReportById,
    getDismaticReportsByDateRange,
    getDismaticReportsByShift,
    updateDismaticReport,
    deleteDismaticReport
};
