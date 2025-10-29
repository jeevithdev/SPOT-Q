const mongoose = require('mongoose');

const ProcessSchema = new mongoose.Schema({

    date: { 
        type: Date, 
        required: true 
    },

    partName: { 
        type: String, 
        required: true, 
        trim: true 
    },

    heatCode: { 
        type: String, 
        required: true, 
        trim: true 
    },

    qtyOfMoulds: { 
        type: Number, 
        required: true, 
        min: 1 
    },

    cPercent: { 
        type: Number, 
        required: true 
    },

    siPercent: { 
        type: Number, 
        required: true 
    },

    mnPercent: { 
        type: Number, 
        required: true 
    },

    pPercent: { 
        type: Number, 
        required: true 
    },

    sPercent: { 
        type: Number, 
        required: true 
    },

    mgFlPercent: { 
        type: Number, 
        required: true 
    },

    cuPercent: { 
        type: Number, 
        required: true
    },

    crPercent: { 
        type: Number, 
        required: true 
    },

    timeOfPouring: { 
        type: String, 
        required: true 
    },

    pouringTemperature: {
        type: Number, 
        required: true 
    },

    resMgConvertorPercent: { 
        type: Number, 
        default: 0 
    },

    recMgPercent: { 
        type: Number, 
        default: 0 
    },

    streamInoculantGmsSec: { 
        type: Number, 
        default: 0 
    },

    pTimeSec: { 
        type: Number, 
        default: 0 
    },
    remarks: { 
        type: String, 
        trim: true, 
        default: '' 
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('Process', ProcessSchema);
