const SandTestingRecord = require('../models/SandLab-SandTestingRecord');

// @desc    Get all sand testing record entries
// @route   GET /api/sand-testing-records
// @access  Private
const getAllEntries = async (req, res) => {
    try {
        const { 
            startDate, 
            endDate, 
            sortBy = 'date', 
            order = 'desc',
            page = 1,
            limit = 10
        } = req.query;

        // Build query
        let query = {};
        
        // Filter by date range if provided
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        // Calculate pagination
        const skip = (page - 1) * limit;
        const sortOrder = order === 'asc' ? 1 : -1;

        // Execute query
        const entries = await SandTestingRecord.find(query)
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await SandTestingRecord.countDocuments(query);

        res.status(200).json({
            success: true,
            count: entries.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            data: entries
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching Sand Testing Record entries.'
        });
    }
};

// @desc    Get single sand testing record entry by ID
// @route   GET /api/sand-testing-records/:id
// @access  Private
const getEntryById = async (req, res) => {
    try {
        const entry = await SandTestingRecord.findById(req.params.id);

        if (!entry) {
            return res.status(404).json({
                success: false,
                message: 'Sand Testing Record entry not found.'
            });
        }

        res.status(200).json({
            success: true,
            data: entry
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching Sand Testing Record entry.'
        });
    }
};

// @desc    Get sand testing records by date
// @route   GET /api/sand-testing-records/date/:date
// @access  Private
const getEntriesByDate = async (req, res) => {
    try {
        const { date } = req.params;
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const entries = await SandTestingRecord.find({
            date: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        }).sort({ date: -1 });

        res.status(200).json({
            success: true,
            count: entries.length,
            data: entries
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching Sand Testing Record entries by date.'
        });
    }
};

// @desc    Create or update primary data (date)
// @route   POST /api/v1/sand-testing-records/primary
// @access  Private
const createPrimaryEntry = async (req, res) => {
    try {
        const { data } = req.body;
        const { date } = data;

        if (!date) {
            return res.status(400).json({
                success: false,
                message: 'Date is required.'
            });
        }

        // Parse date
        const dateObj = new Date(date);
        dateObj.setHours(0, 0, 0, 0);

        // Check if primary data already exists for this date
        const existing = await SandTestingRecord.findOne({ date: dateObj });

        if (existing) {
            // Update existing entry with primary data only
            existing.date = dateObj;
            await existing.save();

            return res.status(200).json({
                success: true,
                data: existing,
                message: 'Primary data updated successfully.'
            });
        }

        // Create new entry with primary data
        const entry = await SandTestingRecord.create({ date: dateObj });

        res.status(201).json({
            success: true,
            data: entry,
            message: 'Primary data saved successfully.'
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
// @route   POST /api/v1/sand-testing-records/table1-5
// @access  Private
const createTableEntry = async (req, res) => {
    try {
        const { tableNum, data } = req.body;

        if (!tableNum || !data) {
            return res.status(400).json({
                success: false,
                message: 'Table number and data are required.'
            });
        }

        // Map table numbers to their data fields
        const tableFields = {
            1: { sandShifts: data },
            2: { clayShifts: data },
            3: { mixshifts: data },
            4: { sandLump: data.sandLump, newSandWt: data.newSandWt, sandFriability: data.sandFriability },
            5: { testParameter: data }
        };

        const updateFields = tableFields[tableNum];

        if (!updateFields) {
            return res.status(400).json({
                success: false,
                message: `Invalid table number: ${tableNum}. Must be 1-5.`
            });
        }

        // Find existing record by date if provided, or create new one
        let entry;
        if (data.date) {
            const dateObj = new Date(data.date);
            dateObj.setHours(0, 0, 0, 0);
            
            entry = await SandTestingRecord.findOne({ date: dateObj });
            
            if (entry) {
                // Update existing entry with table data using $set
                entry = await SandTestingRecord.findOneAndUpdate(
                    { date: dateObj },
                    { $set: updateFields },
                    { new: true, runValidators: false }
                );
            } else {
                // Create new entry with date and table data
                entry = await SandTestingRecord.create({ date: dateObj, ...updateFields });
            }
        } else {
            // If no date, try to find most recent entry or create new one
            entry = await SandTestingRecord.findOne().sort({ createdAt: -1 });
            
            if (entry) {
                // Update existing entry with table data using $set
                entry = await SandTestingRecord.findByIdAndUpdate(
                    entry._id,
                    { $set: updateFields },
                    { new: true, runValidators: false }
                );
            } else {
                // Initialize with defaults for all fields
                const newEntryData = {
                    sandShifts: {
                        shiftI: { rSand: '', nSand: '', mixingMode: '', bentonite: '', coalDustPremix: '', batchNo: { bentonite: '', coalDustPremix: '' } },
                        shiftII: { rSand: '', nSand: '', mixingMode: '', bentonite: '', coalDustPremix: '', batchNo: { bentonite: '', coalDustPremix: '' } },
                        shiftIII: { rSand: '', nSand: '', mixingMode: '', bentonite: '', coalDustPremix: '', batchNo: { bentonite: '', coalDustPremix: '' } }
                    },
                    clayShifts: {
                        shiftI: { totalClay: '', activeClay: '', deadClay: '', vcm: '', loi: '', afsNo: '', fines: '' },
                        ShiftII: { totalClay: '', activeClay: '', deadClay: '', vcm: '', loi: '', afsNo: '', fines: '' },
                        ShiftIII: { totalClay: '', activeClay: '', deadClay: '', vcm: '', loi: '', afsNo: '', fines: '' }
                    },
                    mixshifts: {
                        ShiftI: { mixno: { start: '', end: '', total: '' }, numberOfMixRejected: 0, returnSandHopperLevel: 0 },
                        ShiftII: { mixno: { start: '', end: '', total: '' }, numberOfMixRejected: '', returnSandHopperLevel: 0 },
                        ShiftIII: { mixno: { start: '', end: '', total: '' }, numberOfMixRejected: 0, returnSandHopperLevel: 0 }
                    },
                    sandLump: '',
                    newSandWt: '',
                    sandFriability: { shiftI: '', shiftII: '', shiftIII: '' },
                    testParameter: {
                        sno: 0, time: 0, mixno: 0, permeability: 0, gcsFdyA: 0, gcsFdyB: 0, wts: 0, moisture: 0,
                        compactability: 0, compressibility: 0, waterLitre: 0,
                        sandTemp: { BC: 0, WU: 0, SSUmax: 0 },
                        newSandKgs: 0, mould: 0,
                        bentoniteWithPremix: { Kgs: 0, Percent: 0 },
                        bentonite: { Kgs: 0, Percent: 0 },
                        premix: { Kgs: 0, Percent: 0 },
                        coalDust: { Kgs: 0, Percent: 0 },
                        lc: 0, CompactabilitySettings: 0, mouldStrength: 0, shearStrengthSetting: 0,
                        preparedSandlumps: 0, itemName: '', remarks: ''
                    },
                    ...updateFields
                };
                entry = await SandTestingRecord.create(newEntryData);
            }
        }

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

// @desc    Create new sand testing record entry
// @route   POST /api/sand-testing-records
// @access  Private
const createEntry = async (req, res) => {
    try {
        // Validate required fields
        const requiredFields = ['testParameter'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        const entry = await SandTestingRecord.create(req.body);

        res.status(201).json({
            success: true,
            data: entry,
            message: 'Sand Testing Record entry created successfully.'
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Error creating Sand Testing Record entry.',
            errors: error.errors
        });
    }
};

// @desc    Update sand testing record entry
// @route   PUT /api/sand-testing-records/:id
// @access  Private
const updateEntry = async (req, res) => {
    try {
        const entry = await SandTestingRecord.findByIdAndUpdate(
            req.params.id,
            req.body,
            { 
                new: true, 
                runValidators: true,
                context: 'query'
            }
        );

        if (!entry) {
            return res.status(404).json({
                success: false,
                message: 'Sand Testing Record entry not found.'
            });
        }

        res.status(200).json({
            success: true,
            data: entry,
            message: 'Sand Testing Record entry updated successfully.'
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Error updating Sand Testing Record entry.',
            errors: error.errors
        });
    }
};

// @desc    Partially update sand testing record entry
// @route   PATCH /api/sand-testing-records/:id
// @access  Private
const patchEntry = async (req, res) => {
    try {
        const entry = await SandTestingRecord.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { 
                new: true, 
                runValidators: false  // Less strict for partial updates
            }
        );

        if (!entry) {
            return res.status(404).json({
                success: false,
                message: 'Sand Testing Record entry not found.'
            });
        }

        res.status(200).json({
            success: true,
            data: entry,
            message: 'Sand Testing Record entry partially updated successfully.'
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Error partially updating Sand Testing Record entry.',
            errors: error.errors
        });
    }
};

// @desc    Delete sand testing record entry
// @route   DELETE /api/sand-testing-records/:id
// @access  Private
const deleteEntry = async (req, res) => {
    try {
        const entry = await SandTestingRecord.findByIdAndDelete(req.params.id);

        if (!entry) {
            return res.status(404).json({
                success: false,
                message: 'Sand Testing Record entry not found.'
            });
        }

        res.status(200).json({
            success: true,
            data: {},
            message: 'Sand Testing Record entry deleted successfully.'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error deleting Sand Testing Record entry.'
        });
    }
};

// @desc    Delete multiple sand testing record entries
// @route   DELETE /api/sand-testing-records/bulk
// @access  Private
const bulkDeleteEntries = async (req, res) => {
    try {
        const { ids } = req.body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an array of IDs to delete.'
            });
        }

        const result = await SandTestingRecord.deleteMany({
            _id: { $in: ids }
        });

        res.status(200).json({
            success: true,
            message: `${result.deletedCount} Sand Testing Record entries deleted successfully.`,
            deletedCount: result.deletedCount
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error deleting Sand Testing Record entries.'
        });
    }
};

// @desc    Get statistics for sand testing records
// @route   GET /api/sand-testing-records/stats
// @access  Private
const getStats = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        // Build query
        let query = {};
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        const totalRecords = await SandTestingRecord.countDocuments(query);

        // Calculate average values for key parameters
        const avgStats = await SandTestingRecord.aggregate([
            { $match: query },
            {
                $group: {
                    _id: null,
                    avgPermeability: { $avg: '$testParameter.permeability' },
                    avgMoisture: { $avg: '$testParameter.moisture' },
                    avgCompactability: { $avg: '$testParameter.compactability' },
                    avgCompressibility: { $avg: '$testParameter.compressibility' },
                    avgGcsFdyA: { $avg: '$testParameter.gcsFdyA' },
                    avgGcsFdyB: { $avg: '$testParameter.gcsFdyB' }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalRecords,
                averages: avgStats[0] || {}
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching statistics.'
        });
    }
};

module.exports = {
    getAllEntries,
    getEntryById,
    getEntriesByDate,
    createPrimaryEntry,
    createTableEntry,
    createEntry,
    updateEntry,
    patchEntry,
    deleteEntry,
    bulkDeleteEntries,
    getStats
};

