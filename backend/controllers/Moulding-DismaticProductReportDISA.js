const DismaticProductReportDISA = require('../models/Moulding-DismaticProductReportDISA');

// Create new Dismatic Product Report or update existing one by section
const createDismaticReport = async (req, res) => {
    try {
        const { date, shift, section, ...data } = req.body;
        
        // If section is provided, do a partial update based on date (primary identifier)
        if (section && date) {
            // Normalize date to ensure consistent comparison (compare dates only, not time)
            // Date comes as YYYY-MM-DD string from frontend (e.g., "2024-01-15")
            let searchDate;
            if (typeof date === 'string') {
                // Parse YYYY-MM-DD format
                const dateParts = date.split('-');
                if (dateParts.length === 3) {
                    searchDate = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
                } else {
                    searchDate = new Date(date);
                }
            } else if (date instanceof Date) {
                searchDate = new Date(date);
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid date format. Expected YYYY-MM-DD format.'
                });
            }
            
            // Validate the date
            if (isNaN(searchDate.getTime())) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid date value provided.'
                });
            }
            
            searchDate.setHours(0, 0, 0, 0);
            const nextDay = new Date(searchDate);
            nextDay.setDate(nextDay.getDate() + 1);
            
            // Find existing report by date (primary identifier) - date is unique
            let report = await DismaticProductReportDISA.findOne({
                date: {
                    $gte: searchDate,
                    $lt: nextDay
                }
            });
            
            if (report) {
                // Update specific section only - preserve all other sections
                switch (section) {
                    case 'basicInfo':
                        if (data.shift !== undefined) report.shift = String(data.shift || '').trim();
                        if (data.incharge !== undefined) report.incharge = String(data.incharge || '').trim();
                        if (data.members !== undefined) {
                            if (Array.isArray(data.members)) {
                                const filteredMembers = data.members.filter(m => m && String(m).trim() !== '');
                                report.memberspresent = filteredMembers.length > 0 ? filteredMembers.map(m => String(m).trim()).join(', ') : '';
                            } else {
                                report.memberspresent = String(data.members || '').trim();
                            }
                        }
                        break;
                    case 'production':
                        if (data.productionTable && Array.isArray(data.productionTable)) {
                            report.productionDetails = data.productionTable
                                .filter(row => row && (row.counterNo || row.componentName || row.produced || row.poured || row.cycleTime || row.mouldsPerHour || row.remarks)) // Include rows with any data
                                .map(row => ({
                                    counterNo: String(row.counterNo || '').trim(),
                                    componentName: String(row.componentName || '').trim(),
                                    produced: (row.produced && String(row.produced).trim() !== '') ? parseFloat(row.produced) : 0,
                                    poured: (row.poured && String(row.poured).trim() !== '') ? parseFloat(row.poured) : 0,
                                    cycleTime: String(row.cycleTime || '').trim(),
                                    mouldsPerHour: (row.mouldsPerHour && String(row.mouldsPerHour).trim() !== '') ? parseFloat(row.mouldsPerHour) : 0,
                                    remarks: String(row.remarks || '').trim()
                                }));
                        }
                        break;
                    case 'nextShiftPlan':
                        if (data.nextShiftPlanTable && Array.isArray(data.nextShiftPlanTable)) {
                            report.nextShiftPlan = data.nextShiftPlanTable
                                .filter(row => row && (row.componentName || row.plannedMoulds || row.remarks)) // Include rows with any data
                                .map(row => ({
                                    componentName: String(row.componentName || '').trim(),
                                    plannedMoulds: (row.plannedMoulds && String(row.plannedMoulds).trim() !== '') ? parseFloat(row.plannedMoulds) : 0,
                                    remarks: String(row.remarks || '').trim()
                                }));
                        }
                        break;
                    case 'delays':
                        if (data.delaysTable && Array.isArray(data.delaysTable)) {
                            report.delays = data.delaysTable
                                .filter(row => row && (row.delays || row.durationMinutes || row.durationTime)) // Include rows with any data
                                .map(row => ({
                                    delays: String(row.delays || '').trim(),
                                    durationMinutes: (row.durationMinutes && String(row.durationMinutes).trim() !== '') ? parseFloat(row.durationMinutes) : 0,
                                    durationTime: String(row.durationTime || '').trim()
                                }));
                        }
                        break;
                    case 'mouldHardness':
                        if (data.mouldHardnessTable && Array.isArray(data.mouldHardnessTable)) {
                            report.mouldHardness = data.mouldHardnessTable
                                .filter(row => row && (row.componentName || row.mpPP || row.mpSP || row.bsPP || row.bsSP || row.remarks)) // Include rows with any data
                                .map(row => ({
                                    componentName: String(row.componentName || '').trim(),
                                    mpPP: (row.mpPP && String(row.mpPP).trim() !== '') ? parseFloat(row.mpPP) : 0,
                                    mpSP: (row.mpSP && String(row.mpSP).trim() !== '') ? parseFloat(row.mpSP) : 0,
                                    bsPP: (row.bsPP && String(row.bsPP).trim() !== '') ? parseFloat(row.bsPP) : 0,
                                    bsSP: (row.bsSP && String(row.bsSP).trim() !== '') ? parseFloat(row.bsSP) : 0,
                                    remarks: String(row.remarks || '').trim()
                                }));
                        }
                        break;
                    case 'patternTemp':
                        if (data.patternTempTable && Array.isArray(data.patternTempTable)) {
                            report.patternTemperature = data.patternTempTable
                                .filter(row => row && (row.item || row.pp || row.sp)) // Include rows with any data
                                .map(row => ({
                                    item: String(row.item || '').trim(),
                                    pp: (row.pp && String(row.pp).trim() !== '') ? parseFloat(row.pp) : 0,
                                    sp: (row.sp && String(row.sp).trim() !== '') ? parseFloat(row.sp) : 0
                                }));
                        }
                        break;
                    case 'significantEvent':
                        if (data.significantEvent !== undefined) report.significantEvent = String(data.significantEvent || '').trim();
                        break;
                    case 'maintenance':
                        if (data.maintenance !== undefined) report.maintenance = String(data.maintenance || '').trim();
                        break;
                    case 'supervisorName':
                        if (data.supervisorName !== undefined) report.supervisorName = String(data.supervisorName || '').trim();
                        break;
                    case 'eventSection':
                        // Update all three event section fields together
                        // Only update fields that are present in the request AND have actual content
                        // This prevents empty strings from overwriting existing data
                        if (data.significantEvent !== undefined && String(data.significantEvent || '').trim() !== '') {
                            report.significantEvent = String(data.significantEvent).trim();
                        }
                        // If field is not in the payload at all (undefined), don't touch it
                        if (data.maintenance !== undefined && String(data.maintenance || '').trim() !== '') {
                            report.maintenance = String(data.maintenance).trim();
                        }
                        // If field is not in the payload at all (undefined), don't touch it
                        if (data.supervisorName !== undefined && String(data.supervisorName || '').trim() !== '') {
                            report.supervisorName = String(data.supervisorName).trim();
                        }
                        break;
                }
                
                await report.save();
                return res.status(200).json({
                    success: true,
                    data: report,
                    message: `${section} updated successfully.`
                });
            } else {
                // Create new report with partial data for this section only
                // All other sections will remain empty and can be filled in later
                // Use shift from request body if provided, otherwise use empty string
                // Note: shift is required in schema, so we use a default value if not provided
                const newReportData = {
                    date: searchDate, // Primary identifier - unique per date
                    shift: shift ? String(shift).trim() : 'Not Set', // Use shift from request if available, otherwise default value
                    incharge: section === 'basicInfo' ? String(data.incharge || '').trim() : '',
                    memberspresent: section === 'basicInfo' && data.members 
                        ? (Array.isArray(data.members) 
                            ? data.members.filter(m => m && String(m).trim() !== '').map(m => String(m).trim()).join(', ') 
                            : String(data.members || '').trim()) 
                        : '',
                    production: '',
                    ppOperator: '',
                    productionDetails: section === 'production' && data.productionTable && Array.isArray(data.productionTable)
                        ? data.productionTable
                            .filter(row => row && (row.counterNo || row.componentName || row.produced || row.poured || row.cycleTime || row.mouldsPerHour || row.remarks))
                            .map(row => ({
                                counterNo: String(row.counterNo || '').trim(),
                                componentName: String(row.componentName || '').trim(),
                                produced: (row.produced && String(row.produced).trim() !== '') ? parseFloat(row.produced) : 0,
                                poured: (row.poured && String(row.poured).trim() !== '') ? parseFloat(row.poured) : 0,
                                cycleTime: String(row.cycleTime || '').trim(),
                                mouldsPerHour: (row.mouldsPerHour && String(row.mouldsPerHour).trim() !== '') ? parseFloat(row.mouldsPerHour) : 0,
                                remarks: String(row.remarks || '').trim()
                            })) 
                        : [],
                    nextShiftPlan: section === 'nextShiftPlan' && data.nextShiftPlanTable && Array.isArray(data.nextShiftPlanTable)
                        ? data.nextShiftPlanTable
                            .filter(row => row && (row.componentName || row.plannedMoulds || row.remarks))
                            .map(row => ({
                                componentName: String(row.componentName || '').trim(),
                                plannedMoulds: (row.plannedMoulds && String(row.plannedMoulds).trim() !== '') ? parseFloat(row.plannedMoulds) : 0,
                                remarks: String(row.remarks || '').trim()
                            })) 
                        : [],
                    delays: section === 'delays' && data.delaysTable && Array.isArray(data.delaysTable)
                        ? data.delaysTable
                            .filter(row => row && (row.delays || row.durationMinutes || row.durationTime))
                            .map(row => ({
                                delays: String(row.delays || '').trim(),
                                durationMinutes: (row.durationMinutes && String(row.durationMinutes).trim() !== '') ? parseFloat(row.durationMinutes) : 0,
                                durationTime: String(row.durationTime || '').trim()
                            })) 
                        : [],
                    mouldHardness: section === 'mouldHardness' && data.mouldHardnessTable && Array.isArray(data.mouldHardnessTable)
                        ? data.mouldHardnessTable
                            .filter(row => row && (row.componentName || row.mpPP || row.mpSP || row.bsPP || row.bsSP || row.remarks))
                            .map(row => ({
                                componentName: String(row.componentName || '').trim(),
                                mpPP: (row.mpPP && String(row.mpPP).trim() !== '') ? parseFloat(row.mpPP) : 0,
                                mpSP: (row.mpSP && String(row.mpSP).trim() !== '') ? parseFloat(row.mpSP) : 0,
                                bsPP: (row.bsPP && String(row.bsPP).trim() !== '') ? parseFloat(row.bsPP) : 0,
                                bsSP: (row.bsSP && String(row.bsSP).trim() !== '') ? parseFloat(row.bsSP) : 0,
                                remarks: String(row.remarks || '').trim()
                            })) 
                        : [],
                    patternTemperature: section === 'patternTemp' && data.patternTempTable && Array.isArray(data.patternTempTable)
                        ? data.patternTempTable
                            .filter(row => row && (row.item || row.pp || row.sp))
                            .map(row => ({
                                item: String(row.item || '').trim(),
                                pp: (row.pp && String(row.pp).trim() !== '') ? parseFloat(row.pp) : 0,
                                sp: (row.sp && String(row.sp).trim() !== '') ? parseFloat(row.sp) : 0
                            })) 
                        : []
                };
                
                // Only add event section fields if they have actual content (not empty strings)
                // This prevents MongoDB from saving empty strings which would trigger field locks
                if (section === 'eventSection' || section === 'significantEvent') {
                    if (data.significantEvent !== undefined && String(data.significantEvent || '').trim() !== '') {
                        newReportData.significantEvent = String(data.significantEvent).trim();
                    }
                }
                if (section === 'eventSection' || section === 'maintenance') {
                    if (data.maintenance !== undefined && String(data.maintenance || '').trim() !== '') {
                        newReportData.maintenance = String(data.maintenance).trim();
                    }
                }
                if (section === 'eventSection' || section === 'supervisorName') {
                    if (data.supervisorName !== undefined && String(data.supervisorName || '').trim() !== '') {
                        newReportData.supervisorName = String(data.supervisorName).trim();
                    }
                }
                
                const newReport = new DismaticProductReportDISA(newReportData);
                const savedReport = await newReport.save();
                return res.status(201).json({
                    success: true,
                    data: savedReport,
                    message: `${section} saved successfully.`
                });
            }
        }
        
        // Default behavior: create new report with full data
        // Ensure date is properly formatted if provided
        if (req.body.date) {
            let dateValue;
            if (typeof req.body.date === 'string') {
                const dateParts = req.body.date.split('-');
                if (dateParts.length === 3) {
                    dateValue = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
                    dateValue.setHours(0, 0, 0, 0);
                } else {
                    dateValue = new Date(req.body.date);
                }
                
                if (isNaN(dateValue.getTime())) {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid date format. Expected YYYY-MM-DD format.'
                    });
                }
                req.body.date = dateValue;
            }
        }
        
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
        
        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: 'Start date and end date are required.'
            });
        }

        // Parse dates properly (handle YYYY-MM-DD format)
        let startDateObj;
        if (typeof startDate === 'string') {
            const dateParts = startDate.split('-');
            if (dateParts.length === 3) {
                startDateObj = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
            } else {
                startDateObj = new Date(startDate);
            }
        } else {
            startDateObj = new Date(startDate);
        }

        let endDateObj;
        if (typeof endDate === 'string') {
            const dateParts = endDate.split('-');
            if (dateParts.length === 3) {
                endDateObj = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
                endDateObj.setHours(23, 59, 59, 999); // End of day
            } else {
                endDateObj = new Date(endDate);
            }
        } else {
            endDateObj = new Date(endDate);
        }

        if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
            return res.status(400).json({
                success: false,
                message: 'Invalid date format.'
            });
        }

        startDateObj.setHours(0, 0, 0, 0);

        const reports = await DismaticProductReportDISA.find({
            date: {
                $gte: startDateObj,
                $lte: endDateObj
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

// Get Report by Date (primary identifier)
const getDismaticReportByDate = async (req, res) => {
    try {
        const { date } = req.query;
        
        if (!date) {
            return res.status(400).json({
                success: false,
                message: 'Date is required.'
            });
        }

        // Parse date properly (handle YYYY-MM-DD format)
        let startOfDay;
        if (typeof date === 'string') {
            const dateParts = date.split('-');
            if (dateParts.length === 3) {
                startOfDay = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
            } else {
                startOfDay = new Date(date);
            }
        } else {
            startOfDay = new Date(date);
        }

        if (isNaN(startOfDay.getTime())) {
            return res.status(400).json({
                success: false,
                message: 'Invalid date format.'
            });
        }

        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(startOfDay);
        endOfDay.setHours(23, 59, 59, 999);

        const report = await DismaticProductReportDISA.findOne({
            date: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        });
        
        res.status(200).json({
            success: true,
            data: report ? [report] : [],
            count: report ? 1 : 0
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
    getDismaticReportByDate,
    updateDismaticReport,
    deleteDismaticReport
};
