const {prefixAdmin} = require("../../config/system");
const Account = require("../../models/account.model")

module.exports.requireAuth = async (req, res, next) => {

    if (!req.cookies.token) {
        res.redirect(`${prefixAdmin}/auth/login`);
    } else {
        const user = await Account.findOne({ token: req.cookies.token })
        if (!user) {
            res.redirect(`${prefixAdmin}/auth/login`);
        } else {
            next()
        }
    }
}