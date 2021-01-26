const express = require("express");
const router = express.Router();
const Parcel = require("../models/parcel");
const identify = require("../middlewares/identify");
const auth = require("../middlewares/auth");

router.get("/parcels", identify, async (req, res) => {
    res.render("parcels/parcels-form", {
        logLink: req.session.t247 ? "logout" : "login",
        user: req.user
    });
});

router.get("/parcels/all", identify, auth, async (req, res) => {
    try {
        const parcels = await Parcel.find();

        if (parcels.length < 1) {
            res.send("Parcels list is empty");
        } else {
            res.render("parcels/all", {
                user: req.user,
                parcels
            });
        }
    } catch (err) {
        console.log(err);
        res.send(err);
    }
});

router.post("/parcels", identify, async (req, res) => {
    try {
        console.log(req.body)

        const parcel = new Parcel({
            ...req.body,
            sender: req.user._id,
            sName: req.user.name
        })
        await parcel.save();

        // sgMail.send({
        //     to: "ceco.sirakov@gmail.com",
        //     from: "ceco.sirakov@gmail.com",
        //     subject: "New parcel",
        //     text: " Thank you! We will call you soon!"
        // })

        res.status(201)
            .redirect("/users/home");
    } catch (err) {
        console.log(err);
        res.send(err);
    }
});

router.post("/parcels/update", identify, async (req, res) => {
    console.log(req.body);
    console.log("updated")

    // sgMail.send({
    //     to: "ceco.sirakov@gmail.com",
    //     from: "ceco.sirakov@gmail.com",
    //     subject: "Traveling",
    //     text: emailContent
    // })

   res.redirect("/");
});

router.get("/parcels/*", identify, async (req, res) => {
    res.render("parcels/parcels-form", {
        logLink: req.session.t247 ? "logout" : "login",
        user: req.user
    });
});

module.exports = router;