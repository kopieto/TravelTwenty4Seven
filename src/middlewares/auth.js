const auth = async (req, res, next) => {
    if (req.user.email === "test") {
        next();
    } else {
        res.redirect("/users/me")
    }
}

module.exports = auth