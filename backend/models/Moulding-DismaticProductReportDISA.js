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

    memberspresent: {
        type: String,
        required: true
    },

    production: {
        type: String,
        required: true
    },

    ppOperator: {
        type: String,
        required: true
    },

    productionDetails: {
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
        remarks: {
            type: String,
            required: true
        }
    },

    nextShiftPlan : {

        sNo: {
            type: Number,
            required: true
        },

        componentName: {
            type: String,
            required: true
        },

        plannedMoulds: {
            type: Number,
            required: true
        },
        remarks: {
            type: String,
            required: true
        }
    },

    delays: {
        sNo: {
            type: Number,
            required: true
        },

        delay: {
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
    },

    mouldHardness: {
        sNo: {
            type: Number,
            required: true
        },

        componentName: {
            type: String,
            required: true
        },

        mouldPenetrantTester: {
            pp: {
                type: Number,
                required: true
            },
            sp: {
                type: Number,
                required: true
            }
        },
        bScale: {
            pp: {
                type: Number,
                required: true
            },
            sp: {
                type: Number,
                required: true
            }
        },
        remarks: {
            type: String,
            required: true
        }
    },

    patternTemperature: {
        sNo: {
            type: Number,
            required: true
        },
        items: {
            type: String,
            required: true
        },
        pp: {
            type: Number,
            required: true
        },
        sp: {
            type: Number,
            required: true
        }
    },

    significantEvent: {
        type: String,
        required: true
    },

    maintenance: {
        type: String,
        required: true
    },
    supervisorName: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('DismaticProductReportDISA', DismaticProductReportDISASchema);
