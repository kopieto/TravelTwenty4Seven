const express= require("express");
const loginCheck = require("../middlewares/redirects");
const identify = require("../middlewares/identify");
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

router.get("/logout", identify, async (req, res) => {
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
        res.send(err)
    }
});


//can create a function for logout
router.get("/logout/all", identify, async (req, res) => {
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



module.exports = router;

