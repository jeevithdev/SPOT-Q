const mongoose = require("mongoose");

const rangeSchema = new mongoose.Schema(
  {
    min: {
      type: Number,
      set: (v) => Math.round(v * 100) / 100,
      required: true,
    },
    max: {
      type: Number,
      set: (v) => Math.round(v * 100) / 100,
      required: true,
    },
  },
  { _id: false }
);

const QnProductionSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  partName: {
    type: String,
    trim: true,
    required: true,
  },
  noOfMoulds: {
    type: Number,
    required: true,
  },
  C: rangeSchema,
  Si: rangeSchema,
  Mn: rangeSchema,
  P: rangeSchema,
  S: rangeSchema,
  Mg: rangeSchema,
  Cu: rangeSchema,
  Cr: rangeSchema,

  nodularityGraphite: {
    nodularity: {
      type: Number,
      required: true,
    },
    graphite: {
     rangeSchema
    },
  },
  pearliteFerrite: {
    rangeSchema,
  },
  ts_ys_el: {
    ts: { type: Number, required: true },
    ys: { type: Number, required: true },
    el: { type: Number, required: true },
  },
});

module.exports = mongoose.model("QnProduction", QnProductionSchema);
