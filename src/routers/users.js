const express = require("express");
const User = require("../models/user");
const router = express.Router();


router.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        if (users.length < 1) {
            users.push({name: "No signed users"})
        }
        res.render("templates/users", {
            users
        });
    } catch (err) {
        res.send(500)
    }
});

router.get("/signin", async (req, res) => {
    try {
       res.render("templates/signin");
    } catch (err) {
       res.redirect("/upps");
    }
});

router.get("/login", async (req, res) => {
    try {
       res.render("templates/signin");
    } catch (err) {
       res.redirect("/login");
    }
});

router.post("/login", async (req, res) => {
    try {
    const user = User.login(req.body.email, req.body.password);
        
       res.render("templates/user", {
           users: [user]
       });
    } catch (err) {
       res.send(500);
    }
});

router.get("/users/me", async (req, res) => {
    try {
        const user = await User.find({
            email: req.body.email
        });
        res.render("templates/users", {
            users: [user]
        })
    } catch (err) {
        res.redirect("/*");
    }
});

router.post("/users", async (req, res) => {
    try {

    } catch (err) {

    }
});

router.get("/users/*", async (req, res) => {
    res.redirect("/404");
});


module.exports = router;