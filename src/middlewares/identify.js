const {
    verify
} = require("jsonwebtoken");
const User = require("../models/user");

const identify = async (req, res, next) => {
    try {
        const verified = await verify(req.cookies.t247, process.env.JWT_SECRET);
        const user = await User.findOne({
            _id: verified._id,
            'tokens.token': req.cookies.t247
        })

        if (!user) {
            res.redirect("/users/login");
        } else {
            req.user = user;
            req.token = req.cookies.t247;

            delete req.cookies.t247;
            next();
        }
    } catch (err) {
        console.log(err)
        res.status(401).send("Unauthorized request")
    }
}

module.exports = identify