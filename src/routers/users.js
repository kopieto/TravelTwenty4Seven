const express = require("express");
const User = require("../models/user");
const identify = require("../middlewares/identify");
const auth = require("../middlewares/auth")
const router = express.Router();

router.get("/users", identify, auth, async (req, res) => {
    try {
        const users = await User.find();
        res.render("users/users", {
            users,
        });

    } catch (err) {
        console.log(err);
        res.redirect("/users/me");
    }
});

router.post("/users", async (req, res) => {
    try {
        const user = new User(req.body);
        const token = await user.tokenGenerator();

        res.cookie("t247", token)
            .render("users/user", {
                user: user,
            });
    } catch (err) {
        console.log(err);
        res.redirect("/users/signin");
    }
});

router.get("/users/signin", async (req, res) => {
    res.render("users/signin");
});

router.get("/users/login", async (req, res) => {
    if (req.cookies.t247) {
        const user = await User.findOne({
            "tokens.token": req.cookies.t247
        });
        if (user) {
            res.redirect("/users/me")
        }
    }
        res.render("users/login", {
            loginError: ""
        });
});

router.post("/users/login", async (req, res) => {
    try {
        const {
            user,
            token
        } = await User.login(req.body.email, req.body.password);

        res.cookie("t247", token)
            .render("users/user", {
                user: user,
            });;


    } catch (err) {
        console.log(err);
        res.render("users/login", {
            loginError: err.message
        });
    }

})


//create different render for admins
router.get("/users/me", identify, async (req, res) => {
    try {
        res.render("users/user", {
            user: req.user,
        });
    } catch (err) {
        res.redirect("users/login")
    }
});

router.get("/users/logout", identify, async (req, res) => {
    try {
        const user = req.user;
        user.tokens = user.tokens.filter(token => token.token !== req.token)
        await user.save()

        res.redirect("/");
    } catch (err) {
        console.log(err)
        res.redirect("/")
    }
});

router.get("/users/:id", identify, auth, async (req, res) => {
    const user = await User.findById(req.params.id);


    //create page to render with parcels and travel history
    res.send(user);
})

module.exports = router;