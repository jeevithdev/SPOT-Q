const mongoose = require('mongoose');

const MicroTensileSchema = new mongoose.Schema({

    dateOfInspection: { 
        type: Date, 
        required: true 
    },

    item: { 
        type: String, 
        required: true, 
        trim: true 
    },

    dateCodeHeatCode: { 
        type: String, 
        required: true, 
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
    },

    createdAt: { 
        type: Date, 
        default: Date.now 
    
    }
});

module.exports = mongoose.model('MicroTensile', MicroTensileSchema);
