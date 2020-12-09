const express = require("express");
const User = require("../models/user");
const Parcel = require("../models/parcel");
const identify = require("../middlewares/identify");
const confirm = require("../middlewares/confirm")
// const auth = require("../middlewares/auth");
const router = express.Router();

// router.get("/users", identify, auth, async (req, res) => {
//     try {
//         const users = await User.find();
//         res.render("users/users", {
//             logLink: req.session.t247 ? "logout" : "login",
//             users
//         });

//     } catch (err) {
//         console.log(err);
//         res.redirect("/users/me");
//     }
// });





//create different render for admins
router.get("/users/home", identify, async (req, res) => {
    try {
        let parcels = await Parcel.find({
            sender: req.user._id
        });
        parcels = parcels.filter(parcel => parcel.status !== "delivered");

        res.render("users/home", {
            logLink: (req.session.t247 ? "logout" : "login"),
            username: req.user.name,
            parcels
        });
    } catch (err) {
        res.redirect("/users/login");
    }
});

router.get("/users/update", identify, async (req, res) => {

    res.render("users/update", {
        logLink: req.session.t247 ? "logout" : "login",
        username: req.user.name
    });
});

router.get("/users/history", identify, async (req, res) => {
    const parcels = await Parcel.find({ sender: req.user._id }, {rName: 1, status: 1, rCountry:1 });
    res.send(parcels)
})

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