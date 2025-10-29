const mongoose = require('mongoose');

const DismaticProductReportDISASchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    shift: {
        type: String,
        required: true
    },
    incharge: {
        type: String,
        required: true
    },
    members: [{
        type: String,
        required: true
    }],
    production: {
        type: String,
        required: true
    },
    ppOperator: {
        type: String,
        required: true
    },
    productionDetails: [{
        mouldCounterNo: {
            type: Number,
            required: true
        },
        componentName: {
            type: String,
            required: true
        },
        produced: {
            type: Number,
            required: true
        },
        poured: {
            type: Number,
            required: true
        },
        cycleTime: {
            type: Number,
            required: true
        },
        mouldsPerHour: {
            type: Number,
            required: true
        },
        remarks: String
    }],
    nextShiftPlan: [{
        sNo: Number,
        componentName: {
            type: String,
            required: true
        },
        plannedMoulds: {
            type: Number,
            required: true
        },
        remarks: String
    }],
    delays: [{
        sNo: Number,
        delayType: {
            type: String,
            required: true
        },
        durationInMinutes: {
            type: Number,
            required: true
        },
        durationInTime: {
            type: String,
            required: true
        }
    }],
    mouldHardness: [{
        sNo: Number,
        mouldPenetrantTester: {
            pp: Number,
            sp: Number
        },
        bScale: {
            pp: Number,
            sp: Number
        },
        remarks: String
    }],
    patternTemperature: [{
        sNo: Number,
        items: {
            type: String,
            required: true
        },
        pp: Number,
        sp: Number
    }],
    significantEvent: String,
    maintenance: String,
    supervisorName: {
        type: String,
        required: true
    },
    supervisorSign: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('DismaticProductReportDISA', DismaticProductReportDISASchema);
