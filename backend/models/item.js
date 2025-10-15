const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  machine: {
    type: String,
    required: [true, 'Machine is required'],
    trim: true
  },
  ppNo: {
    type: String,
    required: [true, 'PP No is required'],
    trim: true
  },
  partName: {
    type: String,
    required: [true, 'Part Name is required'],
    trim: true
  },
  dateCode: {
    type: String,
    required: [true, 'Date Code is required'],
    trim: true
  },
  heatCode: {
    type: String,
    required: [true, 'Heat Code is required'],
    trim: true
  },
  timeOfPouring: {
    type: String,
    required: [true, 'Time of Pouring is required'],
    trim: true
  },
  pcNo: {
    type: String,
    required: [true, 'PC No is required'],
    trim: true
  },
  heatNo: {
    type: String,
    required: [true, 'Heat No is required'],
    trim: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields automatically
});

// Add indexes for better query performance
itemSchema.index({ date: 1 });
itemSchema.index({ machine: 1 });
itemSchema.index({ partName: 1 });
itemSchema.index({ date: 1, machine: 1 });

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;