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

    date: { 
        type: String, 
        required: true, 
        trim: true
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
});

module.exports = mongoose.model('Tensile', TensileSchema);
