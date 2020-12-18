const mongoose = require("mongoose")

const travelSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        unique: true
    },
    ticketsLeft: {
        type: Number,
        default: 7,
        min: 0,
        max: 7
    },
    passangers: [{ 
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        tickets: {
            type: Number,
        },
        pickUpPoint: {
            type: String,
            default: "home",
            trim: true,
            lowercase: true
        },
        destination: {
            type: String,
            trim: true,
            lowercase: true
        }
    }],
    parcels: [{
        parcel: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Parcel"
        }
    }]
}, {
    timestamps: true
});

const Travel = mongoose.model("Travel", travelSchema);

module.exports = Travel