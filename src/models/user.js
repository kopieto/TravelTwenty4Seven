const mongoose = require("mongoose");
const sgMail = require("@sendgrid/mail");
const bcrypt = require("bcryptjs");
const {
    generate
} = require("generate-password");
const {
    sign,
    verify
} = require("jsonwebtoken");

const Travel = require("../models/travel");
const Parcel = require("../models/parcel");

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
    } else {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Invalid username or password!")
        } else {
            //delete expiry tokens
            user.tokens = user.tokens.filter(token => verify(token.token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) {
                    return false
                } else {
                    return true
                }
            }));

            const token = await user.tokenGenerator();

            return {
                user,
                token
            };
        }
    }
}

userSchema.statics.randomPassword = async (email) => {
    let msg = "Please check your email!";
    const user = await User.findOne({
        email
    });

    if (user) {
        const name = user.name.split(" ")[0];

        const newPassword = generate({
            length: 12,
            numbers: true,
        });

        const title = "New password";
        const body =
            `Hello ${name.slice(0,1).toUpperCase() + name.slice(1)}! This email contains your new password.
     Please change it ASAP to your memorable and secure password.
      Your password is: ${newPassword}`;

        user.sendEmail(title, body);
        user.password = newPassword;
        user.save();
    } else {
        msg = "Please try again later";
    }

    return msg;
}

userSchema.methods.tokenGenerator = async function () {
    const token = await sign({
        _id: this._id
    }, process.env.JWT_SECRET, {
        expiresIn: `${ process.env.SESS_MAXAGE }`
    });

    this.tokens.push({
        token
    });
    await this.save();
    return token
}

userSchema.methods.findTickets = async function () {
    const travels = await Travel.find({
        "passangers.user": this._id
    });
    console.log(travels);
    const tickets = [];

    travels.forEach(travel => {
        const passangers = travel.passangers;
        passangers.forEach(passanger => {
            if (passanger.user.toString() === this._id.toString()) {
                const ticket = Object.assign(passanger, { date: travel.date});
                tickets.push(ticket)
            }
        })

    })

    return tickets;
}

userSchema.methods.findParcels = async function () {
    return await Parcel.find({
        sender: this._id
    }, {
        status: 1,
        rName: 1,
        rCountry: 1,
        updatedAt: 1
    });
}

userSchema.methods.sendEmail = async function (subject, text) {
    try {
        const msg = {
            to: this.email,
            from: "ceco.sirakov@gmail.com",
            subject,
            text
        }
        await sgMail.send(msg);
    } catch (err) {
        console.log(err);
        console.error("console.error: " + err);
    }
}

userSchema.pre("save", async function () {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 8);
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;