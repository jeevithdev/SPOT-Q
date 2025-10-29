const mongoose = require('mongoose');

const MicroStructureReportSchema = new mongoose.Schema({
    
    insDate: { 
        type: Date,
        required: true 
    },

    partName: { 
        type: String,
        required: true,
        trim: true 
    },

    dateCodeHeatCode: { 
        type: String, 
        required: true, 
        trim: true 
    },

    nodularityGraphiteType: { 
        type: String, 
        required: true, 
        trim: true 
    },

    countNos: { 
        type: Number, 
        required: true 
    }, 

    size: { 
        type: String, 
        required: true, 
        trim: true 
    },

    ferritePercent: { 
        type: Number, 
        required: true, 
        min: 0, 
        max: 100 
    }, 

    pearlitePercent: { 
        type: Number, 
        required: true, 
        min: 0, 
        max: 100 
    }, 

    carbidePercent: { 
        type: Number, 
        required: true, 
        min: 0, 
        max: 100
     }, 

    remarks: { 
        type: String, 
        trim: true, 
        default: '' 
    },

    createdAt: { 
        type: Date, 
        default: Date.now }
});

module.exports = mongoose.model('MicroStructureReport', MicroStructureReportSchema);
