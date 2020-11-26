const mongoose = require("mongoose");

const parcelSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    weight: {
        type: Number,
        trim: true,
        min: 0
    },
    currentPosition: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    destination: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    mobileNumber: {
        type: String,
        required: true,
        trim: true
    }
})