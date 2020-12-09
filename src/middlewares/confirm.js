const {
    compare
} = require("bcryptjs");

const confirm = async (req, res, next) => {
    try {
        if (!req.body.currentPassword) {
            res.redirect("/users/update?error=Need-Current-Password");
        } else {
            const isMatch = await compare(req.body.currentPassword, req.user.password);

            if (!isMatch) {
                res.redirect("/users/update?error=Need-Current-Password");
            } else {

                delete req.body.currentPassword;
                next()
            }
        }
    } catch (err) {
        console.log(err);
        res.send(err)
    }
}

module.exports = confirm