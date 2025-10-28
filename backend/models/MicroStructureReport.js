const mongoose = require('mongoose');

const MicroStructureReportSchema = new mongoose.Schema({
    insDate: { type: Date, required: true }, // Inspection Date
    partName: { type: String, required: true, trim: true },
    dateCodeHeatCode: { type: String, required: true, trim: true },
    nodularityGraphiteType: { type: String, required: true, trim: true },
    countNos: { type: Number, required: true }, // Count Nos/mm^2
    size: { type: String, required: true, trim: true },
    ferritePercent: { type: Number, required: true, min: 0, max: 100 }, // Ferrite %
    pearlitePercent: { type: Number, required: true, min: 0, max: 100 }, // Pearlite %
    carbidePercent: { type: Number, required: true, min: 0, max: 100 }, // Carbide %
    remarks: { type: String, trim: true, default: '' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MicroStructureReport', MicroStructureReportSchema);
