const mongoose = require("mongoose");

const parcelSchema = new mongoose.Schema({
    sender: {
        name: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        phoneNumber: {
            type: Number,
            required: true,
            trim: true
        },
        email: {
            type: String,
            trim: true,
            lowercase: true
        },
        address: {
            country: {
                type: String,
                required: true,
                trim: true,
                lowercase: true
            },
            city: {
                type: String,
                required: true,
                trim: true,
                lowercase: true
            },
            address: {
                type: String,
                required: true,
                trim: true,
                lowercase: true
            },
            postcode: {
                type: String,
                required: true,
                trim: true,
                lowercase: true
            }
        }
    },
    receiver: {
        name: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        phoneNumber: {
            type: Number,
            required: true,
            trim: true
        },
        address: {
            country: {
                type: String,
                required: true,
                trim: true,
                lowercase: true
            },
            city: {
                type: String,
                required: true,
                trim: true,
                lowercase: true
            },
            address: {
                type: String,
                required: true,
                trim: true,
                lowercase: true
            },
            postcode: {
                type: String,
                required: true,
                trim: true,
                lowercase: true
            }
        }
    }
}, {
    timestamps: true
});


const Parcel = mongoose.model("Parcel", parcelSchema);
module.exports = Parcel;