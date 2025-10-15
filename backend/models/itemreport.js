const mongoose = require("mongoose");

const itemReportSchema = new mongoose.Schema({
  Date: {
    type: Date,
    required: true,
  },
  Machine: {
    type: String,
    required: true,
  },
  PPNO: {
    type: Number,
    required: true,
    max: 99,
  },
  PartName: {
    type: String,
    required: true,
  },
  DateCode: {
    type: Number,
    required: true,
    max: 9999,
  },
  HeatCode: {
    type: String,
    required: true,
  },
  TimeOfPacking: {
    type: String,
    required: true,
    match:
      /^(0?[1-9]|1[0-2]):([0-5]\d)\s?(AM|PM)\s(0?[1-9]|1[0-2])\/(0?[1-9]|[12]\d|3[01])\/\d{4}$/i,
  },
  MCNO:{
    type:Number,
    required:true,
    max:9
  },
  HeatNo:{
    type:Number,
    required:true,
  }
});

module.exports = mongoose.model('item',itemReportSchema)
