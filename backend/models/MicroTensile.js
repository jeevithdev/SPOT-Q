const mongoose = require('mongoose');

const MicroTensileSchema = new mongoose.Schema({

    disa : {
        type : Number,
        required: true
    },
    
    dateOfInspection: { 
        type: Date, 
        required: true 
    },

    item: { 
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
});

module.exports = mongoose.model('MicroTensile', MicroTensileSchema);
