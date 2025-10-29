const mongoose = require('mongoose');

const CupolaHolderLogSchema = new mongoose.Schema({
    heatNo: { 
        type: String, 
        required: true, 
        trim: true, 
        unique: true 
    },

    additions: {
        cpc: { 
            type: Number, 
            min: 0 
        },

        mFeSl: { 
            type: Number, 
            min: 0 
        },

        feMn: { 
            type: Number, 
            min: 0 
        },

        sic: { 
            type: Number, 
            min: 0 
        },

        pureMg: { 
            type: Number, 
            min: 0 
        },

        cu: { 
            type: Number, 
            min: 0 
        },

        feCr: { 
            type: Number, 
            min: 0 
        },
    },

    tapping: {
        actualTime: { 
            type: String 
        },

        tappingTime: { 
            type: String 
        },

        tempC: { 
            type: Number 
        },
        metalKgs: { 
            type: Number, 
            min: 0 
        },
    },

    pouring: {
        disaLine: { 
            type: String, 
            trim: true 
        },
        indFur: { 
            type: String, 
            trim: true 
        },

        bailNo: { 
            type: String, 
            trim: true 
        },
    },

    electrical: {
        tap: { 
            type: String, 
            trim: true 
        },

        kw: { 
            type: Number 
        },
    },
    
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CupolaHolderLog', CupolaHolderLogSchema);
