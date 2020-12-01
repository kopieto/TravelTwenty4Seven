const express = require("express");
const router = express.Router();

router.get("/travel", async (req, res) => {
    res.render("templates/travel");
});

router.post("/travel", async (req, res) => {
    console.log(req.body);

    // sgMail.send({
    //     to: "ceco.sirakov@gmail.com",
    //     from: "ceco.sirakov@gmail.com",
    //     subject: "Traveling",
    //     text: emailContent
    // })

    res.render("templates/starter", {
        content: "Thank you! We will call you soon"
    });
});



module.exports = router;