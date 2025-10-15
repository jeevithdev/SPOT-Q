const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const moldSchema = new mongoose.Schema({
  Date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
    match: /^((0[1-9])|(1[0-2])):([0-5]\d)\s?(AM|PM)$/i,
  },

  model_code: {
    type: Number,
    required: true,
    max: 999,
  },
  heat_of_metal: {
    type: String,
    required: true,
  },
  mixer_speed: {
    type: String,
    required: true,
  },
  breakdown_AMM: {
    type: String,
    required: true,
    maxlength: 3,
  },
  breakdown_DMM: {
    type: String,
    required: true,
    maxlength: 3,
  },
  breakdown_others: {
    type: String,
    required: true,
    maxlength: 3,
  },
  remarks: {
    type: String,
    default: "",
  },
  Operator: {
    type: String,
    required: true,
  },
  Supervisor: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("production", moldSchema);
