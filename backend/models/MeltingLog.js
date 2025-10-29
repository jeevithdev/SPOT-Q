const mongoose = require('mongoose');

const ChargingDetailsSchema = new mongoose.Schema({
    item: { type: String, trim: true, required: true },
    kgs: { type: Number, required: true, min: 0 }
}, { _id: false });

const FurnaceReadingsSchema = new mongoose.Schema({
    kw: { type: Number },
    volts: { type: Number },
    amps: { type: Number },
    gld: { type: Number },
    hz: { type: Number },
    gld1: { type: Number }
}, { _id: false });

const MeltingLogSchema = new mongoose.Schema({
    heatNo: { type: String, required: true, trim: true, unique: true },
    grade: { type: String, required: true, trim: true },

    // --- Charging (Foundry B) --- (Time as a string)
    chargingTime: { type: String },
    chargingKgs: { type: Number, min: 0 },
    chargingMix: {
        liquidMetalPressPour: { type: Number, min: 0, max: 5000 },
        sgMsSteel: { type: Number, min: 400, max: 2500 },
        greyMsSteel: { type: Number, min: 400, max: 2500 },
        ralumsSG: { type: Number, min: 500, max: 2500 },
        gl: { type: Number, min: 800, max: 2250 },
        pigIron: { type: Number, min: 0, max: 350 },
        borings: { type: Number, min: 0, max: 1500 },
        finalBath: { type: Number, min: 0 },
    },

    additives: {
        charCoal: { type: Number, min: 0 },
        cpcFUR: { type: Number, min: 0 },
        cpcLC: { type: Number, min: 0 },
        siliconCarbideFUR: { type: Number, min: 3, max: 9 },
        ferroSiliconFUR: { type: Number, min: 0 },
        ferroSiliconLC: { type: Number, min: 0 },
        ferroManganeseFUR: { type: Number, min: 0 },
        ferroManganeseLC: { type: Number, min: 0 },
        cu: { type: Number, min: 0 },
        cr: { type: Number, min: 0 },
        pureMg: { type: Number, min: 0 },
        ironPyrite: { type: Number, min: 0 },
    },

    labCoin: {
        time: { type: String },
        tempC: { type: Number },
    },
    deslaggingTime: {
        from: { type: String },
        to: { type: String },
    },
    metalReadyTime: { type: String },
    waitingForTapping: {
        from: { type: String },
        to: { type: String },
        reason: { type: String, trim: true }
    },

    tappingDetails: {
        time: { type: String },
        tempC: { type: Number },
        metalKgs: { type: Number, min: 0 },
        type: { type: String, enum: ['SG', 'Grey'] },
        source: { type: String, enum: ['Direct Furnace', 'Holder to Furnace', 'Furnace to Holder'] },
        disaNo: { type: String, trim: true },
        item: { type: String, trim: true },
    },
            
    electricalReadings: {
        furnace1: { type: FurnaceReadingsSchema },
        furnace2: { type: FurnaceReadingsSchema },
        furnace3: { type: FurnaceReadingsSchema },
        furnace4: { type: FurnaceReadingsSchema },
    },
    
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MeltingLog', MeltingLogSchema);