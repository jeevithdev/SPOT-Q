const mongoose = require('mongoose');

const ProcessSchema = new mongoose.Schema({

    disa :{
        type : Number,
        required: true
    },

    date: { 
        type: Date, 
        required: true 
    },

    partName: { 
        type: String, 
        required: true, 
        trim: true 
    },

    datecode : {
        type : String,
        required: true
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

    metalComposition : {
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
    }
},

    timeOfPouring: { 
        type: String, 
        required: true 
    },

    pouringTemperature: {
        type: Number, 
        required: true 
    },

    ppcode :{
        type : Number,
        required: true
    },

    treatmentno :{
        type : Number,
        required: true
    },

    fcno :{
        type : Number,
        required: true
    },

    heatNo :{
        type : Number,
        required: true
    },

    conNo :{
        type : Number,
        required: true
    },

    tappingtime :{
        type : Number,
        required: true
    },

    corrativeaddition :{

        C :{
            type : Number,
            required: true
        },

        Si :{
            type : Number,
            required: true
        },
        Mn :{
            type : Number,
            required: true
        },
        S :{    
            type : Number,
            required: true
        },

        Cr :{
            type : Number,
            required: true
        },

        Cu :{
            type : Number,
            required: true
        },

        Sn :{ 
            type : Number,
            required: true
        }
    },

    tappingWt : {
        type : Number,
        required: true
    },

    Mg :{
        type : Number,
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
    
});

module.exports = mongoose.model('Process', ProcessSchema);
