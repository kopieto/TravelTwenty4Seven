const express= require("express");
const loginCheck = require("../middlewares/redirects");
const router = express.Router();


router.get("/", async (req, res) => {
    console.log(req.session.t247);
    res.render("templates/index", {
        logLink: req.session.t247 ? "logout" : "login"
    });
});


router.get("/contacts", async (req, res) => {
    res.render("templates/contacts", {
        logLink: req.session.t247 ? "logout" : "login"
    });
});

router.get("/signin", loginCheck, async (req, res) => {
    res.render("templates/signin", {
        logLink: req.session.t247 ? "logout" : "login",
    });
});

router.get("/login", loginCheck, async (req, res) => {
    res.render("templates/login", {
        logLink: req.session.t247 ? "logout" : "login",
        loginError: ""
    });
});

router.get("/logout", async (req,res) => {
    res.redirect("/users/logout");
})

module.exports = router;