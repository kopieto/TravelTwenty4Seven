const express= require("express");
const router = express.Router();

router.get("/", async (req, res) => {
    res.render("templates/index");
});

router.get("/contacts", async (req, res) => {
    res.render("templates/contacts");
});


// ********************************************************


module.exports = router;

