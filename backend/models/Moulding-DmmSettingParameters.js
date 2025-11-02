const mongoose = require('mongoose');

const DmmSettingParametersSchema = new mongoose.Schema({

    // Primary Identifier - combination of date and machine
    date: {
        type: Date,
        required: true,
        index: true
    },
    
    machine: {
        type: String, // Changed to String to match frontend input
        required: true,
        index: true,
        trim: true
    },

    shifts: {
        shift1: {
            operatorName: {
                type: String,
                required: true
            },
            checkedBy: {
                type: String,
                required: true
            }
        },

        shift2: {
            operatorName: {
                type: String,
                required: true
            },
            checkedBy: {
                type: String,
                required: true
            },
            
        },

        shift3: {
            operatorName: {
                type: String,
                required: true
            },
            checkedBy: {
                type: String,
                required: true
            },
            
        }
    },

    parameters: {
        shift1 :{

            customer: {
                type: String,
                required: true
        },

        itemDescription: {
            type: String,
            required: true
        },

        time: {
            type: String,
            required: true
        },

        ppThickness: {
            type: Number,
            required: true
        },
        ppheight: {
            type: Number,
            required: true
        },
        spThickness: {
            type: Number,
            required: true
        },
        spHeight: {
            type: Number,
            required: true
        },
        CoreMaskThickness: {
            type: Number,
            required: true
        },
        CoreMaskHeight: {
            type: Number,
            required: true
        },
        sandShotPressurebar: {
            type: Number,
            required: true
        },
        correctionShotTime: {
            type: Number,
            required: true
        },
        squeezePressure: {
            type: Number,
            required: true
        },
        ppStrippingAcceleration: {
            type: Number,
            required: true
        },
        ppStrippingDistance: {
            type: Number,
            required: true
        },
        spStrippingAcceleration: {
            type: Number,
            required: true
        },
        spStrippingDistance: {
            type: Number,
            required: true
        },
        mouldThickness: {
            type: Number,
            required: true
        },
        closeUpForceMouldCloseUpPressure: {
            type: Number,
            required: true
        },
        remarks: {
            type: String,
            required: true
        }
    },
    shift2 :{
        customer: {
            type: String,
            required: true
        },
        itemDescription: {
            type: String,
            required: true
        },
        time: {
            type: String,
            required: true
        },
        ppThickness: {
            type: Number,
            required: true
        },
        ppHeight: {
            type: Number,
            required: true
        },
        spThickness: {
            type: Number,
            required: true
        },
        spHeight: {
            type: Number,
            required: true
        },
        CoreMaskThickness: {
            type: Number,
            required: true
        },  
        CoreMaskHeight: {
            type: Number,
            required: true
        },
        sandShotPressurebar: {
            type: Number,
            required: true
        },
        correctionShotTime: {
            type: Number,
            required: true
        },
        squeezePressure: {
            type: Number,
            required: true
        },
        ppStrippingAcceleration: {
            type: Number,
            required: true
        },
        ppStrippingDistance: {
            type: Number,
            required: true
        },
        spStrippingAcceleration: {
            type: Number,
            required: true
        },
        spStrippingDistance: {
            type: Number,
            required: true
        },
        mouldThickness: {
            type: Number,
            required: true
        },
        closeUpForceMouldCloseUpPressure: {
            type: Number,
            required: true
        },
        remarks: {
            type: String,
            required: true
        }   
    },
    shift3 :{
        customer: {
            type: String,
            required: true
        },
        itemDescription: {
            type: String,
            required: true
        },
        time: {
            type: String,
            required: true
        },
        ppThickness: {
            type: Number,
            required: true
        },
        ppHeight: {
            type: Number,
            required: true
        },
        spThickness: {
            type: Number,
            required: true
        },
        spHeight: {
            type: Number,
            required: true
        },
        CoreMaskThickness: {
            type: Number,
            required: true
        },
        CoreMaskHeight: {
            type: Number,
            required: true
        },
        sandShotPressurebar: {
            type: Number,
            required: true
        },
        correctionShotTime: {
            type: Number,
            required: true
        },
        squeezePressure: {
            type: Number,
            required: true
        },
        ppStrippingAcceleration: {
            type: Number,
            required: true
        },
        ppStrippingDistance: {
            type: Number,
            required: true
        },
        spStrippingAcceleration: {
            type: Number,
            required: true
        },
        spStrippingDistance: {
            type: Number,
            required: true
        },
        mouldThickness: {
            type: Number,
            required: true
        },
        closeUpForceMouldCloseUpPressure: {
            type: Number,
            required: true
        },
        remarks: {
            type: String,
            required: true
        }
    }
    }
}, {
    timestamps: true
});

// Composite unique index on date + machine (primary identifier)
// This ensures one record per date-machine combination
DmmSettingParametersSchema.index({ date: 1, machine: 1 }, { unique: true });

module.exports = mongoose.model('DmmSettingParameters', DmmSettingParametersSchema);
