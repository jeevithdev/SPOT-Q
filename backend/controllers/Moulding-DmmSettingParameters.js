const DmmSettingParameters = require('../models/Moulding-DmmSettingParameters');

// Create new DMM Setting Parameters record or update existing
const createDMMSettings = async (req, res) => {
    try {
        const { date, machine, section } = req.body;
        
        if (!date || !machine) {
            return res.status(400).json({
                success: false,
                message: 'Date and machine are required.'
            });
        }

        // Normalize date to start of day for comparison
        const searchDate = new Date(date);
        searchDate.setHours(0, 0, 0, 0);
        const endOfDay = new Date(searchDate);
        endOfDay.setHours(23, 59, 59, 999);

        // Check if record exists with this date + machine combination (primary identifier)
        let record = await DmmSettingParameters.findOne({
            date: {
                $gte: searchDate,
                $lte: endOfDay
            },
            machine: String(machine).trim()
        });

        if (record) {
            // Update existing record based on section
            if (section === 'primary') {
                // Date can always be updated (it's always editable)
                if (req.body.date !== undefined) {
                    record.date = searchDate;
                }
                // Machine can only be updated if it's sent (unlocked field)
                if (req.body.machine !== undefined) {
                    const existingMachine = String(record.machine || '').trim();
                    const newMachine = String(machine).trim();
                    if (existingMachine !== newMachine) {
                        record.machine = newMachine;
                    }
                }
            } else if (section === 'operation') {
                // Update operation data (shifts) - merge with existing data
                if (req.body.shifts) {
                    if (!record.shifts) {
                        record.shifts = {
                            shift1: { operatorName: '', checkedBy: '' },
                            shift2: { operatorName: '', checkedBy: '' },
                            shift3: { operatorName: '', checkedBy: '' }
                        };
                    }
                    
                    // Update each shift that has data in payload
                    ['shift1', 'shift2', 'shift3'].forEach(shiftKey => {
                        if (req.body.shifts[shiftKey]) {
                            const shiftPayload = req.body.shifts[shiftKey];
                            if (shiftPayload.operatorName !== undefined) {
                                record.shifts[shiftKey].operatorName = String(shiftPayload.operatorName).trim();
                            }
                            if (shiftPayload.checkedBy !== undefined) {
                                record.shifts[shiftKey].checkedBy = String(shiftPayload.checkedBy).trim();
                            }
                        }
                    });
                }
            } else if (section === 'shift1' || section === 'shift2' || section === 'shift3') {
                // Append new shift parameter entry (don't overwrite)
                if (req.body.parameters && req.body.parameters[section]) {
                    const shiftParams = req.body.parameters[section];
                    
                    // Initialize parameters if they don't exist
                    if (!record.parameters) {
                        record.parameters = {
                            shift1: [],
                            shift2: [],
                            shift3: []
                        };
                    }
                    
                    // Initialize the specific shift array if it doesn't exist
                    if (!record.parameters[section]) {
                        record.parameters[section] = [];
                    }
                    
                    // Calculate next sNo
                    const existingEntries = record.parameters[section] || [];
                    const maxSNo = existingEntries.length > 0 
                        ? Math.max(...existingEntries.map(entry => entry.sNo || 0))
                        : 0;
                    const nextSNo = maxSNo + 1;
                    
                    // Create new entry object
                    const newEntry = {
                        sNo: nextSNo,
                        customer: String(shiftParams.customer || '').trim(),
                        itemDescription: String(shiftParams.itemDescription || '').trim(),
                        time: String(shiftParams.time || '').trim(),
                        ppThickness: parseFloat(shiftParams.ppThickness) || 0,
                        spThickness: parseFloat(shiftParams.spThickness) || 0,
                        spHeight: parseFloat(shiftParams.spHeight) || 0,
                        CoreMaskThickness: parseFloat(shiftParams.spCoreMaskThickness || shiftParams.ppCoreMaskThickness) || 0,
                        CoreMaskHeight: parseFloat(shiftParams.spCoreMaskHeight || shiftParams.ppCoreMaskHeight) || 0,
                        sandShotPressurebar: parseFloat(shiftParams.sandShotPressureBar) || 0,
                        correctionShotTime: parseFloat(shiftParams.correctionShotTime) || 0,
                        squeezePressure: parseFloat(shiftParams.squeezePressure) || 0,
                        ppStrippingAcceleration: parseFloat(shiftParams.ppStrippingAcceleration) || 0,
                        ppStrippingDistance: parseFloat(shiftParams.ppStrippingDistance) || 0,
                        spStrippingAcceleration: parseFloat(shiftParams.spStrippingAcceleration) || 0,
                        spStrippingDistance: parseFloat(shiftParams.spStrippingDistance) || 0,
                        mouldThickness: parseFloat(shiftParams.mouldThicknessPlus10) || 0,
                        closeUpForceMouldCloseUpPressure: String(shiftParams.closeUpForceMouldCloseUpPressure || '').trim(),
                        remarks: String(shiftParams.remarks || '').trim()
                    };
                    
                    // Handle ppHeight (and ppheight for shift1)
                    if (shiftParams.ppHeight !== undefined) {
                        newEntry.ppHeight = parseFloat(shiftParams.ppHeight) || 0;
                        if (section === 'shift1') {
                            newEntry.ppheight = parseFloat(shiftParams.ppHeight) || 0;
                        }
                    }
                    
                    // Append new entry to the array
                    record.parameters[section].push(newEntry);
                }
            }
            // Add other section updates here as needed
            
            await record.save();
            return res.status(200).json({
                success: true,
                data: record,
                message: 'DMM Settings updated successfully.'
            });
        } else {
            // Create new record with primary data
            // Initialize with default values for shifts and parameters to satisfy schema requirements
            const newSettingsData = {
                date: searchDate,
                machine: String(machine).trim(),
                // Initialize shifts with defaults
                shifts: {
                    shift1: { operatorName: '', checkedBy: '' },
                    shift2: { operatorName: '', checkedBy: '' },
                    shift3: { operatorName: '', checkedBy: '' }
                },
                // Initialize parameters with empty arrays for all shifts
                parameters: {
                    shift1: [],
                    shift2: [],
                    shift3: []
                }
            };
            
            // Override with operation data if section is 'operation'
            if (section === 'operation' && req.body.shifts) {
                // Set values from payload
                ['shift1', 'shift2', 'shift3'].forEach(shiftKey => {
                    if (req.body.shifts[shiftKey]) {
                        const shiftPayload = req.body.shifts[shiftKey];
                        if (shiftPayload.operatorName !== undefined) {
                            newSettingsData.shifts[shiftKey].operatorName = String(shiftPayload.operatorName).trim();
                        }
                        if (shiftPayload.checkedBy !== undefined) {
                            newSettingsData.shifts[shiftKey].checkedBy = String(shiftPayload.checkedBy).trim();
                        }
                    }
                });
            }
            
            // Override with shift parameters if section is shift1, shift2, or shift3
            if ((section === 'shift1' || section === 'shift2' || section === 'shift3') && req.body.parameters && req.body.parameters[section]) {
                const shiftParams = req.body.parameters[section];
                
                // Create new entry with sNo = 1 (first entry)
                const newEntry = {
                    sNo: 1,
                    customer: String(shiftParams.customer || '').trim(),
                    itemDescription: String(shiftParams.itemDescription || '').trim(),
                    time: String(shiftParams.time || '').trim(),
                    ppThickness: parseFloat(shiftParams.ppThickness) || 0,
                    spThickness: parseFloat(shiftParams.spThickness) || 0,
                    spHeight: parseFloat(shiftParams.spHeight) || 0,
                    CoreMaskThickness: parseFloat(shiftParams.spCoreMaskThickness || shiftParams.ppCoreMaskThickness) || 0,
                    CoreMaskHeight: parseFloat(shiftParams.spCoreMaskHeight || shiftParams.ppCoreMaskHeight) || 0,
                    sandShotPressurebar: parseFloat(shiftParams.sandShotPressureBar) || 0,
                    correctionShotTime: parseFloat(shiftParams.correctionShotTime) || 0,
                    squeezePressure: parseFloat(shiftParams.squeezePressure) || 0,
                    ppStrippingAcceleration: parseFloat(shiftParams.ppStrippingAcceleration) || 0,
                    ppStrippingDistance: parseFloat(shiftParams.ppStrippingDistance) || 0,
                    spStrippingAcceleration: parseFloat(shiftParams.spStrippingAcceleration) || 0,
                    spStrippingDistance: parseFloat(shiftParams.spStrippingDistance) || 0,
                    mouldThickness: parseFloat(shiftParams.mouldThicknessPlus10) || 0,
                    closeUpForceMouldCloseUpPressure: String(shiftParams.closeUpForceMouldCloseUpPressure || '').trim(),
                    remarks: String(shiftParams.remarks || '').trim()
                };
                
                // Handle ppHeight (and ppheight for shift1)
                if (shiftParams.ppHeight !== undefined) {
                    newEntry.ppHeight = parseFloat(shiftParams.ppHeight) || 0;
                    if (section === 'shift1') {
                        newEntry.ppheight = parseFloat(shiftParams.ppHeight) || 0;
                    }
                }
                
                // Add entry to array
                newSettingsData.parameters[section] = [newEntry];
            }

            const newSettings = new DmmSettingParameters(newSettingsData);
            const savedSettings = await newSettings.save();
            return res.status(201).json({
                success: true,
                data: savedSettings,
                message: 'DMM Settings created successfully.'
            });
        }
    } catch (error) {
        // Handle duplicate key error (date + machine combination already exists)
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'A record with this date and machine combination already exists.'
            });
        }
        res.status(400).json({ 
            success: false,
            message: error.message 
        });
    }
};

// Get all DMM Setting Parameters records
const getAllDMMSettings = async (req, res) => {
    try {
        const settings = await DmmSettingParameters.find().sort({ date: -1 });
        res.status(200).json({
            success: true,
            count: settings.length,
            data: settings
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// Get DMM Setting Parameters by ID
const getDMMSettingsById = async (req, res) => {
    try {
        const settings = await DmmSettingParameters.findById(req.params.id);
        if (!settings) {
            return res.status(404).json({ 
                success: false,
                message: 'Settings not found' 
            });
        }
        res.status(200).json({
            success: true,
            data: settings
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// Get DMM Settings by Date Range
const getDMMSettingsByDateRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const settings = await DmmSettingParameters.find({
            date: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        }).sort({ date: -1 });
        res.status(200).json({
            success: true,
            count: settings.length,
            data: settings
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// Get DMM Settings by Machine
const getDMMSettingsByMachine = async (req, res) => {
    try {
        const { machine, date } = req.query;
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const settings = await DmmSettingParameters.find({
            machine: machine,
            date: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        });
        res.status(200).json({
            success: true,
            count: settings.length,
            data: settings
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// Get DMM Settings by Shift
const getDMMSettingsByShift = async (req, res) => {
    try {
        const { shift, date } = req.query;
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const settings = await DmmSettingParameters.find({
            'parameters.shift': shift,
            date: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        });
        res.status(200).json({
            success: true,
            count: settings.length,
            data: settings
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// Get Parameters by Customer
const getDMMSettingsByCustomer = async (req, res) => {
    try {
        const { customer } = req.query;
        const settings = await DmmSettingParameters.find({
            'parameters.customer': customer
        }).sort({ date: -1 });
        res.status(200).json({
            success: true,
            count: settings.length,
            data: settings
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// Get DMM Settings by Primary (date + machine)
const getDMMSettingsByPrimary = async (req, res) => {
    try {
        const { date, machine } = req.query;
        
        if (!date || !machine) {
            return res.status(400).json({
                success: false,
                message: 'Date and machine are required.'
            });
        }

        const searchDate = new Date(date);
        searchDate.setHours(0, 0, 0, 0);
        const endOfDay = new Date(searchDate);
        endOfDay.setHours(23, 59, 59, 999);

        const settings = await DmmSettingParameters.find({
            date: {
                $gte: searchDate,
                $lte: endOfDay
            },
            machine: String(machine).trim()
        }).sort({ date: -1 });

        res.status(200).json({
            success: true,
            count: settings.length,
            data: settings
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// Update DMM Setting Parameters
const updateDMMSettings = async (req, res) => {
    try {
        const updatedSettings = await DmmSettingParameters.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedSettings) {
            return res.status(404).json({ 
                success: false,
                message: 'Settings not found' 
            });
        }
        res.status(200).json({
            success: true,
            data: updatedSettings,
            message: 'DMM Settings updated successfully.'
        });
    } catch (error) {
        res.status(400).json({ 
            success: false,
            message: error.message 
        });
    }
};

// Delete DMM Setting Parameters
const deleteDMMSettings = async (req, res) => {
    try {
        const settings = await DmmSettingParameters.findByIdAndDelete(req.params.id);
        if (!settings) {
            return res.status(404).json({ 
                success: false,
                message: 'Settings not found' 
            });
        }
        res.status(200).json({ 
            success: true,
            message: 'Settings deleted successfully' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

module.exports = {
    createDMMSettings,
    getAllDMMSettings,
    getDMMSettingsById,
    getDMMSettingsByDateRange,
    getDMMSettingsByMachine,
    getDMMSettingsByShift,
    getDMMSettingsByCustomer,
    getDMMSettingsByPrimary,
    updateDMMSettings,
    deleteDMMSettings
};
