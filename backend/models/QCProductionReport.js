const mongoose = require('mongoose');

const QCProductionReportSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    partName: { type: String, required: true, trim: true },
    noOfMoulds: { type: Number, required: true, min: 1 },
    cPercent: { type: Number, required: true },
    siPercent: { type: Number, required: true },
    mnPercent: { type: Number, required: true },
    pPercent: { type: Number, required: true },
    sPercent: { type: Number, required: true },
    mgPercent: { type: Number, required: true },
    cuPercent: { type: Number, required: true },
    crPercent: { type: Number, required: true },
    nodularityGraphiteType: { type: String, required: true, trim: true },
    pearliteFerrite: { type: String, required: true, trim: true },
    hardnessBHN: { type: Number, required: true },
    tsYsEl: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('QCProductionReport', QCProductionReportSchema);
