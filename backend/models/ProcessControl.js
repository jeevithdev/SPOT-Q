const mongoose = require("mongoose");

const ProcessControlSchema = {
  partName: {
    type: String,
    required: true,
  },
  dateCode: {
    type: String,
    required: true,
  },
  heatCode: {
    type: Number,
    required: true,
  },
  mouldQuantity: {
    type: Schema.Types.Mixed,
    required: true,
  },
  metalComposition: {
    C: {
      type: Number,
      max: 100,
      set: (v) => Math.round(v * 1000) / 1000,
      required: true,
    },
    Si: {
      type: Number,
      max: 100,
      set: (v) => Math.round(v * 1000) / 1000,
      required: true,
    },
    Mn: {
      type: Number,
      max: 100,
      set: (v) => Math.round(v * 1000) / 1000,
      required: true,
    },
    P: {
      type: Number,
      max: 100,
      set: (v) => Math.round(v * 1000) / 1000,
      required: true,
    },
    S: {
      type: Number,
      max: 100,
      set: (v) => Math.round(v * 1000) / 1000,
      required: true,
    },
    Mg: {
      first: {
        type: Number,
        max: 100,
        set: (v) => Math.round(v * 1000) / 1000,
        required: true,
      },
      last: {
        type: Number,
        max: 100,
        set: (v) => Math.round(v * 1000) / 1000,
        required: true,
      },
    },
    Cu: {
      type: Number,
      max: 100,
      set: (v) => Math.round(v * 1000) / 1000,
      required: true,
    },
    Cr: {
      type: Number,
      max: 100,
      set: (v) => Math.round(v * 1000) / 1000,
      required: true,
    },
  },
  timeOfPouring: {
    type: String,
    required: true,
    match:
      /^(0?[1-9]|1[0-2]):([0-5]\d)\s?(AM|PM)-(0?[1-9]|1[0-2]):([0-5]\d)\s?(AM|PM)$/i,
  },
  pouringTemp: {
    type: Number,
    min: 0,
    max: 2000,
  },
  ppCode: {
    type: Number,
    required: true,
  },
  treatmentNo: {
    type: Number,
    required: true,
  },
  fcnoheatNo: {
    type: String,
    required: true,
  },
  machine: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  convertorNo: {
    type: Number,
    required: true,
  },
  tappingTime: {
    type: String,
    required: true,
    match: /^((0[1-9])|(1[0-2])):([0-5]\d)\s?(AM|PM)$/i,
  },
  metalHolding: {
    type: Number,
    min: 0,
    required: true,
  },
  correctiveAddition: {
    C: {
      type: Number,
      max: 9,
      default: "",
      required: true,
    },
    Si: {
      type: Number,
      max: 9,
      default: "",
      required: true,
    },
    Mn: {
      type: Number,
      max: 9,
      default: "",
      required: true,
    },
    P: {
      type: Number,
      max: 9,
      default: "",
      required: true,
    },
    S: {
      type: Number,
      max: 9,
      default: "",
      required: true,
    },
    Cr: {
      type: Number,
      max: 9,
      default: "",
      required: true,
    },
    Cu: {
      type: Number,
      max: 9,
      default: "",
      required: true,
    },
    Sn: {
      type: Number,
      max: 9,
      default: "",
      required: true,
    },
  },
  tappingWeight: {
    type: Number,
    required: true,
  },
  Mg: {
    type: Number,
    max: 9,
    required: true,
  },
  resMgConvertor: {
    type: Number,
    set: (v) => Math.round(v * 1000) / 1000,
    required: true,
  },
  recMg: {
    type: Number,
    required: true,
  },
  streamInnoculationAndPtime: {
    type: String,
    required: true,
  },
  remarks: {
    time: {
      type: String,
      required: true,
      match: /^((0[1-9])|(1[0-2])):([0-5]\d)\s?(AM|PM)$/i,
    },
    note: { type: String, required },
  },
};
module.exports = mongoose.model("processcontrol", ProcessControlSchema);
