const mongoose = require("mongoose");

const TensileSchema = new mongoose.Schema({
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
  dia: {
    type: Number,
    set: (v) => Math.round(v * 100) / 100,
    required: true,
  },
  lo: {
    type: Number,
    set: (v) => Math.round(v * 10) / 10,
    default: null,
  },
  li: {
    type: Number,
    set: (v) => Math.round(v * 10) / 10,
    default: null,
  },
  breakingLoadKn: {
    type: Number,
    set: (v) => Math.round(v * 100) / 100,
    required: true,
  },
  yieldLoad: {
    type: Number,
    set: (v) => Math.round(v * 100) / 100,
    default: null,
  },
  uts: {
    type: Number,
    required: true,
  },
  ys: {
    type: Number,
    required: true,
  },
  elongation: {
    type: Number,
    set: (v) => Math.round(v * 10) / 10,
    required: true,
  },
  remarks: {
    type: String,
    default: "",
  },
  testedBy: {
    type: String,
  },
});

module.exports = mongoose.model("tensile", TensileSchema);
