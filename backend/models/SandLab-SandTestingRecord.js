import mongoose from "mongoose";

const SandTestingRecordSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  shiftI: {
    rSand: {
      type: String,
      trim: true,
      default: "",
    },
    nSand: {
      type: String,
      trim: true,
      default: "",
    },
    mixingMode: {
      type: String,
      trim: true,
      default: "",
    },
    bentonite: {
      type: String,
      trim: true,
      default: "",
    },
    coalDustPremix: {
      type: String,
      trim: true,
      default: "",
    },
    batchNo: {
      bentonite: {
        type: String,
        trim: true,
        default: "",
      },
      coalDustPremix: {
        type: String,
        trim: true,
        default: "",
      },
    },
  },
  shiftII: {
    rSand: {
      type: String,
      trim: true,
      default: "",
    },
    nSand: {
      type: String,
      trim: true,
      default: "",
    },
    mixingMode: {
      type: String,
      trim: true,
      default: "",
    },
    bentonite: {
      type: String,
      trim: true,
      default: "",
    },
    coalDustPremix: {
      type: String,
      trim: true,
      default: "",
    },
    batchNo: {
      bentonite: {
        type: String,
        trim: true,
        default: "",
      },
      coalDustPremix: {
        type: String,
        trim: true,
        default: "",
      },
    },
  },
  shiftIII: {
    rSand: {
      type: String,
      trim: true,
      default: "",
    },
    nSand: {
      type: String,
      trim: true,
      default: "",
    },
    mixingMode: {
      type: String,
      trim: true,
      default: "",
    },
    bentonite: {
      type: String,
      trim: true,
      default: "",
    },
    coalDustPremix: {
      type: String,
      trim: true,
      default: "",
    },
    batchNo: {
      bentonite: {
        type: String,
        trim: true,
        default: "",
      },
      coalDustPremix: {
        type: String,
        trim: true,
        default: "",
      },
    },
  },
  clayShiftI: {
    totalClay: {
      type: String,
      trim: true,
      default: "",
    },
    activeClay: {
      type: String,
      trim: true,
      default: "",
    },
    deadClay: {
      type: String,
      trim: true,
      default: "",
    },
    vcm: {
      type: String,
      trim: true,
      default: "",
    },
    loi: {
      type: String,
      trim: true,
      default: "",
    },
    afsNo: {
      type: String,
      trim: true,
      default: "",
    },
    fines: {
      type: String,
      trim: true,
      default: "",
    },
  },
  clayShiftII: {
    totalClay: {
      type: String,
      trim: true,
      default: "",
    },
    activeClay: {
      type: String,
      trim: true,
      default: "",
    },
    deadClay: {
      type: String,
      trim: true,
      default: "",
    },
    vcm: {
      type: String,
      trim: true,
      default: "",
    },
    loi: {
      type: String,
      trim: true,
      default: "",
    },
    afsNo: {
      type: String,
      trim: true,
      default: "",
    },
    fines: {
      type: String,
      trim: true,
      default: "",
    },
  },
  clayShiftIII: {
    totalClay: {
      type: String,
      trim: true,
      default: "",
    },
    activeClay: {
      type: String,
      trim: true,
      default: "",
    },
    deadClay: {
      type: String,
      trim: true,
      default: "",
    },
    vcm: {
      type: String,
      trim: true,
      default: "",
    },
    loi: {
      type: String,
      trim: true,
      default: "",
    },
    afsNo: {
      type: String,
      trim: true,
      default: "",
    },
    fines: {
      type: String,
      trim: true,
      default: "",
    },
  },
  mixNoShiftI: {
    starterTime: {
      type: String,
      trim: true,
      default: "",
    },
    endTime: {
      type: String,
      trim: true,
      default: "",
    },
    totalMixingTime: {
      type: String,
      trim: true,
      default: "",
    },
    mixRejected: {
      type: String,
      trim: true,
      default: "",
    },
    hopper: {
      type: String,
      trim: true,
      default: "",
    },
  },
  mixNoShiftII: {
    starterTime: {
      type: String,
      trim: true,
      default: "",
    },
    endTime: {
      type: String,
      trim: true,
      default: "",
    },
    totalMixingTime: {
      type: String,
      trim: true,
      default: "",
    },
    mixRejected: {
      type: String,
      trim: true,
      default: "",
    },
    hopper: {
      type: String,
      trim: true,
      default: "",
    },
  },
  mixNoShiftIII: {
    starterTime: {
      type: String,
      trim: true,
      default: "",
    },
    endTime: {
      type: String,
      trim: true,
      default: "",
    },
    totalMixingTime: {
      type: String,
      trim: true,
      default: "",
    },
    mixRejected: {
      type: String,
      trim: true,
      default: "",
    },
    hopper: {
      type: String,
      trim: true,
      default: "",
    },
  },
  sandLump: {
    type: String,
    trim: true,
    default: "",
  },
  newSandWt: {
    type: String,
    trim: true,
    default: "",
  },
  shiftIFriability: {
    type: String,
    trim: true,
    default: "",
  },
  shiftIIFriability: {
    type: String,
    trim: true,
    default: "",
  },
  shiftIIIFriability: {
    type: String,
    trim: true,
    default: "",
  },
  testParameter: {
    permeability: {
      type: String,
      trim: true,
      default: "",
    },
    gcsFdyA: {
      type: String,
      trim: true,
      default: "",
    },
    gcsFdyB: {
      type: String,
      trim: true,
      default: "",
    },
    wts: {
      type: String,
      trim: true,
      default: "",
    },
    moisture: {
      type: String,
      trim: true,
      default: "",
    },
    compactability: {
      type: String,
      trim: true,
      default: "",
    },
    compressibility: {
      type: String,
      trim: true,
      default: "",
    },
    waterLitre: {
      type: String,
      trim: true,
      default: "",
    },
    sandTempBC: {
      type: String,
      trim: true,
      default: "",
    },
    sandTempWU: {
      type: String,
      trim: true,
      default: "",
    },
    sandTempSSU: {
      type: String,
      trim: true,
      default: "",
    },
    newSandKgs: {
      type: String,
      trim: true,
      default: "",
    },
    bentoniteKgs: {
      type: String,
      trim: true,
      default: "",
    },
    bentonitePercent: {
      type: String,
      trim: true,
      default: "",
    },
    premixKgs: {
      type: String,
      trim: true,
      default: "",
    },
    premixPercent: {
      type: String,
      trim: true,
      default: "",
    },
    coalDustKgs: {
      type: String,
      trim: true,
      default: "",
    },
    coalDustPercent: {
      type: String,
      trim: true,
      default: "",
    },
    lc: {
      type: String,
      trim: true,
      default: "Lc",
    },
    lcCompactSMCAt: {
      type: String,
      trim: true,
      default: "",
    },
    mouldStrengthSNCAt: {
      type: String,
      trim: true,
      default: "",
    },
    shearStrength: {
      type: String,
      trim: true,
      default: "",
    },
    preparedSand: {
      type: String,
      trim: true,
      default: "",
    },
    itemName: {
      type: String,
      trim: true,
      default: "",
    },
    remarks: {
      type: String,
      trim: true,
      default: "",
    },
  },
});
export default mongoose.model("SandTestingRecord", SandTestingRecordSchema);
