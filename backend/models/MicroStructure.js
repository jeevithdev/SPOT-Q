const mongoose = require('mongoose');

// Sub-schema for individual micro structure test entries
const MicroStructureEntrySchema = new mongoose.Schema({
    disa: {
        type: String,
        required: true,
        trim: true
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

    nodularity: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },

    graphiteType: {
        type: String,
        required: true,
        trim: true
    },

    countMin: {
        type: Number,
        required: true,
        min: 0
    },
    countMax: {
        type: Number,
        default: 0,
        min: 0
    },

    sizeMin: {
        type: Number,
        required: true,
        min: 0
    },
    sizeMax: {
        type: Number,
        default: 0,
        min: 0
    },

    ferriteMin: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    ferriteMax: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },

    pearliteMin: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    pearliteMax: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },

    carbideMin: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    carbideMax: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },

    remarks: {
        type: String,
        trim: true,
        default: ''
    }
}, {
    timestamps: true,
    _id: true
});

// Main schema - one document per date
const MicroStructureSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    savedDisas: [{
        type: String,
        trim: true
    }],
    entries: {
        type: [MicroStructureEntrySchema],
        default: []
    }
}, {
    timestamps: true,
    collection: 'micro_structure'
});

module.exports = mongoose.model('MicroStructure', MicroStructureSchema);
