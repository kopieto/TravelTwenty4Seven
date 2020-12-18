const express = require("express");
const identify = require("../middlewares/identify");
const setTravelOptions = require("../middlewares/setTravelOptions");
const Travel = require("../models/travel");
const router = express.Router();

router.get("/travel", identify, async (req, res) => {
    res.render("templates/travel-form", {
        logLink: (req.session.t247 ? "logout" : "login"),
        username: req.user.name
    });
});

router.get("/travels", identify, async (req, res) => {
    try {
        const {
            date
        } = req.query;

        let response = await setTravelOptions(date, req.user.name)

        res.send(response)
    } catch (err) {
        console.log(err);
        res.send(err.message)
    }

})

router.get("/travels/all", async (req, res) => {
    try {
        const travels = await Travel.find();
        res.send(travels);
    } catch (err) {
        console.log(err);
        res.send(err.message);
    }
})

router.post("/travel", identify, async (req, res) => {
    console.log(req.body);
    try {
        let booked = false;
        const travel = await Travel.findOne({
            date: req.body.date
        });

        travel.passangers.forEach(passanger => {
            if (passanger.user.toString() == req.user._id.toString()) {
                passanger.tickets = Number(passanger.tickets) + Number(req.body.ticketsRequest);
                booked = true;
            }
        });

        if (!booked) {
            travel.passangers.push({
                user: req.user._id,
                tickets: req.body.ticketsRequest,
                destination: req.body.destination
            })
        }

        travel.ticketsLeft -= req.body.ticketsRequest;
        await travel.save();

        res.redirect("users/home?msg=We will call you ASAP to confirm your booking!");
    } catch (err) {
        console.log(err);
        res.send(err.message)
    }


});



module.exports = router;