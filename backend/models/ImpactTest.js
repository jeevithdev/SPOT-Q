const mongoose = require('mongoose');

const ImpactTestSchema = new mongoose.Schema({
    dateOfInspection: {
        type: Date, 
        required: true 
    },

    partName: { 
        type: String,
        required: true, 
        trim: true 
    },

    dateCode: { 
        type: String, 
        required: true, 
        trim: true 
    },

    heatCode: { 
        type: String, 
        required: true, 
        trim: true 
    },

    specimenType: { 
        type: String, 
        required: true, 
        trim: true 
    },

    temp: {
        type: Number, 
        required: true 
    },

    energy: {
        type: Number, 
        required: true 
    },

    remarks: { 
        type: String, 
        trim: true, 
        default: '' 
    },

    createdAt: { 
        type: Date, 
        default: Date.now
    }
});

module.exports = mongoose.model('ImpactTest', ImpactTestSchema);
