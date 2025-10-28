const mongoose = require('mongoose');

const TensileTestSchema = new mongoose.Schema({
    dateOfInspection: { type: Date, required: true },
    item: { type: String, required: true, trim: true },
    dateHeatCode: { type: String, required: true, trim: true },
    dia: { type: Number, required: true }, // Dia(mm)
    lo: { type: Number, required: true }, // Lo(mm)
    li: { type: Number, required: true }, // Li(mm)
    breakingLoad: { type: Number, required: true }, // Breaking Load kN
    yieldLoad: { type: Number, required: true },
    uts: { type: Number, required: true }, // UTS ( N/mm^2)
    ys: { type: Number, required: true }, // YS (n/mm^2)
    elongation: { type: Number, required: true, min: 0, max: 100 }, // Elongation %
    remarks: { type: String, trim: true, default: '' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TensileTest', TensileTestSchema);
