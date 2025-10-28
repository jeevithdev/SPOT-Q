const mongoose = require("mongoose");

const MicroTensileSchema = new mongoose.Schema({
  microTensileReport: {
    disaNo: {
      type: String,
      required: true,
    },
    dateOfInspection: {
      type: Date,
      required: true,
    },
    item: {
      type: String,
      requiredL: true,
    },
    dateheatCode: {
      type: String,
      required: true,
    },
    barDia: {
      type: Number,
      set: (v) => Math.round(v * 100) / 100,
      required: true,
    },
    gaugeLength: {
      type: Number,
      set: (v) => Math.round(v * 10) / 10,
      required: true,
    },
    maxLoad: {
      type: Number,
      set: (v) => Math.round(v * 100) / 100,
      required: true,
    },
    yieldLoad: {
      type: Number,
      set: (v) => Math.round(v * 100) / 100,
      required: true,
    },
    tensileStrength: {
      type: Number,
      set: (v) => Math.round(v * 100) / 100,
      required: true,
    },
    yieldStrength: {
      type: Number,
      set: (v) => Math.round(v * 100) / 100,
      required: true,
    },
    elongation: {
      type: Number,
      set: (v) => Math.round(v * 100) / 100,
      required: true,
    },
    remarks: {
      type: String,
    },
    testedBy: {
      type: String,
    },
  },
});

module.exports = mongoose.model("microtensile", MicroTensileSchema);
