const Impact = require('../models/Impact');

// Helper function to get start and end of day in UTC
const getDateRange = (dateString) => {
    const [year, month, day] = dateString.split('-').map(Number);
    const startOfDay = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
    const endOfDay = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));
    return { startOfDay, endOfDay };
};

// Helper function to ensure document exists for a date
const ensureDateDocument = async (dateString) => {
    const [year, month, day] = dateString.split('-').map(Number);
    const dateObj = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));

    // Find or create document for this date
    let document = await Impact.findOne({ date: dateObj });

    if (!document) {
        document = await Impact.create({
            date: dateObj,
            entries: []
        });
    }

    return document;
};

// Initialize current date entry on server startup
exports.initializeTodayEntry = async () => {
    try {
        const today = new Date();
        const todayString = today.toISOString().split('T')[0];
        await ensureDateDocument(todayString);
        console.log('');
    } catch (error) {
        console.error('Error initializing today\'s Impact document:', error.message);
    }
};

// Get current date from server (ensures timezone consistency)
exports.getCurrentDate = async (req, res) => {
    try {
        const now = new Date();
        const todayString = now.toISOString().split('T')[0];

        // Ensure document exists for today
        await ensureDateDocument(todayString);

        res.status(200).json({
            success: true,
            date: todayString
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching current date.'
        });
    }
};

// Get all dates with entry counts (for report view)
exports.getGroupedByDate = async (req, res) => {
    try {
        const documents = await Impact.find()
            .select('date entries')
            .sort({ date: -1 });

        const grouped = documents.map(doc => ({
            date: doc.date.toISOString().split('T')[0],
            count: doc.entries.length,
            hasData: doc.entries.length
        }));

        res.status(200).json({
            success: true,
            count: grouped.length,
            data: grouped
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching grouped dates.'
        });
    }
};

// Get entries by specific date
exports.getEntriesByDate = async (req, res) => {
    try {
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({
                success: false,
                message: 'Date parameter is required.'
            });
        }

        // Ensure document exists for current and future dates
        const now = new Date();
        const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
        const [year, month, day] = date.split('-').map(Number);
        const queryDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));

        if (queryDate >= today) {
            await ensureDateDocument(date);
        }

        // Find document for this date
        const document = await Impact.findOne({ date: queryDate });

        res.status(200).json({
            success: true,
            count: document ? document.entries.length : 0,
            data: document ? document.entries : []
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching entries by date.'
        });
    }
};

// Create new entry (add to array for the date)
exports.createEntry = async (req, res) => {
    try {
        const { date, partName, dateCode, specification, observedValue, remarks } = req.body;

        // Validate required fields
        if (!date) {
            return res.status(400).json({
                success: false,
                message: 'Date is required.'
            });
        }

        if (!partName || !dateCode || !specification || observedValue === undefined || observedValue === null) {
            return res.status(400).json({
                success: false,
                message: 'All fields (partName, dateCode, specification, observedValue) are required.'
            });
        }

        // Parse date in UTC
        const [year, month, day] = date.split('-').map(Number);
        const dateObj = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));

        // Find or create document for this date
        let document = await Impact.findOne({ date: dateObj });

        if (!document) {
            document = await Impact.create({
                date: dateObj,
                entries: []
            });
        }

        // Add new entry to the array
        const newEntry = {
            partName,
            dateCode,
            specification,
            observedValue,
            remarks: remarks || ''
        };

        document.entries.push(newEntry);
        await document.save();

        // Get the newly added entry (last one in array)
        const addedEntry = document.entries[document.entries.length - 1];

        res.status(201).json({
            success: true,
            data: addedEntry,
            message: 'Impact entry created successfully.'
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Error creating Impact entry.',
            errors: error.errors
        });
    }
};

// Update an entry in the array
exports.updateEntry = async (req, res) => {
    try {
        const { id } = req.params;
        const { partName, dateCode, specification, observedValue, remarks } = req.body;

        // Find document containing this entry
        const document = await Impact.findOne({ 'entries._id': id });

        if (!document) {
            return res.status(404).json({
                success: false,
                message: 'Impact entry not found.'
            });
        }

        // Find the specific entry in the array
        const entry = document.entries.id(id);

        if (!entry) {
            return res.status(404).json({
                success: false,
                message: 'Impact entry not found.'
            });
        }

        // Update the entry
        if (partName !== undefined) entry.partName = partName;
        if (dateCode !== undefined) entry.dateCode = dateCode;
        if (specification !== undefined) entry.specification = specification;
        if (observedValue !== undefined) entry.observedValue = observedValue;
        if (remarks !== undefined) entry.remarks = remarks;

        await document.save();

        res.status(200).json({
            success: true,
            data: entry,
            message: 'Impact entry updated successfully.'
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Error updating Impact entry.',
            errors: error.errors
        });
    }
};

// Delete an entry from the array
exports.deleteEntry = async (req, res) => {
    try {
        const { id } = req.params;

        // Find document containing this entry
        const document = await Impact.findOne({ 'entries._id': id });

        if (!document) {
            return res.status(404).json({
                success: false,
                message: 'Impact entry not found.'
            });
        }

        // Remove the entry from the array
        document.entries.pull(id);
        await document.save();

        res.status(200).json({
            success: true,
            message: 'Impact entry deleted successfully.'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error deleting Impact entry.'
        });
    }
};

// Filter entries by date range
exports.filterEntries = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate) {
            return res.status(400).json({
                success: false,
                message: 'Start date is required'
            });
        }

        // Parse dates
        const [startYear, startMonth, startDay] = startDate.split('-').map(Number);
        const start = new Date(Date.UTC(startYear, startMonth - 1, startDay, 0, 0, 0, 0));

        let end;
        if (endDate) {
            const [endYear, endMonth, endDay] = endDate.split('-').map(Number);
            end = new Date(Date.UTC(endYear, endMonth - 1, endDay, 23, 59, 59, 999));
        } else {
            // If no end date, use end of start date
            end = new Date(Date.UTC(startYear, startMonth - 1, startDay, 23, 59, 59, 999));
        }

        // Find all documents in date range
        const documents = await Impact.find({
            date: {
                $gte: start,
                $lte: end
            }
        }).sort({ date: -1 });

        // Flatten all entries from all documents
        let allEntries = [];
        documents.forEach(doc => {
            if (doc.entries && doc.entries.length > 0) {
                const entriesWithDate = doc.entries.map(entry => ({
                    ...entry.toObject(),
                    date: doc.date
                }));
                allEntries = allEntries.concat(entriesWithDate);
            }
        });

        res.status(200).json({
            success: true,
            count: allEntries.length,
            data: allEntries
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error filtering entries'
        });
    }
};

// Get all entries (for backward compatibility if needed)
exports.getAllEntries = async (req, res) => {
    try {
        const documents = await Impact.find().sort({ date: -1 });

        // Flatten all entries from all documents
        const allEntries = [];
        documents.forEach(doc => {
            doc.entries.forEach(entry => {
                allEntries.push({
                    _id: entry._id,
                    date: doc.date,
                    partName: entry.partName,
                    dateCode: entry.dateCode,
                    specification: entry.specification,
                    observedValue: entry.observedValue,
                    remarks: entry.remarks,
                    createdAt: entry.createdAt,
                    updatedAt: entry.updatedAt
                });
            });
        });

        res.status(200).json({
            success: true,
            count: allEntries.length,
            data: allEntries
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching Impact entries.'
        });
    }
};
