const mongoose = require("mongoose");

const MeltingLogSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    validate: {
      validator: (value) => value <= new Date(),
    },
  },
  shift: {
    type: String,
    required: true,
  },
  furnaceNo: {
    type: Number,
    required: true,
  },
  panel: {
    type: String,
    required: true,
  },
  cumulativeLiquidModel: {
    type: Number,
    required: true,
  },
  finalKwHr: {
    type: Number,
    required: true,
  },
  initialKwHr: {
    type: Number,
    required: true,
  },
  totalUnits: {
    type: Number,
    required: true,
  },
  cumulativeUnits: {
    type: Number,
    required: true,
  },

  foundryB: {
    heatNo: {
      type: Number,
      max: 9999,
      required: true,
    },
    grade: {
      type: String,
      required: true,
      maxLength: 2,
    },
    charging: {
      time: {
        type: String,
        match: /^(0?[0-9]|1[0-9]|2[0-3])\:[0-5][0-9]$/,
      },
      ifDath: {
        type: Number,
        required: true,
      },
      liquidMetal: {
        pressPour: {
          type: String,
        },
        holder: {
          type: String,
        },
      },
      sgMsSteel: {
        type: Number,
        min: 400,
        max: 2500,
        required: true,
      },
      greyMsSteel: {
        type: Number,
        min: 400,
        max: 2500,
      },
      returnsSgGi: {
        type: Number,
        min: 400,
        max: 2500,
        required: true,
      },
      pigIron: {
        type: Number,
        min: 0,
        max: 350,
        required: true,
      },
      borings: {
        type: Number,
        min: 0,
        max: 1500,
        required: true,
      },
      finalBath: {
        type: Number,
        required: true,
      },
    },
  },
  MeltingLogSheet: {
    charcoal: {
      type: Number,
    },
    cpc: {
      fur: {
        type: String,
        required: true,
      },
      lc: {
        type: String,
      },
    },
    siliconCarbide: {
      fur: {
        type: Number,
        min: 3,
        max: 9,
        required: true,
      },
    },
    ferroSilicon: {
      fur: {
        type: Number,
        required: true,
      },
      lc: {
        type: Number,
      },
    },
    ferroManganese: {
      fur: {
        type: Number,
      },
      lc: {
        type: Number,
        required: true,
      },
    },
    CU: {
      type: Number,
      set: (v) => Math.round(v * 10) / 10,
      required: true,
    },
    CR: {
      type: Number,
    },
    pureMg: {
      type: Number,
    },
    iron: {
      type: Number,
    },
    labCoin: {
      time: {
        type: String,
        match: /^(0?[0-9]|1[0-9]|2[0-3])\:[0-5][0-9]$/,
      },
      temp: {
        type: Number,
        required: true,
      },
    },
    deaslagingTime: {
      from: {
        type: String,
        match: /^(0?[0-9]|1[0-9]|2[0-3])\:[0-5][0-9]$/,
      },
      to: {
        type: String,
        match: /^(0?[0-9]|1[0-9]|2[0-3])\:[0-5][0-9]$/,
      },
    },
    metalReadyTime: {
      type: String,
      match: /^(0?[0-9]|1[0-9]|2[0-3])\:[0-5][0-9]$/,
    },

    waitingForTapping: {
      from: {
        type: String,
        match: /^(0?[0-9]|1[0-9]|2[0-3])\:[0-5][0-9]$/,
      },
      to: {
        type: String,
        match: /^(0?[0-9]|1[0-9]|2[0-3])\:[0-5][0-9]$/,
      },
    },
    reason: {
      type: String,
      default: "",
    },

    metalTapping: {
      time: {
        type: String,
        match: /^(0?[0-9]|1[0-9]|2[0-3])\:[0-5][0-9]$/,
      },
      temp: {
        type: Number,
        min: 1440,
        max: 1550,
        required: true,
      },
      directFurnace: {
        type: Number,
        required: true,
      },
      holderToFurnace: {
        type: String,
        default: "-",
      },
      furnaceToHolder: {
        type: String,
        default: "-",
      },
      discNo: {
        type: Number,
        max: 1,
        required: true,
      },
      item: {
        type: String,
        default: "SP2KIN",
      },
    },
    electricalReadings: {
      furnace123: {
        Kw: {
          type: Number,
          min: 2000,
          max: 3000,
          required: true,
        },
        A: {
          type: Number,
          min: 2000,
          max: 3000,
          required: true,
        },
        V: {
          type: Number,
          min: 1000,
          max: 1500,
          required: true,
        },
      },
      furnace4: {
        Hz: { type: Number, min: 200, max: 300, required: true },
        GLD: {
          type: Number,
          max: 80,
          required: true,
        },
      },
    },
  },
});

module.exports = mongoose.model("meltinglogsheet", MeltingLogSchema);
