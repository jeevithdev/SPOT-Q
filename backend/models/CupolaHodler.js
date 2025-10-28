const mongoose = require("mongoose");

const CupolaHolderSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  shift: {
    type: String,
  },
  holderNo: {
    type: String,
  },
  heatNo: {
    type: Number,
    required: true,
  },

  additions: {
    CPC: {
      type: Number,
      default: 5,
      required: true,
    },
    feSl: {
      type: Number,
      default: null,
    },
    feMn: {
      type: Number,
      default: null,
    },
    sic: {
      type: Number,
      default: 6,
      required: true,
    },
    pureMg: {
      type: Number,
      default: null,
    },
    Cu: {
      type: Number,
      default: null,
      set: (v) => Math.round(v * 10) / 10,
    },
    FeCr: {
      type: Number,
      default: null,
    },
  },

  tapping: {
    time: {
      actualTime: {
        type: String,
        match: /^(0?[0-9]|1[0-9]|2[0-3])\:[0-5][0-9]$/,
      },
      tappingTime: {
        type: String,
        match: /^(0?[0-9]|1[0-9]|2[0-3])\:[0-5][0-9]$/,
      },
    },
    temp: {
      type: Number,
      required: true,
    },
    metal: {
      type: Number,
      required: true,
    },
  },
  pouring: {
    disaLine: {
      type: Number,
      max: 9,
      required: true,
    },
    indFur: {
      type: Number,
      default: null,
    },
    bailNo: {
      type: Number,
      default: null,
    },
  },
  electrical: {
    tap: { type: Number, default: null },
    KW: { type: Number, default: null },
  },
});

module.exports = mongoose.model("cupolaholder", CupolaHolderSchema);
