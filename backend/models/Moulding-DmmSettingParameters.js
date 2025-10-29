const mongoose = require('mongoose');

const DmmSettingParametersSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    machine: {
        type: String,
        required: true
    },
    shifts: {
        shiftI: {
            operatorName: String,
            checkedBy: String,
            signature: String
        },
        shiftII: {
            operatorName: String,
            checkedBy: String,
            signature: String
        },
        shiftIII: {
            operatorName: String,
            checkedBy: String,
            signature: String
        }
    },
    parameters: [{
        shift: {
            type: String,
            enum: ['SHIFT I', 'SHIFT II', 'SHIFT III'],
            required: true
        },
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
        ppParameters: {
            thickness: Number,
            height: Number,
            coreMaskThickness: Number,
            coreMaskHeight: Number,
            sandShotPressure: Number,
            squeezePressure: Number,
            ppSteppingPressure: {
                outside: Number,
                inside: Number,
                gasGenerator: Number
            },
            mouldThickness: Number,
            cycleTime: Number
        },
        spParameters: {
            thickness: Number,
            height: Number,
            coreMaskThickness: Number,
            coreMaskHeight: Number,
            sandShotPressure: Number,
            squeezePressure: Number,
            spSteppingPressure: {
                outside: Number,
                inside: Number,
                gasGenerator: Number
            },
            mouldThickness: Number,
            cycleTime: Number
        },
        remarks: String
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('DmmSettingParameters', DmmSettingParametersSchema);
