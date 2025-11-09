const mongoose = require('mongoose');

const MeltingLogsheetSchema = new mongoose.Schema({

    date: {
        type: Date,
        required: true
    },

    shift: {
        type: String,
        required: true
    },

    furnaceNo: {
        type: Number,
        required: true
    },

    panel : {
        type: String,
        required: true
    },

    cumulativeLiquidMetal: {
        type: Number,
        required: true
    },

    finalkwhr : {
        type: Number,
        required: true
    },
    
    initialkwhr: {
        type: Number,
        required: true
    },

    totoalunits : {
        type: Number,
        required: true
    },

    cumulativeunits : {
        type: Number,
        required: true
    },

    heatno : {
        type : Number,


    },

    grade : {
        type : String,
        required: true
    },

    chargingkgs : {
        time : {
            type : String,
            required: true
        },

        ifbath :{
            type : Number,
            required: true
        },

        liquidmetal : {
            presspour : {
                type : Number,
                required: true
            },

            holder : {
                type : Number,
                required: true
            }
        },

        sqmssteel : {
            type : Number,
            required: true
        },

        greymssteel : {
            type : Number,
            required: true
        },

        returnSg :{
            type : Number,
            required: true
        },
        pigiron : {
            type : Number,
            required: true
        },

        borings : {
            type : Number,
            required: true
        },

        finalbath : {
            type : Number,
            required: true
        }
    },

    charcoal : {
        type : Number,
        required: true
    },

    cpc : {
        fur :{
            type : Number,
            required: true
        },

        lc : {
            type : Number,
            required: true
        }
    },

    siliconcarbide : {
        fur : {
            type : Number,
            required: true
        }
    },

    ferroSilicon : {
        fur : {
            type : Number,
            required: true
        },

        lc : {
            type : Number,
            required: true
        }
    },

    ferroManganese : {
        fur : { 
            type : Number,
            required: true
        },

        lc : {
            type : Number,
            required: true
        }
    },

    cu : {
        type : Number,
        required: true
    },

    cr : {
        type : Number,
        required: true
    },

    pureMg : {
        type : Number,
        required: true
    },

    ironPyrite : {
        type : Number,
        required: true
    },

    labCoin : {

        time : {
            type : String,
            required: true
        },

        tempC : {
            type : Number,
            required: true
        }
    },

    deslagingTime : {
        from : {
            type : String,
            required: true
        },

        to : {
            type : String,
            required: true
        }
    },

    metalReadyTime : {
        type : String,
        required: true
    },

    waitingForTapping : {
        from : {
            type : String,
            required: true
        },

        to : {
            type : String,
            required: true
        }
    },

    reason :{
        type : String,
        required: true
    },

    metalTapping : {
        time : {
            type : String,
            required: true
        },
        tempC : {
            type : Number,
            required: true
        }
    },
    
    directFurnace : {
        type : Number,
        required: true
    },
    
    holderToFurnace : {
        type : Number,
        required: true
    },
    
    furnaceToHolder : {
        type : Number,
        required: true
    },

    disaNo : {
        type : Number,
        required: true
    },
    
    item : {
        type : String,
        required: true
    },

    electricalReadings : {
        furnace123 : {
            kw : {
                type : Number,
                required: true
            },
            v : {
                type : Number,
                required: true
            },
            a : {
                type : Number,
                required: true
            }
        },

        furnace4 : {
            hz : {
                type : Number,
                required: true
            },
            gld : {
                type : Number,
                required: true
            },

            kwh : {
                type : Number,
                required: true
            }
        }
    }
}, {
    timestamps: true,
    collection: 'melting_log_sheet'
});

module.exports = mongoose.model('MeltingLogsheet', MeltingLogsheetSchema);
