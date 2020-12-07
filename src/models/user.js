const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { sign } = require("jsonwebtoken");

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
    phoneNumber: {
        type: String,
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
    street: {
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

    },
    tokens: [{
        token: {
            type: String,
        }
    }]
}, {
    timestamps: true
});

userSchema.statics.login = async (email, password) => { 
    const user = await User.findOne({
        email
    });
    if (!user) {
        throw new Error("Invalid username or password!");
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error("Invalid username or password!")
    }

    const token = await user.tokenGenerator();
    return { user, token };
}

userSchema.pre("save", async function () {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 8);
    }
})

userSchema.methods.tokenGenerator = async function () {
    const token = await sign({
        _id: this._id
    }, process.env.JWT_SECRET, {expiresIn: "1 day"});
    this.tokens.push({
        token
    });
    await this.save();

    return token
}


const User = mongoose.model("User", userSchema);

module.exports = User;