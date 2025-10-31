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
    createEntry,
    updateEntry,
    patchEntry,
    deleteEntry,
    bulkDeleteEntries,
    getStats
};

