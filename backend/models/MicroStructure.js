const mongoose = require("mongoose");

const MicroStructureSchema = new mongoose.Schema({
  disaNo: {
    type: String,
    required: true,
  },
  insDate: {
    type: Date,
    required: true,
  },
  partName: {
    type: String,
    trim: true,
    required: true,
  },
  dateHeatCode: {
    type: String,
    required: true,
  },
  microStructure: {
    nodularityGraphiteType: {
      type: Number,
      max: 100,
      required: true,
    },
    countPerMm: {
      min: Number,
      max: Number,
      required: true,
    },
    size: {
      min: Number,
      max: Number,
      required: true,
    },
    ferrite: {
      min: Number,
      max: Number,
      required: true,
    },
    pearlite: {
      min: Number,
      max: Number,
      required: true,
    },
    carbide: {
      min: Number,
      max: Number,
      default: null,
    },
    remarks: {
      type: String,
      default: "-",
      trim: true,
    },
  },
});


module.exports = mongoose.model('MicroStructure',MicroStructureSchema);
