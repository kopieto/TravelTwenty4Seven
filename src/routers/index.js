const express= require("express");
const router = express.Router();

router.get("/", async (req, res) => {
    res.render("templates/index");
});

router.get("/contacts", async (req, res) => {
    res.render("templates/contacts");
});


                    //move to travel routers/travel.js when ready


// ********************************************************


router.get("/404", (req, res) => {
    res.render("templates/upps", {
        error: "404  Page not found!"
    })
});

router.get("/*", async (req, res) => {
    res.redirect("/404")
   });

module.exports = router;

