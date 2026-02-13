const mongoose = require('mongoose');

const DismaticProductReportDISASchema = new mongoose.Schema({
    // Basic Information - Primary Identifier
    date: {
        type: Date,
        required: true,
        index: true 
    },
    shift: {
        type: String,
        required: true,
        trim: true,
        index: true 
    },
    incharge: {
        type: String,
        default: null,
        trim: true
    },
    ppOperator: {
        type: String,
        default: null,
        trim: true
    },
    memberspresent: {
        type: [String],
        default: null
    },
    
    // Production Table
    productionDetails: [{
        sNo: {
            type: Number,
            required: true
        },
        counterNo: {
            type: String,
            default: '',
            trim: true
        },
        componentName: {
            type: String,
            default: '',
            trim: true
        },
        produced: {
            type: Number,
            default: 0
        },
        poured: {
            type: Number,
            default: 0
        },
        cycleTime: {
            type: String,
            default: '',
            trim: true
        },
        mouldsPerHour: {
            type: Number,
            default: 0
        },
        remarks: {
            type: String,
            default: '',
            trim: true
        }
    }],

    // Next Shift Plan Table
    nextShiftPlan: [{
        sNo: {
            type: Number,
            required: true
        },
        componentName: {
            type: String,
            default: '',
            trim: true
        },
        plannedMoulds: {
            type: Number,
            default: 0
        },
        remarks: {
            type: String,
            default: '',
            trim: true
        }
    }],

    // Delays Table
    delays: [{
        sNo: {
            type: Number,
            required: true
        },
        delays: {
            type: String,
            default: '',
            trim: true
        },
        durationMinutes: {
            type: [String],
            default: []
        },
        fromTime: {
            type: [String],
            default: []
        },
        toTime: {
            type: [String],
            default: []
        }
    }],

    // Mould Hardness Table
    mouldHardness: [{
        sNo: {
            type: Number,
            required: true
        },
        componentName: {
            type: String,
            default: '',
            trim: true
        },
        mpPP: {
            type: [],
            default: []
        },
        mpSP: {
            type: [],
            default: []
        },
        bsPP: {
            type: [],
            default: []
        },
        bsSP: {
            type: [],
            default: []
        },
        remarks: {
            type: String,
            default: '',
            trim: true
        }
    }],

    // Pattern Temperature Table
    patternTemperature: [{
        sNo: {
            type: Number,
            required: true
        },
        item: {
            type: String,
            default: '',
            trim: true
        },
        pp: {
            type: Number,
            default: 0
        },
        sp: {
            type: Number,
            default: 0
        }
    }],
    significantEvent: {
        type: String,
        trim: true
    },
    maintenance: {
        type: String,
        trim: true
    },
    supervisorName: {
        type: String,
        trim: true
    }
}, {
    timestamps: true, 
    collection: 'disamatic_product' 
});

// Compound unique index on date and shift - one record per date+shift combination
DismaticProductReportDISASchema.index({ date: 1, shift: 1 }, { unique: true });

// Index for date range queries (descending for latest first)
DismaticProductReportDISASchema.index({ date: -1 });

module.exports = mongoose.model('DismaticProductReportDISA', DismaticProductReportDISASchema);
