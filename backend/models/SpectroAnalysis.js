const mongoose = require("mongoose");

const SpectroAnalysisSchema = new mongoose.Schema({
  Date: {
    type: Date,
    required: true,
    validate:{
      validator:(value) => value <= new Date(),
      message:"Date cannot be in the future"
    },
  },
  Machine: {
    type: String,
    required: true,
  },
  ppNo: {
    type: Number,
    required: true,
    max: 99,
  },
  partName: {
    type: String,
    required: true,
  },
  dateCode: {
    type: String,
    required: true,
    maxlength: 4,
  },
  heatCode: {
    type: String,
    required: true,
  },
  timeOfPacking: {
    type: String,
    required: true,
    match:
      /^(0?[1-9]|1[0-2]):([0-5]\d)\s?(AM|PM)-(0?[1-9]|1[0-2]):([0-5]\d)\s?(AM|PM)$/i,
  },
  fcNo: {
    type: Number,
    required: true,
    max: 9,
  },
  heatNo: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('analysis',SpectroAnalysisSchema)
