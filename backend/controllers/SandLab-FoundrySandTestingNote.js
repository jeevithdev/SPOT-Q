const FoundrySandTestingNote = require('../models/SandLab-FoundrySandTestingNote');

exports.getAllEntries = async (req, res) => {
    try {
        const entries = await FoundrySandTestingNote.find().sort({ createdAt: -1 });

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
            // Update existing record based on section
            if (section === 'primary') {
                record.date = searchDate;
                record.shift = String(shift).trim();
                if (otherData.sandPlant) record.sandPlant = String(otherData.sandPlant).trim();
                if (otherData.compactibilitySetting !== undefined) record.compactibilitySetting = String(otherData.compactibilitySetting).trim();
                if (otherData.shearStrengthSetting !== undefined) record.shearStrengthSetting = String(otherData.shearStrengthSetting).trim();
            } else if (section === 'clayParameters') {
                if (otherData.clayTests) {
                    record.clayTests = otherData.clayTests;
                }
            } else if (section === 'sieveTesting') {
                if (otherData.test1) record.test1 = otherData.test1;
                if (otherData.test2) record.test2 = otherData.test2;
                if (otherData.mfTest) record.mfTest = otherData.mfTest;
            } else if (section === 'testParameters') {
                if (otherData.parameters) record.parameters = otherData.parameters;
            } else if (section === 'additionalData') {
                if (otherData.additionalData) record.additionalData = otherData.additionalData;
            } else if (section === 'remarks') {
                if (otherData.remarks !== undefined) record.remarks = String(otherData.remarks).trim();
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


