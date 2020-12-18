const mongoose = require("mongoose");


const ticketSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    pickUpPoint: {
        type: String,
        default: "home",
        trim: true,
        lowercase: true,
    },
    destination: {
        type: String,
        trim: true,
        lowercase: true,
        required: true
    }
}, {
    timestamps: true
});

const Ticket = mongoose.model("Ticket", ticketSchema)