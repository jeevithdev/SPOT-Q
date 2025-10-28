const mongoose = require("mongoose");

const ImpactSchema = mongoose.Schema({
  dateOfInspection: {
    type: Date,
    required: true,
  },
  partName: {
    type: String,
    required: true,
    trim: true,
  },
  dateCode: {
    type: String,
    required: true,
    trim: true,
  },
  specification: {
    type: String,
    required: true,
  },
  observedValue: {
    type: [Number],
    required: true,
  },
  remarks: {
    type: String,
    trim: true,
    required: true,
  },
});

module.exports = mongoose.model("Impact", ImpactSchema);
