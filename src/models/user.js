const mongoose = require("mongoose");
// jwt, bcryptjs

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    contactInfo: {
        phoneNumber: {
            type: Number,
            required: true,
            unique: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
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
    parcelsSend: {
        type: Number,
    },
    tokens: [{
        token: {
            type: String,
        }
    }]
},
{
    timestamps: true
});


userSchema.static.login = async (email, password) => {
    const user = await User.findOne({ email});

    if (!user) {
        throw new Error('Unable to login!')
    }
    if (password !== user.password) {
        throw new Error('Unable to login!')
    }
  
    return user

}

const User = mongoose.model("User", userSchema);
module.exports = User;