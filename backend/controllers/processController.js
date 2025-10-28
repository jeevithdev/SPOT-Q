const ProcessRecord = require('../models/ProcessRecord');

// Create a new process record
exports.createProcessRecord = async (req, res) => {
  try {
    const {
      date,
      processType,
      machine,
      operator,
      partName,
      batchNumber,
      temperature,
      pressure,
      cycleTime,
      quantity,
      status,
      remarks
    } = req.body;

    // Validate required fields
    if (!date || !processType || !machine || !operator || !partName || 
        !batchNumber || temperature === undefined || pressure === undefined || 
        cycleTime === undefined || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    // Create new process record
    const processRecord = new ProcessRecord({
      date,
      processType,
      machine,
      operator,
      partName,
      batchNumber,
      temperature,
      pressure,
      cycleTime,
      quantity,
      status: status || 'In Progress',
      remarks: remarks || ''
    });

    await processRecord.save();

    res.status(201).json({
      success: true,
      message: 'Process record created successfully',
      data: processRecord
    });
  } catch (error) {
    console.error('Error creating process record:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating process record',
      error: error.message
    });
  }
};

// Get all process records
exports.getAllProcessRecords = async (req, res) => {
  try {
    const processRecords = await ProcessRecord.find()
      .sort({ date: -1, createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: processRecords.length,
      data: processRecords
    });
  } catch (error) {
    console.error('Error fetching process records:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching process records',
      error: error.message
    });
  }
};

// Get process record by ID
exports.getProcessRecordById = async (req, res) => {
  try {
    const { id } = req.params;

    const processRecord = await ProcessRecord.findById(id);

    if (!processRecord) {
      return res.status(404).json({
        success: false,
        message: 'Process record not found'
      });
    }

    res.status(200).json({
      success: true,
      data: processRecord
    });
  } catch (error) {
    console.error('Error fetching process record:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching process record',
      error: error.message
    });
  }
};

// Update process record
exports.updateProcessRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const processRecord = await ProcessRecord.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!processRecord) {
      return res.status(404).json({
        success: false,
        message: 'Process record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Process record updated successfully',
      data: processRecord
    });
  } catch (error) {
    console.error('Error updating process record:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating process record',
      error: error.message
    });
  }
};

// Delete process record
exports.deleteProcessRecord = async (req, res) => {
  try {
    const { id } = req.params;

    const processRecord = await ProcessRecord.findByIdAndDelete(id);

    if (!processRecord) {
      return res.status(404).json({
        success: false,
        message: 'Process record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Process record deleted successfully',
      data: processRecord
    });
  } catch (error) {
    console.error('Error deleting process record:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting process record',
      error: error.message
    });
  }
};

// Filter process records by date range
exports.filterProcessRecords = async (req, res) => {
  try {
    const { startDate, endDate, processType, status } = req.query;

    let query = {};

    // Date range filter
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }

    // Process type filter
    if (processType) {
      query.processType = processType;
    }

    // Status filter
    if (status) {
      query.status = status;
    }

    const processRecords = await ProcessRecord.find(query)
      .sort({ date: -1, createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: processRecords.length,
      data: processRecords
    });
  } catch (error) {
    console.error('Error filtering process records:', error);
    res.status(500).json({
      success: false,
      message: 'Error filtering process records',
      error: error.message
    });
  }
};

// Get process statistics
exports.getProcessStatistics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let dateFilter = {};
    if (startDate || endDate) {
      dateFilter.date = {};
      if (startDate) dateFilter.date.$gte = new Date(startDate);
      if (endDate) dateFilter.date.$lte = new Date(endDate);
    }

    const stats = await ProcessRecord.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          totalRecords: { $sum: 1 },
          totalQuantity: { $sum: '$quantity' },
          avgTemperature: { $avg: '$temperature' },
          avgPressure: { $avg: '$pressure' },
          avgCycleTime: { $avg: '$cycleTime' },
          statusBreakdown: {
            $push: '$status'
          },
          processTypeBreakdown: {
            $push: '$processType'
          }
        }
      }
    ]);

    // Count status occurrences
    const statusCounts = {};
    const processTypeCounts = {};

    if (stats.length > 0) {
      stats[0].statusBreakdown.forEach(status => {
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });

      stats[0].processTypeBreakdown.forEach(type => {
        processTypeCounts[type] = (processTypeCounts[type] || 0) + 1;
      });
    }

    res.status(200).json({
      success: true,
      data: stats.length > 0 ? {
        ...stats[0],
        statusBreakdown: statusCounts,
        processTypeBreakdown: processTypeCounts
      } : {
        totalRecords: 0,
        totalQuantity: 0,
        avgTemperature: 0,
        avgPressure: 0,
        avgCycleTime: 0,
        statusBreakdown: {},
        processTypeBreakdown: {}
      }
    });
  } catch (error) {
    console.error('Error getting process statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting process statistics',
      error: error.message
    });
  }
};

