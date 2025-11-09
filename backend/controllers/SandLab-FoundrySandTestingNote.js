const FoundrySandTestingNote = require('../models/SandLab-FoundrySandTestingNote');

exports.getAllEntries = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        let query = {};
        
        // Filter by date range if provided
        if (startDate || endDate) {
            query.date = {};
            if (startDate) {
                const start = new Date(startDate);
                start.setHours(0, 0, 0, 0);
                query.date.$gte = start;
            }
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                query.date.$lte = end;
            }
        }
        
        const entries = await FoundrySandTestingNote.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: entries.length,
            data: entries
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching Foundry Sand Testing Note entries.'
        });
    }
};

// Get entry by primary (date + shift)
exports.getEntryByPrimary = async (req, res) => {
    try {
        const { date, shift } = req.query;
        
        if (!date || !shift) {
            return res.status(400).json({
                success: false,
                message: 'Date and shift are required.'
            });
        }

        const searchDate = new Date(date);
        searchDate.setHours(0, 0, 0, 0);
        const endOfDay = new Date(searchDate);
        endOfDay.setHours(23, 59, 59, 999);

        const entries = await FoundrySandTestingNote.find({
            date: {
                $gte: searchDate,
                $lte: endOfDay
            },
            shift: String(shift).trim()
        }).sort({ date: -1 });

        res.status(200).json({
            success: true,
            count: entries.length,
            data: entries
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching Foundry Sand Testing Note entries.'
        });
    }
};

exports.createEntry = async (req, res) => {
    try {
        const { date, shift, section, ...otherData } = req.body;
        
        if (!date || !shift) {
            return res.status(400).json({
                success: false,
                message: 'Date and shift are required.'
            });
        }

        // Normalize date to start of day for comparison
        const searchDate = new Date(date);
        searchDate.setHours(0, 0, 0, 0);
        const endOfDay = new Date(searchDate);
        endOfDay.setHours(23, 59, 59, 999);

        // Check if record exists with this date + shift combination (primary identifier)
        let record = await FoundrySandTestingNote.findOne({
            date: {
                $gte: searchDate,
                $lte: endOfDay
            },
            shift: String(shift).trim()
        });

        if (record) {
            // Update existing record based on section - merge data instead of replacing
            if (section === 'primary') {
                record.date = searchDate;
                record.shift = String(shift).trim();
                if (otherData.sandPlant) record.sandPlant = String(otherData.sandPlant).trim();
                if (otherData.compactibilitySetting !== undefined && otherData.compactibilitySetting !== null && otherData.compactibilitySetting.trim() !== '') {
                    record.compactibilitySetting = String(otherData.compactibilitySetting).trim();
                }
                if (otherData.shearStrengthSetting !== undefined && otherData.shearStrengthSetting !== null && otherData.shearStrengthSetting.trim() !== '') {
                    record.shearStrengthSetting = String(otherData.shearStrengthSetting).trim();
                }
            } else if (section === 'clayParameters') {
                if (otherData.clayTests) {
                    // Merge clayTests instead of replacing
                    if (!record.clayTests) record.clayTests = {};
                    Object.keys(otherData.clayTests).forEach(test => {
                        if (!record.clayTests[test]) record.clayTests[test] = {};
                        Object.keys(otherData.clayTests[test]).forEach(param => {
                            if (!record.clayTests[test][param]) record.clayTests[test][param] = {};
                            Object.keys(otherData.clayTests[test][param] || {}).forEach(field => {
                                const value = otherData.clayTests[test][param][field];
                                if (value !== undefined && value !== null && String(value).trim() !== '') {
                                    record.clayTests[test][param][field] = String(value).trim();
                                }
                            });
                        });
                    });
                }
            } else if (section === 'sieveTesting') {
                if (!record.sieveTesting) record.sieveTesting = {};
                if (otherData.sieveTesting) {
                    if (otherData.sieveTesting.test1) {
                        if (!record.sieveTesting.test1) record.sieveTesting.test1 = {};
                        if (otherData.sieveTesting.test1.sieveSize) {
                            if (!record.sieveTesting.test1.sieveSize) record.sieveTesting.test1.sieveSize = {};
                            Object.keys(otherData.sieveTesting.test1.sieveSize).forEach(size => {
                                const value = otherData.sieveTesting.test1.sieveSize[size];
                                if (value !== undefined && value !== null && String(value).trim() !== '') {
                                    record.sieveTesting.test1.sieveSize[size] = String(value).trim();
                                }
                            });
                        }
                        if (otherData.sieveTesting.test1.mf) {
                            if (!record.sieveTesting.test1.mf) record.sieveTesting.test1.mf = {};
                            Object.keys(otherData.sieveTesting.test1.mf).forEach(mf => {
                                const value = otherData.sieveTesting.test1.mf[mf];
                                if (value !== undefined && value !== null && String(value).trim() !== '') {
                                    record.sieveTesting.test1.mf[mf] = String(value).trim();
                                }
                            });
                        }
                    }
                    if (otherData.sieveTesting.test2) {
                        if (!record.sieveTesting.test2) record.sieveTesting.test2 = {};
                        if (otherData.sieveTesting.test2.sieveSize) {
                            if (!record.sieveTesting.test2.sieveSize) record.sieveTesting.test2.sieveSize = {};
                            Object.keys(otherData.sieveTesting.test2.sieveSize).forEach(size => {
                                const value = otherData.sieveTesting.test2.sieveSize[size];
                                if (value !== undefined && value !== null && String(value).trim() !== '') {
                                    record.sieveTesting.test2.sieveSize[size] = String(value).trim();
                                }
                            });
                        }
                        if (otherData.sieveTesting.test2.mf) {
                            if (!record.sieveTesting.test2.mf) record.sieveTesting.test2.mf = {};
                            Object.keys(otherData.sieveTesting.test2.mf).forEach(mf => {
                                const value = otherData.sieveTesting.test2.mf[mf];
                                if (value !== undefined && value !== null && String(value).trim() !== '') {
                                    record.sieveTesting.test2.mf[mf] = String(value).trim();
                                }
                            });
                        }
                    }
                }
            } else if (section === 'testParameters') {
                if (otherData.parameters) {
                    if (!record.parameters) record.parameters = { test1: {}, test2: {} };
                    if (otherData.parameters.test1) {
                        Object.keys(otherData.parameters.test1).forEach(param => {
                            const value = otherData.parameters.test1[param];
                            if (value !== undefined && value !== null && String(value).trim() !== '') {
                                record.parameters.test1[param] = String(value).trim();
                            }
                        });
                    }
                    if (otherData.parameters.test2) {
                        Object.keys(otherData.parameters.test2).forEach(param => {
                            const value = otherData.parameters.test2[param];
                            if (value !== undefined && value !== null && String(value).trim() !== '') {
                                record.parameters.test2[param] = String(value).trim();
                            }
                        });
                    }
                }
            } else if (section === 'additionalData') {
                if (otherData.additionalData) {
                    if (!record.additionalData) record.additionalData = { test1: {}, test2: {} };
                    if (otherData.additionalData.test1) {
                        Object.keys(otherData.additionalData.test1).forEach(param => {
                            const value = otherData.additionalData.test1[param];
                            if (value !== undefined && value !== null && String(value).trim() !== '') {
                                record.additionalData.test1[param] = String(value).trim();
                            }
                        });
                    }
                    if (otherData.additionalData.test2) {
                        Object.keys(otherData.additionalData.test2).forEach(param => {
                            const value = otherData.additionalData.test2[param];
                            if (value !== undefined && value !== null && String(value).trim() !== '') {
                                record.additionalData.test2[param] = String(value).trim();
                            }
                        });
                    }
                }
            } else if (section === 'remarks') {
                if (otherData.remarks !== undefined && otherData.remarks !== null && String(otherData.remarks).trim() !== '') {
                    record.remarks = String(otherData.remarks).trim();
                }
            }
            
            await record.save();
            return res.status(200).json({
                success: true,
                data: record,
                message: 'Foundry Sand Testing Note updated successfully.'
            });
        } else {
            // Create new record
            const newEntryData = {
                date: searchDate,
                shift: String(shift).trim()
            };

            // Add primary data if section is primary
            if (section === 'primary') {
                if (otherData.sandPlant) newEntryData.sandPlant = String(otherData.sandPlant).trim();
                if (otherData.compactibilitySetting !== undefined) newEntryData.compactibilitySetting = String(otherData.compactibilitySetting).trim();
                if (otherData.shearStrengthSetting !== undefined) newEntryData.shearStrengthSetting = String(otherData.shearStrengthSetting).trim();
            } else {
                // For non-primary sections, require primary data to exist first
                return res.status(400).json({
                    success: false,
                    message: 'Primary data (date, shift, sandPlant) must be saved first before adding other sections.'
                });
            }

            const newEntry = new FoundrySandTestingNote(newEntryData);
            const savedEntry = await newEntry.save();
            return res.status(201).json({
                success: true,
                data: savedEntry,
                message: 'Foundry Sand Testing Note created successfully.'
            });
        }
    } catch (error) {
        // Handle duplicate key error (date + shift combination already exists)
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'A record with this date and shift combination already exists.'
            });
        }
        res.status(400).json({
            success: false,
            message: error.message || 'Error creating/updating Foundry Sand Testing Note entry.',
            errors: error.errors
        });
    }
};

exports.updateEntry = async (req, res) => {
    try {
        const entry = await FoundrySandTestingNote.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!entry) {
            return res.status(404).json({
                success: false,
                message: 'Foundry Sand Testing Note entry not found.'
            });
        }

        res.status(200).json({
            success: true,
            data: entry,
            message: 'Foundry Sand Testing Note entry updated successfully.'
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Error updating Foundry Sand Testing Note entry.',
            errors: error.errors
        });
    }
};

exports.deleteEntry = async (req, res) => {
    try {
        const entry = await FoundrySandTestingNote.findByIdAndDelete(req.params.id);

        if (!entry) {
            return res.status(404).json({
                success: false,
                message: 'Foundry Sand Testing Note entry not found.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Foundry Sand Testing Note entry deleted successfully.'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error deleting Foundry Sand Testing Note entry.'
        });
    }
};


