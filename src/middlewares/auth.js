const auth = async (req, res, next) => {
    
    if (req.user.email === "ceco.sirakov@gmail.com") {
        next();
    } else {
        res.redirect("/users/me")
    }
}

module.exports = auth