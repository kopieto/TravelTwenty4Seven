const loginCheck = async (req, res, next) => {
        if (req.session.t247) {
            res.redirect("users/home");
        } else {
            next();
        }
}

module.exports = loginCheck;