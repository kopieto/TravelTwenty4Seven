const express = require("express");
const identify = require("../middlewares/identify");
const setTravelOptions = require("../middlewares/setTravelOptions");
const Travel = require("../models/travel");
const router = express.Router();

router.get("/travels", identify, async (req, res) => {
    try {
        res.render("templates/travel", {
            logLink: (req.session.t247 ? "logout" : "login"),
            user: req.user
        });
    } catch (err) {
        console.log(err);
        res.status(503).send();
    }
});

router.get("/tickets", identify, async (req, res) => {
    try {
        const {
            date
        } = req.query;

        let response = await setTravelOptions(date, req.user.name)
        console.log(req.query);
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

router.post("/travels", identify, async (req, res) => {
    console.log("req.body:");
    console.log(req.body.date);
    try {
        let booked = false;
        const travel = await Travel.findOne({
            date: req.body.date
        });
     

        travel.passangers.forEach(passanger => {
            console.log(passanger.destination, " = ", req.body.destination);
            if (passanger.user.toString() == req.user._id.toString() && passanger.destination === req.body.destination.toLowerCase()) {
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

        //Sent emali to admins

        res.redirect("users/history?msg=Thank you! We will call you soon!");
    } catch (err) {
        console.log(err);
        res.send(err.message)
    }


});

router.get("/travels/*", identify, async (req, res) => {
    try {
        res.render("templates/travel", {
            logLink: (req.session.t247 ? "logout" : "login"),
            user: req.user
        });
    } catch (err) {
        console.log(err);
        res.status(503).send();
    }
});



module.exports = router;