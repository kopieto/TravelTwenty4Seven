const express = require("express");
const genPassword = require("generate-password");
const User = require("../models/user");
const identify = require("../middlewares/identify");
const confirm = require("../middlewares/confirm")
const auth = require("../middlewares/auth");
const generateMessage = require("../middlewares/msgGenerator");
const {
    amILogged
} = require("../middlewares/my-module")

const router = express.Router();

router.get("/users/login", amILogged, async (req, res) => {
    try {
        let loginError = ""
        if (req.query.msg) {
            loginError = req.query.msg;
        }
        res.render("templates/login", {
            logLink: req.session.t247 ? "logout" : "login",
            loginError
        })
    } catch (err) {
        res.status(503).send();
    }
});

router.get("/users/signin", amILogged, async (req, res) => {
    try {
        res.render("templates/signin", {
            logLink: req.session.t247 ? "logout" : "login",
        });
    } catch (err) {
        res.status(503).send();
    }
});

router.get("/users/no-password", async (req, res) => {
    try {
        const msg = await User.randomPassword(req.query.email);
        
        res.redirect(`/users/login?msg=${msg}`);
    } catch (err) {
        console.log(err);
        res.redirect(`/users/loggin?msg=${err.message}`);
    }
});

//create different render for admins
router.get("/users/home", identify, async (req, res) => {
    try {
        let parcels = await req.user.findParcels();
        let {
            msg,
            msgHref
        } = await generateMessage(parcels);

        if (req.query.msg) {
            msg = req.query.msg
            msgHref = "/users/history"

        }
        res.render("users/home", {
            logLink: (req.session.t247 ? "logout" : "login"),
            user: req.user,
            msg,
            msgHref,
            parcels
        });
    } catch (err) {
        console.log(err);
        res.redirect("/");
    }
});

router.get("/users/update", identify, async (req, res) => {
    try {
        res.render("users/update", {
            logLink: req.session.t247 ? "logout" : "login",
            user: req.user
        });
    } catch (err) {
        console.log("update: " + err.message);
        res.status(503).send()
    }
});

router.get("/users/history", identify, async (req, res) => {
    const tickets = await req.user.findTickets();
    // { date, user, tickets, pickUpPoint, destination }
    const parcels = await req.user.findParcels();

    res.render("users/history", {
        logLink: (req.session.t247 ? "logout" : "login"),
        user: req.user,
        parcels,
        tickets,
        destination: "heaven"
    })
});

router.get("/users/logout", identify, async (req, res) => {
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
        res.send(err.message)
    }
});


//can create a function for logout
router.get("/users/logout/all", identify, async (req, res) => {
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

//need to work on that for admins gets below
router.get("/users/all", identify, auth, async (req, res) => {
    try {
        const users = await User.find();
        res.render("users/users", {
            logLink: req.session.t247 ? "logout" : "login",
            users
        });

    } catch (err) {
        console.log(err);
        res.redirect("/users/me");
    }
});

// router.get("/users/:id", async (req, res) => {
//     const user = await User.findById(req.params.id);
//     //create page to render with parcels and travel history
//     res.send(user);
// })


//POSTS
router.post("/users", async (req, res) => {
    try {
        const user = new User(req.body);
        const token = await user.tokenGenerator();

        req.session.t247 = token;
        res.redirect("/users/home");
    } catch (err) {
        console.log(err);
        res.redirect(`/users/login?msg=May be you sing in before? `);
    }
});




router.post("/users/login", async (req, res) => {
    try {
        const {
            user,
            token
        } = await User.login(req.body.email, req.body.password);

        req.session.t247 = token;
        res.redirect("/users/home");
    } catch (err) {
        console.log("login: " + err.message);
        res.redirect(`/users/login?msg=${err.message}`);
    }
});

router.post("/users/update", identify, confirm, async (req, res) => {
    try {
        const allowUpdates = ["name", "email", "password", "phoneNumber", "country", "city", "street", "postcode"];
        const updates = Object.keys(req.body);
        const isValid = updates.every(update => allowUpdates.includes(update));

        if (!isValid) {
            res.status(501).send();
        } else {
            const user = req.user;
            updates.forEach(update => {
                if (req.body[update]) {
                    user[update] = req.body[update];
                }
            });

            await user.save();
            res.redirect("/users/home?updated");
        }
    } catch (err) {
        console.log(err);
        res.send(err);
    }
});

router.get("/users/*", async (req, res) => {
    try {
        res.redirect("/users/home")
    } catch (err) {
        res.status(503).send();
    }
});

module.exports = router;