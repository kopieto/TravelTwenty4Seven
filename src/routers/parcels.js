const express = require("express");
const router = express.Router();

const Parcel = require("../models/parcel");

router.get("/parcels", async (req, res) => {
    res.render("parcels/home");
});

router.post("/parcels", async (req, res) => {
    console.log(req.body);

    // sgMail.send({
    //     to: "ceco.sirakov@gmail.com",
    //     from: "ceco.sirakov@gmail.com",
    //     subject: "Traveling",
    //     text: emailContent
    // })

    res.render("templates/starter",{
        content: "Thank you! We will call you soon"

    });
});

router.post("/parcels/update", async (req, res) => {
    console.log(req.body);
    console.log("updated")

    // sgMail.send({
    //     to: "ceco.sirakov@gmail.com",
    //     from: "ceco.sirakov@gmail.com",
    //     subject: "Traveling",
    //     text: emailContent
    // })

    res.render("templates/starter",{
        content: "Thank you! We will call you soon"

    });
});

module.exports = router;