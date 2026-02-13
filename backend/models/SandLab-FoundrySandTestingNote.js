const mongoose = require('mongoose');

// --- Sub-schema for a single Clay Test (totalClay, VCM, LOI) ---
const ClayTest3InputSchema = {
  input1: { type: String, trim: true },
  input2: { type: String, trim: true },
  input3: { type: String, trim: true },
  solution: { type: String, trim: true }
};

// --- Sub-schema for a simple Clay Test (activeClay, deadClay) ---
const ClayTest2InputSchema = {
  input1: { type: String, trim: true },
  input2: { type: String, trim: true },
  solution: { type: String, trim: true }
};

// --- Sub-schema for a single Sieve test half ---
const SieveSizeSchema = {
  1700: { type: String, trim: true },
  850: { type: String, trim: true },
  600: { type: String, trim: true },
  425: { type: String, trim: true },
  300: { type: String, trim: true },
  212: { type: String, trim: true },
  150: { type: String, trim: true },
  106: { type: String, trim: true },
  75: { type: String, trim: true },
  pan: { type: String, trim: true },
  total: { type: String, trim: true }
};

const MfSchema = {
  5: { type: String, trim: true },
  10: { type: String, trim: true },
  20: { type: String, trim: true },
  30: { type: String, trim: true },
  50: { type: String, trim: true },
  70: { type: String, trim: true },
  100: { type: String, trim: true },
  140: { type: String, trim: true },
  200: { type: String, trim: true },
  pan: { type: String, trim: true },
  total: { type: String, trim: true }
};

// --- Sub-schema for Test Parameters ---
const TestParamSchema = {
  compactability: { type: String, trim: true },
  permeability: { type: String, trim: true },
  gcs: { type: String, trim: true },
  wts: { type: String, trim: true },
  moisture: { type: String, trim: true },
  bentonite: { type: String, trim: true },
  coalDust: { type: String, trim: true },
  hopperLevel: { type: String, trim: true },
  shearStrength: { type: String, trim: true },
  dustCollectorSettings: { type: String, trim: true },
  returnSandMoisture: { type: String, trim: true }
};

// --- Sub-schema for Additional Data ---
const AdditionalDataItemSchema = {
  afsNo: { type: String, trim: true },
  fines: { type: String, trim: true },
  gd: { type: String, trim: true }
};

// ========================
// ENTRY sub-document (one per shift + sandPlant combo)
// ========================
const EntrySchema = new mongoose.Schema({
  shift: { type: String, required: true, trim: true },
  sandPlant: { type: String, required: true, trim: true },
  compactibilitySetting: { type: String, trim: true },
  shearStrengthSetting: { type: String, trim: true },

  clayTests: {
    test1: {
      totalClay: ClayTest3InputSchema,
      activeClay: ClayTest2InputSchema,
      deadClay: ClayTest2InputSchema,
      vcm: ClayTest3InputSchema,
      loi: ClayTest3InputSchema
    },
    test2: {
      totalClay: ClayTest3InputSchema,
      activeClay: ClayTest2InputSchema,
      deadClay: ClayTest2InputSchema,
      vcm: ClayTest3InputSchema,
      loi: ClayTest3InputSchema
    }
  },

  sieveTesting: {
    test1: { sieveSize: SieveSizeSchema, mf: MfSchema },
    test2: { sieveSize: SieveSizeSchema, mf: MfSchema }
  },

  parameters: {
    test1: TestParamSchema,
    test2: TestParamSchema
  },

  additionalData: {
    test1: AdditionalDataItemSchema,
    test2: AdditionalDataItemSchema
  },

  remarks: { type: String, trim: true }
}, { _id: true });

// ========================
// MAIN document: one per DATE
// ========================
const FoundrySandTestingNoteSchema = new mongoose.Schema({
  date: { type: Date, required: true, unique: true },
  entries: [EntrySchema]
}, {
  timestamps: true,
  collection: 'foundry_sand_testing_note'
});

module.exports = mongoose.model('FoundrySandTestingNote', FoundrySandTestingNoteSchema);
