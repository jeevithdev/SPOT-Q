import mongoose from "mongoose";

const SandTestingRecordSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  sandShifts : {
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
        }
      }
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
        }
      }
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
        }
      }
    }
  },
  
  clayShifts: {
    shiftI: {
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
    }
  },
  ShiftII: {
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
    }
  },
  ShiftIII: {
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
    }
  }
},
  mixshifts:{
  ShiftI: {
    mixno:{
    start: {
      type: String,
      required: true,
    },
    end: {
      type: String,
      required: true,
    },
    total: {
      type: String,
      required: true,
    }
  },
    numberOfMixRejected: {
      type: Number,
      required: true,
    },
    returnSandHopperLevel: {
      type: Number,
      required: true,
    }
  },
  ShiftII: {
    mixno:{
      start: {
        type: String,
        required: true,
      },
      end: {
        type: String,
        required: true,
      },
      total: {
        type: String,
        required: true,
      }
    },
    numberOfMixRejected: {
      type: String,
      trim: true,
      default: "",
    },
    returnSandHopperLevel: {
      type: Number,
      required: true,
    },
  },
  ShiftIII: {
    mixno:{
      start: {
        type: String,
        required: true,
      },
      end: {
        type: String,
        required: true,
      },
      total: {
        type: String,
        required: true,
      }
    },
    numberOfMixRejected: {
      type: Number,
      required: true,
    },
    returnSandHopperLevel: {
      type: Number,
      required: true,
    }
  }
},
  sandLump: {
    type: String,
    required: true,
  },
  newSandWt: {
    type: String,
    required: true,
  },

  sandFriability: {
    shiftI: {
      type: String,
      required :true,
    },
    shiftII: {
      type: String,
      required :true,
    },
    shiftIII: {
      type: String,
      required :true,
    }
},
testParameter: {
  sno:{
    type: Number,
    required: true,
  },
  time:{
    type: Number,
    required: true,
  },
  mixno:{
    type: Number,
    required: true,
  },
  permeability: {
      type: Number,
      required: true,
    },
    gcsFdyA: {
      type: Number,
      required: true,
    },
    gcsFdyB: {
      type: Number,
      required: true,
    },
    wts: {
      type: Number,
      required: true,
    },
    moisture: {
      type: Number,
      required: true,
    },
    compactability: {
      type: Number,
      required: true,
    },
    compressibility: {
      type: Number,
      required: true,
    },
    waterLitre: {
      type: Number,
      required: true,
    },
    sandTemp: {
    BC: {
      type: Number,
      required: true,
    },
    WU: {
      type: Number,
      required: true,
    },
    SSUmax: {
      type: Number,
      required: true,
    }
  },
    newSandKgs: {
      type: Number,
      required: true,
    },
    mould : {
      type: Number,
      required: true,
    },

    bentoniteWithPremix: {
      Kgs: {
      type: Number,
      required: true,
    },
    Percent: {
      type: Number,
      required: true,
    }
  },
  bentonite : {
    Kgs: {
    type: Number,
    required: true,
  },
  Percent: {
    type: Number,
    required: true,
  }
},
premix:{
  Kgs: {
    type: Number,
    required: true,
    },
    Percent: {
    type: Number,
    required: true,
    }
  },
coalDust:{
  Kgs: {
      type: Number,
      required: true,
    },
    Percent: {
      type: Number,
      required: true,
    }
  },
    lc: {
      type: Number,
      required: true,
    },
    CompactabilitySettings: {
      type: Number,
      required: true,
    },
    mouldStrength: {
      type: Number,
      required: true,
    },
    shearStrengthSetting: {
      type: Number,
      required: true,
    },
    preparedSandlumps: {
      type: Number,
      required: true,
    },
    itemName: {
      type: String,
      required: true,
    },
    remarks: {
      type: String,
      required: true,
    },
  },
});
export default mongoose.model("SandTestingRecord", SandTestingRecordSchema);
