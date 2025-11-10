const MeltingLogsheet = require('../models/Melting-MeltingLogsheet');

exports.getAllEntries = async (req, res) => {
    try {
        const entries = await MeltingLogsheet.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: entries.length,
            data: entries
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching MeltingLogsheet entries.'
        });
    }
};

exports.createEntry = async (req, res) => {
    try {
        const entry = await MeltingLogsheet.create(req.body);

        res.status(201).json({
            success: true,
            data: entry,
            message: 'MeltingLogsheet entry created successfully.'
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: error.message || 'Error creating MeltingLogsheet entry.',
            errors: error.errors
        });
    }
};

exports.updateEntry = async (req, res) => {
    try {
        const entry = await MeltingLogsheet.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!entry) {
            return res.status(404).json({
                success: false,
                message: 'MeltingLogsheet entry not found.'
            });
        }

        res.status(200).json({
            success: true,
            data: entry,
            message: 'MeltingLogsheet entry updated successfully.'
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: error.message || 'Error updating MeltingLogsheet entry.',
            errors: error.errors
        });
    }
};

exports.deleteEntry = async (req, res) => {
    try {
        const entry = await MeltingLogsheet.findByIdAndDelete(req.params.id);

        if (!entry) {
            return res.status(404).json({
                success: false,
                message: 'MeltingLogsheet entry not found.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'MeltingLogsheet entry deleted successfully.'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error deleting MeltingLogsheet entry.'
        });
    }
};

// @desc    Get primary data by date
// @route   GET /api/v1/melting-logs/primary/:date
// @access  Private
exports.getPrimaryByDate = async (req, res) => {
    try {
        const { date } = req.params;
        
        if (!date) {
            return res.status(400).json({
                success: false,
                message: 'Date parameter is required.'
            });
        }

        const dateObj = new Date(date);
        dateObj.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const entry = await MeltingLogsheet.findOne({
            date: {
                $gte: dateObj,
                $lte: endOfDay
            }
        });

        if (!entry) {
            return res.status(200).json({
                success: true,
                data: null,
                message: 'No entry found for this date.'
            });
        }

        // Extract primary data
        const primaryData = {
            _id: entry._id,
            date: entry.date,
            shift: entry.shift,
            furnaceNo: entry.furnaceNo,
            panel: entry.panel,
            cumulativeLiquidMetal: entry.cumulativeLiquidMetal,
            finalKWHr: entry.finalkwhr,
            initialKWHr: entry.initialkwhr,
            totalUnits: entry.totoalunits,
            cumulativeUnits: entry.cumulativeunits,
            isLocked: entry.isLocked
        };

        res.status(200).json({
            success: true,
            data: primaryData,
            message: 'Primary data fetched successfully.'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching primary data.'
        });
    }
};

// @desc    Create or update primary data with lock/unlock
// @route   POST /api/v1/melting-logs/primary
// @access  Private
exports.createOrUpdatePrimary = async (req, res) => {
    try {
        const { primaryData, isLocked } = req.body;
        const { date } = primaryData;

        if (!date) {
            return res.status(400).json({
                success: false,
                message: 'Date is required.'
            });
        }

        // Parse date
        const dateObj = new Date(date);
        dateObj.setHours(0, 0, 0, 0);

        // Check if entry exists for this date
        let entry = await MeltingLogsheet.findOne({ date: dateObj });

        if (entry) {
            // Update existing entry - only update fields that are provided
            entry.date = dateObj;
            if (primaryData.shift !== undefined) entry.shift = primaryData.shift ?? '';
            if (primaryData.furnaceNo !== undefined) entry.furnaceNo = primaryData.furnaceNo ?? '';
            if (primaryData.panel !== undefined) entry.panel = primaryData.panel ?? '';
            if (primaryData.cumulativeLiquidMetal !== undefined) entry.cumulativeLiquidMetal = (primaryData.cumulativeLiquidMetal !== null && primaryData.cumulativeLiquidMetal !== '') ? primaryData.cumulativeLiquidMetal : 0;
            if (primaryData.finalKWHr !== undefined) entry.finalkwhr = (primaryData.finalKWHr !== null && primaryData.finalKWHr !== '') ? primaryData.finalKWHr : 0;
            if (primaryData.initialKWHr !== undefined) entry.initialkwhr = (primaryData.initialKWHr !== null && primaryData.initialKWHr !== '') ? primaryData.initialKWHr : 0;
            if (primaryData.totalUnits !== undefined) entry.totoalunits = (primaryData.totalUnits !== null && primaryData.totalUnits !== '') ? primaryData.totalUnits : 0;
            if (primaryData.cumulativeUnits !== undefined) entry.cumulativeunits = (primaryData.cumulativeUnits !== null && primaryData.cumulativeUnits !== '') ? primaryData.cumulativeUnits : 0;
            entry.isLocked = isLocked !== undefined ? isLocked : entry.isLocked;
            
            await entry.save();

            return res.status(200).json({
                success: true,
                data: {
                    _id: entry._id,
                    date: entry.date,
                    shift: entry.shift,
                    furnaceNo: entry.furnaceNo,
                    panel: entry.panel,
                    cumulativeLiquidMetal: entry.cumulativeLiquidMetal,
                    finalKWHr: entry.finalkwhr,
                    initialKWHr: entry.initialkwhr,
                    totalUnits: entry.totoalunits,
                    cumulativeUnits: entry.cumulativeunits,
                    isLocked: entry.isLocked
                },
                message: isLocked ? 'Primary data locked successfully.' : 'Primary data updated successfully.'
            });
        }

        // Create new entry
        entry = await MeltingLogsheet.create({
            date: dateObj,
            shift: primaryData.shift || '',
            furnaceNo: primaryData.furnaceNo || '',
            panel: primaryData.panel || '',
            cumulativeLiquidMetal: primaryData.cumulativeLiquidMetal || 0,
            finalkwhr: primaryData.finalKWHr || 0,
            initialkwhr: primaryData.initialKWHr || 0,
            totoalunits: primaryData.totalUnits || 0,
            cumulativeunits: primaryData.cumulativeUnits || 0,
            isLocked: isLocked !== undefined ? isLocked : false
        });

        res.status(201).json({
            success: true,
            data: {
                _id: entry._id,
                date: entry.date,
                shift: entry.shift,
                furnaceNo: entry.furnaceNo,
                panel: entry.panel,
                cumulativeLiquidMetal: entry.cumulativeLiquidMetal,
                finalKWHr: entry.finalkwhr,
                initialKWHr: entry.initialkwhr,
                totalUnits: entry.totoalunits,
                cumulativeUnits: entry.cumulativeunits,
                isLocked: entry.isLocked
            },
            message: isLocked ? 'Primary data created and locked successfully.' : 'Primary data created successfully.'
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: error.message || 'Error saving primary data.',
            errors: error.errors
        });
    }
};

// @desc    Create or update table data by table number
// @route   POST /api/v1/melting-logs/table1-5
// @access  Private
exports.createTableEntry = async (req, res) => {
    try {
        const { tableNum, primaryData, data } = req.body;

        if (!tableNum || !data) {
            return res.status(400).json({
                success: false,
                message: 'Table number and data are required.'
            });
        }

        if (!primaryData || !primaryData.date) {
            return res.status(400).json({
                success: false,
                message: 'Primary data with date is required.'
            });
        }

        // Parse date
        const dateObj = new Date(primaryData.date);
        dateObj.setHours(0, 0, 0, 0);

        // Find existing record by date
        let entry = await MeltingLogsheet.findOne({ date: dateObj });

        if (!entry) {
            return res.status(404).json({
                success: false,
                message: 'Primary data not found for this date. Please save primary data first.'
            });
        }

        // Map table numbers to their data fields
        const updateFields = {};

        if (tableNum === 1) {
            // Table 1 - Charging Details
            updateFields.heatno = data.heatNo || 0;
            updateFields.grade = data.grade || '';
            updateFields.chargingkgs = {
                time: data.chargingTime || '',
                ifbath: data.ifBath || 0,
                liquidmetal: {
                    presspour: data.liquidMetalPressPour || 0,
                    holder: data.liquidMetalHolder || 0
                },
                sqmssteel: data.sgMsSteel || 0,
                greymssteel: data.greyMsSteel || 0,
                returnSg: data.returnsSg || 0,
                pigiron: data.pigIron || 0,
                borings: data.borings || 0,
                finalbath: data.finalBath || 0
            };
        } else if (tableNum === 2) {
            // Table 2 - Additions
            updateFields.charcoal = data.charCoal || 0;
            updateFields.cpc = {
                fur: data.cpcFur || 0,
                lc: data.cpcLc || 0
            };
            updateFields.siliconcarbide = {
                fur: data.siliconCarbideFur || 0
            };
            updateFields.ferroSilicon = {
                fur: data.ferrosiliconFur || 0,
                lc: data.ferrosiliconLc || 0
            };
            updateFields.ferroManganese = {
                fur: data.ferroManganeseFur || 0,
                lc: data.ferroManganeseLc || 0
            };
            updateFields.cu = data.cu || 0;
            updateFields.cr = data.cr || 0;
            updateFields.pureMg = data.pureMg || 0;
            updateFields.ironPyrite = data.ironPyrite || 0;
        } else if (tableNum === 3) {
            // Table 3 - Timing Details
            updateFields.labCoin = {
                time: data.labCoinTime || '',
                tempC: data.labCoinTempC || 0
            };
            updateFields.deslagingTime = {
                from: data.deslagingTimeFrom || '',
                to: data.deslagingTimeTo || ''
            };
            updateFields.metalReadyTime = data.metalReadyTime || '';
            updateFields.waitingForTapping = {
                from: data.waitingForTappingFrom || '',
                to: data.waitingForTappingTo || ''
            };
            updateFields.reason = data.reason || '';
        } else if (tableNum === 4) {
            // Table 4 - Metal Tapping
            updateFields.metalTapping = {
                time: data.time || '',
                tempCSg: data.tempCSg || 0,
                tempCGrey: data.tempCGrey || 0
            };
            updateFields.directFurnace = data.directFurnace || 0;
            updateFields.holderToFurnace = data.holderToFurnace || 0;
            updateFields.furnaceToHolder = data.furnaceToHolder || 0;
            updateFields.disaNo = data.disaNo || '';
            updateFields.item = data.item || '';
        } else if (tableNum === 5) {
            // Table 5 - Electrical Readings
            updateFields.electricalReadings = {
                furnace1: {
                    kw: data.furnace1Kw || 0,
                    a: data.furnace1A || 0,
                    v: data.furnace1V || 0
                },
                furnace2: {
                    kw: data.furnace2Kw || 0,
                    a: data.furnace2A || 0,
                    v: data.furnace2V || 0
                },
                furnace3: {
                    kw: data.furnace3Kw || 0,
                    a: data.furnace3A || 0,
                    v: data.furnace3V || 0
                },
                furnace4: {
                    hz: data.furnace4Hz || 0,
                    gld: data.furnace4Gld || 0,
                    kwhr: data.furnace4KwHr || 0
                }
            };
        } else {
            return res.status(400).json({
                success: false,
                message: `Invalid table number: ${tableNum}. Must be 1-5.`
            });
        }

        // Update entry with table data
        entry = await MeltingLogsheet.findByIdAndUpdate(
            entry._id,
            { $set: updateFields },
            { new: true, runValidators: false }
        );

        res.status(200).json({
            success: true,
            data: entry,
            message: `Table ${tableNum} data saved successfully.`
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: error.message || `Error saving table ${req.body.tableNum} data.`,
            errors: error.errors
        });
    }
};