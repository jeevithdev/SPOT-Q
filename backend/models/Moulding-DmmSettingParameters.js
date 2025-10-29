const mongoose = require('mongoose');

const DmmSettingParametersSchema = new mongoose.Schema({

    machine : {
        type: Number,
        required: true
    },

    date: {
        type: Date,
        required: true
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
});

module.exports = mongoose.model('DmmSettingParameters', DmmSettingParametersSchema);
