const mongoose = require('mongoose');

const TensileSchema = new mongoose.Schema({

    dateOfInspection: { 
        type: Date, 
        required: true 
    },

    item: { 
        type: String, 
        required: true, 
        trim: true 
    },

    datecode: { 
        type: String, 
        required: true, 
        trim: true,
        match: /^[0-9][A-Z][0-9]{2}$/  // Example: '3A21'
    },

    heatCode: { 
        type: String, 
        required: true, 
        trim: true
    },

    dia: { 
        type: Number, 
        required: true 
    },

    lo: { 
        type: Number, 
        required: true 
    },

    li: { 
        type: Number, 
        required: true
    },
    
    breakingLoad: { 
        type: Number, 
        required: true 
    },

    yieldLoad: { 
        type: Number, 
        required: true 
    },

    uts: { 
        type: Number, 
        required: true 
    },

    ys: { 
        type: Number, 
        required: true 
    },

    elongation: { 
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

    testedBy: { 
        type: String,
        required: true
    }
}, {
    timestamps: true,
    collection: 'tensile'
});

module.exports = mongoose.model('Tensile', TensileSchema);
