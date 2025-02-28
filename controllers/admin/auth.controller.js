const md5 = require('md5');
const Account = require("../../models/account.model")
const {prefixAdmin} = require("../../config/system")

// [GET] /admin/auth/login
module.exports.login = async (req, res) => {
    if (req.cookies.token) {
        res.redirect(`${prefixAdmin}/dashboard`);
    } else {
        res.render('admin/pages/auth/login', {
            pageTitle: "Trang đăng nhập",
        })
    }
}

// [POST] /admin/auth/login
module.exports.loginPost = async (req, res) => {
   const { email, password } = req.body;

   const user = await Account.findOne({
       email: email,
       deleted: false,
   })

    if (!user) {
        req.flash("error", "Email không tồn tại!")
        res.redirect("back");
        return;
    }

    if (md5(password) != user.password) {
        req.flash("error", "Password sai!")
        res.redirect("back");
        return;
    }

    if (user.status == "inactive") {
        req.flash("error", "Tài khoản đã bị khóa!")
        res.redirect("back");
        return;
    }

    res.cookie("token", user.token)
    res.redirect(`${prefixAdmin}/dashboard`);
}

// [GET] /admin/auth/logout
module.exports.logout = async (req, res) => {
    res.clearCookie("token");
    res.redirect(`${prefixAdmin}/auth/login`);
}