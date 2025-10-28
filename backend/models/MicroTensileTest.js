const mongoose = require('mongoose');

const MicroTensileTestSchema = new mongoose.Schema({
    dateOfInspection: { type: Date, required: true },
    item: { type: String, required: true, trim: true },
    dateCodeHeatCode: { type: String, required: true, trim: true },
    barDia: { type: Number, required: true }, // Bar Dia(mm)
    gaugeLength: { type: Number, required: true }, // Gauge Length(mm)
    maxLoad: { type: Number, required: true }, // Max Load (Kgs) or KN
    yieldLoad: { type: Number, required: true }, // Yield Load (Kgs) or KN
    tensileStrength: { type: Number, required: true }, // TS Kg/mm^2 or Mpa
    yieldStrength: { type: Number, required: true }, // YS Kg/mm^2 or Mpa
    elongation: { type: Number, required: true, min: 0, max: 100 }, // Elongation %
    remarks: { type: String, trim: true, default: '' },
    testedBy: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MicroTensileTest', MicroTensileTestSchema);
