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
            res.redirect("/users/login?msg=Please login!");
        } else {
            req.user = user;
            next();
        }
    } catch (err) {
        console.log("identify: " + err.message);
        res.redirect("/");
    }
}

module.exports = identify;