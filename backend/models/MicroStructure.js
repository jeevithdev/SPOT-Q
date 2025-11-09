const mongoose = require('mongoose');

const MicroStructureSchema = new mongoose.Schema({

    disa : {
        type : Number,
        required: true
    },
    
    insDate: { 
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

    microStructure : {
        nodularityGraphiteType: { 
            type: String, 
            required: true, 
            trim: true 
        },

    ferritePercent: { 
        type: Number, 
        required: true, 
        min: 0, 
        max: 100 
    }, 

    pearlitePercent: { 
        type: Number, 
        required: true, 
        min: 0, 
        max: 100 
    }, 

    carbidePercent: { 
        type: Number, 
        required: true, 
        min: 0, 
        max: 100
     }
    }, 

    remarks: { 
        type: String, 
        trim: true, 
        default: '' 
    }
}, {
    timestamps: true,
    collection: 'micro_structure'
});

module.exports = mongoose.model('MicroStructure', MicroStructureSchema);
