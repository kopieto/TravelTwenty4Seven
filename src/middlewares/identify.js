const {
    verify
} = require("jsonwebtoken");
const User = require("../models/user");

const identify = async (req, res, next) => {
    try {
        const {
            _id
        } = await verify(req.session.t247, process.env.JWT_SECRET);
        const user = await User.findOne({
            _id,
            'tokens.token': req.session.t247
        });

        if (!user) {
            res.redirect("/login");
        } else {

            req.user = user;
            next();
        }
    } catch (err) {
        console.log("from Identify!: " + err)
        res.redirect("/login")
    }
}

module.exports = identify;