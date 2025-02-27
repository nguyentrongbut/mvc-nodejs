const md5 = require('md5');

const Account = require("../../models/account.model");

const Role = require("../../models/role.model");

const {prefixAdmin} = require("../../config/system");

// [GET] /admin/accounts
module.exports.index = async (req, res) => {
    let find = {
        deleted: false,
    }

    const records = await Account.find(find).select("-password -token");

    for (const record of records) {
        const role = await Role.findOne({
                deleted: false,
                _id: record.role_id
            })
        record.role = role
    }

    res.render('admin/pages/accounts/index', {
        pageTitle: "Trang danh sách tài khoản",
        records: records,
    })
}

// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
    const roles = await Role.find({
        deleted: false,
    })

    res.render('admin/pages/accounts/create.pug', {
        pageTitle: "Tạo mới tài khoản",
        roles: roles,
    })
}

// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
    const emailExit = await Account.findOne({
        email: req.body.email,
        deleted: false,
    })

    if (emailExit) {
        req.flash("error", `Email ${req.body.email} này đã tồn tại!`)
        res.redirect("back")
    } else {
        req.body.password = md5(req.body.password)

        const record = new Account(req.body);
        await record.save()

        res.redirect(`${prefixAdmin}/accounts`);
    }

}