const mongoose = require('mongoose');

const FoundrySandTestingNoteSchema = new mongoose.Schema({

  // --- 1. General Information (Primary Data) ---
  date: { 
    type: Date, 
    required: true
  },
  shift: { 
    type: String, 
    required: true, 
    trim: true 
  },
  sandPlant: { 
    type: String, 
    required: true, 
    trim: true 
  },
  compactibilitySetting: { 
    type: String, 
    trim: true 
  },
  shearStrengthSetting: { 
    type: String,
    trim: true 
  },

  // --- 2. Clay Test Results ---
  clayTests: {
    test1: {
      totalClay: {
        input1: { type: String, trim: true },
        input2: { type: String, trim: true },
        input3: { type: String, trim: true },
        solution: { type: String, trim: true }
      },
      activeClay: {
        input1: { type: String, trim: true },
        input2: { type: String, trim: true },
        solution: { type: String, trim: true }
      },
      deadClay: {
        input1: { type: String, trim: true },
        input2: { type: String, trim: true },
        solution: { type: String, trim: true }
      },
      vcm: {
        input1: { type: String, trim: true },
        input2: { type: String, trim: true },
        input3: { type: String, trim: true },
        solution: { type: String, trim: true }
      },
      loi: {
        input1: { type: String, trim: true },
        input2: { type: String, trim: true },
        input3: { type: String, trim: true },
        solution: { type: String, trim: true }
      }
    },
    test2: {
      totalClay: {
        input1: { type: String, trim: true },
        input2: { type: String, trim: true },
        input3: { type: String, trim: true },
        solution: { type: String, trim: true }
      },
      activeClay: {
        input1: { type: String, trim: true },
        input2: { type: String, trim: true },
        solution: { type: String, trim: true }
      },
      deadClay: {
        input1: { type: String, trim: true },
        input2: { type: String, trim: true },
        solution: { type: String, trim: true }
      },
      vcm: {
        input1: { type: String, trim: true },
        input2: { type: String, trim: true },
        input3: { type: String, trim: true },
        solution: { type: String, trim: true }
      },
      loi: {
        input1: { type: String, trim: true },
        input2: { type: String, trim: true },
        input3: { type: String, trim: true },
        solution: { type: String, trim: true }
      }
    }
  },

  // --- 3. Sieve Test Data ---
  test1: {
    sieveSize: {
      1700: { 
        type: String, 
        trim: true 
      },
      850: { 
        type: String, 
        trim: true 
      },
      600: { 
        type: String, 
        trim: true 
      },
      425: { 
        type: String, 
        trim: true 
      },
      300: { 
        type: String, 
        trim: true 
      },
      212: { 
        type: String, 
        trim: true 
      },
      150: { 
        type: String, 
        trim: true 
      },
      106: { 
        type: String, 
        trim: true 
      },
      75: { 
        type: String, 
        trim: true 
      },
      pan: { 
        type: String, 
        trim: true 
      },
      total: { 
        type: String, 
        trim: true 
      }
    }
  },
  test2: {
    sieveSize: {
      1700: { 
        type: String, 
        trim: true 
      },
      850: { 
        type: String, 
        trim: true 
      },
      600: { 
        type: String, 
        trim: true 
      },
      425: { 
        type: String, 
        trim: true 
      },
      300: { 
        type: String, 
        trim: true 
      },
      212: { 
        type: String, 
        trim: true 
      },
      150: { 
        type: String, 
        trim: true 
      },
      106: { 
        type: String, 
        trim: true 
      },
      75: { 
        type: String, 
        trim: true 
      },
      pan: { 
        type: String, 
        trim: true 
      },
      total: { 
        type: String, 
        trim: true 
      }
    }
  },

  // --- 4. Metal Filter Test Data ---
  mfTest:{
    mf:{
      5: { 
        type: String, 
        trim: true  
      },
      10: { 
        type: String, 
        trim: true  
      },
      20: { 
        type: String, 
        trim: true  
      },
      30: { 
        type: String, 
        trim: true  
      },
      50: { 
        type: String,
        trim: true  
      },
      70: { 
        type: String, 
        trim: true  
      },
      100: { 
        type: String, 
        trim: true  
      },
      140: { 
        type: String, 
        trim: true  
      },
      200: { 
        type: String, 
        trim: true  
      },
      pan: { 
        type: String, 
        trim: true  
      },
      total: { 
        type: String, 
        trim: true  
      }
    }
  },

  // --- 5. Test Parameters ---
  parameters: {
    test1: {
      gcs: { 
        type: String, 
        trim: true 
      },
      bentonitePremix: { 
        type: String, 
        trim: true 
      },
      premixCoaldust: { 
        type: String, 
        trim: true 
      },
      lcCompactSmcat: { 
        type: String, 
        trim: true 
      },
      mouldStrengthSncat: { 
        type: String, 
        trim: true 
      },
      permeability: { 
        type: String, 
        trim: true 
      },
      wts: { 
        type: String, 
        trim: true 
      },
      moisture: { 
        type: String, 
        trim: true 
      },
      hopperLevel: { 
        type: String, 
        trim: true 
      },
      returnSand: { 
        type: String, 
        trim: true 
      }
    },
    test2: {
      gcs: { 
        type: String, 
        trim: true 
      },
      bentonitePremix: { 
        type: String, 
        trim: true 
      },
      premixCoaldust: { 
        type: String, 
        trim: true 
      },
      lcCompactSmcat: { 
        type: String, 
        trim: true 
      },
      mouldStrengthSncat: { 
        type: String, 
        trim: true 
      },
      permeability: { 
        type: String, 
        trim: true 
      },
      wts: { 
        type: String, 
        trim: true 
      },
      moisture: { 
        type: String, 
        trim: true 
      },
      hopperLevel: { 
        type: String, 
        trim: true 
      },
      returnSand: { 
        type: String, 
        trim: true 
      }
    }
  },

  // --- 6. Additional Data ---
  additionalData: {
    test1: {
      afsNo: { type: String, trim: true },
      fines: { type: String, trim: true },
      gd: { type: String, trim: true }
    },
    test2: {
      afsNo: { type: String, trim: true },
      fines: { type: String, trim: true },
      gd: { type: String, trim: true }
    }
  },

  // --- 7. Remarks ---
  remarks: { type: String, trim: true }
}, 
{ timestamps: true }
);

// Create composite unique index for date + shift combination (primary identifier)
FoundrySandTestingNoteSchema.index({ date: 1, shift: 1 }, { unique: true });

module.exports = mongoose.model('FoundrySandTestingNote', FoundrySandTestingNoteSchema);
