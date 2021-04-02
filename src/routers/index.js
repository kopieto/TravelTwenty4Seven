const express = require("express");
const { amILogged } = require("../middlewares/my-module");
const router = express.Router();


router.get("/", async (req, res) => {
    try {
        res.render("templates/index", {
            logLink: req.session.t247 ? "logout" : "login"
        });
    } catch (error) {
        res.status(503).send()
    }
});


router.get("/contacts", async (req, res) => {
    try {
        res.render("templates/contacts", {
            logLink: req.session.t247 ? "logout" : "login"
        });
    } catch (error) {
        res.status(503).send()
    }

});

router.get("/*", async (req, res) => {
    try {
        res.render("templates/index", {
            logLink: req.session.t247 ? "logout" : "login"
        });
    } catch (error) {
        res.status(503).send()
    }
});




module.exports = router;