const express = require("express");
const genPassword = require("generate-password");
const User = require("../models/user");
// const Parcel = require("../models/parcel");
const identify = require("../middlewares/identify");
const confirm = require("../middlewares/confirm")
const auth = require("../middlewares/auth");
const generateMessage = require("../middlewares/msgGenerator");

const router = express.Router();

router.get("/users", identify, auth, async (req, res) => {
    try {
        const users = await User.find();
        res.render("users/users", {
            logLink: req.session.t247 ? "logout" : "login",
            users
        });

    } catch (err) {
        console.log(err);
        res.redirect("/users/me");
    }
});

//create different render for admins
router.get("/users/home", identify, async (req, res) => {
    try {
        let parcels = await req.user.findParcels();
        let {
            msg,
            msgHref
        } = await generateMessage(parcels);

        if (req.query.msg) {
            msg = req.query.msg
            msgHref = "/users/history"

        } 
        res.render("users/home", {
            logLink: (req.session.t247 ? "logout" : "login"),
            username: req.user.name,
            user: req.user,
            msg,
            msgHref,
            parcels
        });
    } catch (err) {
        console.log(err);
        res.redirect("/users/login");
    }
});

router.get("/users/update", identify, async (req, res) => {
    const {
        name,
        email,
        phoneNumber,
        country,
        city,
        street,
        postcode
    } = req.user

    res.render("users/update", {
        logLink: req.session.t247 ? "logout" : "login",
        username: name,
        email,
        phoneNumber,
        country,
        city,
        street,
        postcode
    });
});

router.get("/users/history", identify, async (req, res) => {
    const tickets = await req.user.findTickets();
    const parcels = await req.user.findParcels();

    res.render("users/history", {
        logLink: (req.session.t247 ? "logout" : "login"),
        username: req.user.name,
        parcels,
        tickets,
        destination: "heaven"
    })
})
router.get("/users/logout", identify, async (req, res) => {
    try {
        const user = req.user;
        user.tokens = user.tokens.filter(token => token.token !== req.session.t247);
        await user.save();

        req.session.destroy(err => {
            if (err) {
                res.redirect("users/home")
            }
        });

        res.clearCookie(process.env.SESS_NAME)
            .redirect("/");
    } catch (err) {
        console.log(err)
        res.send(err.message)
    }
});


//can create a function for logout
router.get("/users/logout/all", identify, async (req, res) => {
    const user = req.user;
    user.tokens = [];
    await user.save();

    req.session.destroy(err => {
        if (err) {
            res.redirect("users/home")
        }
    });
    res.clearCookie(process.env.SESS_NAME)
        .redirect("/");
});

router.get("/users/password", async (req, res) => {
    try {
        const user = await User.findOne({
            email: req.query.email
        });
        if (user) {
            const name = user.name.split(" ")[0];

            const newPassword = genPassword.generate({
                length: 12,
                numbers: true,
            });

            const title = "New password";
            const body =
                `Hello ${name.slice(0,1).toUpperCase()+name.slice(1)}! This email contains your new password.
         Please change it ASAP to your memorable and secure password.
          Your password is: ${newPassword}`;

            user.sendEmail(title, body);
            user.password = newPassword;
            user.save();
        } else {
            throw new Error("Invalid email");
        }

        res.render("templates/login", {
            logLink: req.session.t247 ? "logout" : "login",
            loginError: "Please check your email! "
        });
    } catch (err) {
        console.log(err);
        res.send(err.message);
    }
});

router.get("/users/:id", async (req, res) => {
    const user = await User.findById(req.params.id);


    //create page to render with parcels and travel history
    res.send(user);
})

router.post("/users", async (req, res) => {
    try {
        const user = new User(req.body);
        const token = await user.tokenGenerator();

        req.session.t247 = token;
        res.redirect("/users/home");
    } catch (err) {
        console.log(err);
        res.redirect("/users/signin");
    }
});

router.post("/users/login", async (req, res) => {
    try {
        const {
            user,
            token
        } = await User.login(req.body.email, req.body.password);

        req.session.t247 = token;
        res.redirect("/users/home");
    } catch (err) {
        console.log(err);
        res.render("templates/login", {
            logLink: req.session.t247 ? "logout" : "login",
            loginError: err.message
        });
    }
});

router.post("/users/update", identify, confirm, async (req, res) => {
    try {
        console.log(req.body);

        const allowUpdates = ["name", "email", "password", "phoneNumber", "country", "city", "street", "postcode"];
        const updates = Object.keys(req.body);
        const isValid = updates.every(update => allowUpdates.includes(update));

        if (!isValid) {
            res.send("invalid inputs")
        } else {
            const user = req.user;
            updates.forEach(update => {
                if (req.body[update]) {
                    user[update] = req.body[update];
                }
            })

            await user.save();
            res.redirect("/users/home?updated");
        }
    } catch (err) {
        console.log(err);
        res.send(err);
    }
});

module.exports = router;