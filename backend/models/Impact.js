const mongoose = require('mongoose');

const ImpactSchema = new mongoose.Schema({

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

    specification: { 
        type: String, 
        required: true, 
        trim: true 
    },

    observedValue: { 
        type: Number, 
        required: true, 
        trim: true 
    },

    remarks: { 
        type: String, 
        trim: true, 
        default: '' 
    }
}, {
    timestamps: true,
    collection: 'impact'
});

module.exports = mongoose.model('Impact', ImpactSchema);
