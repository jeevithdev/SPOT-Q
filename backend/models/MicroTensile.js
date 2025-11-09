const mongoose = require('mongoose');

const MicroTensileSchema = new mongoose.Schema({
    // Disa as array for multiple selections
    disa: {
        type: [String],
        default: []
    },
    
    dateOfInspection: { 
        type: String, 
        required: true 
    },

    item: { 
        type: String, 
        required: true, 
        trim: true 
    },

    // Combined field for backward compatibility
    dateCodeHeatCode: {
        type: String,
        trim: true
    },

    // Separate fields
    dateCode: { 
        type: String, 
        trim: true 
    },

    heatCode: {
        type: String,
        trim: true
    },

    barDia: { 
        type: Number, 
        required: true 
    }, 

    gaugeLength: { 
        type: Number, 
        required: true 
    }, 

    maxLoad: { 
        type: Number, 
        required: true 
    }, 

    yieldLoad: { 
        type: Number, 
        required: true 
    }, 
    
    tensileStrength: { 
        type: Number, 
        required: true 
    }, 

    yieldStrength: {
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
        required: true, 
        trim: true 
    }
}, {
    timestamps: true,
    collection: 'micro_tensile'
});

module.exports = mongoose.model('MicroTensile', MicroTensileSchema);
