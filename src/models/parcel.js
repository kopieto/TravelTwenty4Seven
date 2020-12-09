const mongoose = require("mongoose");

const parcelSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    sName: {
        type: String,
        required: true,
        ref: "User"
    },
    rName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    rPhoneNumber: {
        type: String,
        required: true,
        trim: true
    },
    rCountry: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    rCity: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    rStreet: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    rPostcode: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    comment: {
        type: String,
        trim: true,
        lowercase: true,
    },
    status: {
        type: String,
        default: "requested", //requested, collected, in transit, delivered
        lowercase: true
    }
}, {
    timestamps: true
});


const Parcel = mongoose.model("Parcel", parcelSchema);

module.exports = Parcel;