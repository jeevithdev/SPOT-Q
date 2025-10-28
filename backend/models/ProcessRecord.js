const mongoose = require('mongoose');

const processRecordSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  processType: {
    type: String,
    required: true,
    enum: ['Melting', 'Molding', 'Casting', 'Machining', 'Heat Treatment', 'Quality Check']
  },
  machine: {
    type: String,
    required: true
  },
  operator: {
    type: String,
    required: true
  },
  partName: {
    type: String,
    required: true
  },
  batchNumber: {
    type: String,
    required: true
  },
  temperature: {
    type: Number,
    required: true
  },
  pressure: {
    type: Number,
    required: true
  },
  cycleTime: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['In Progress', 'Completed', 'On Hold', 'Failed'],
    default: 'In Progress'
  },
  remarks: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for faster queries
processRecordSchema.index({ date: -1 });
processRecordSchema.index({ processType: 1 });
processRecordSchema.index({ status: 1 });
processRecordSchema.index({ batchNumber: 1 });

module.exports = mongoose.model('ProcessRecord', processRecordSchema);

