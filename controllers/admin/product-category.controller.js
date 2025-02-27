const ProductCategory = require("../../models/product-category.model")
const { prefixAdmin} = require("../../config/system");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const createTreeHelper = require("../../helpers/createTree");

// [GET] /admin/products-category
module.exports.index = async (req, res) => {

    // Filter Status
    const filterStatus = filterStatusHelper(req.query);

    let find = {
        deleted: false,
    }

    if(req.query.status) {
        find.status = req.query.status;
    }

    // End Filter Status

    // Search
    const objectSearch = searchHelper(req.query);

    if (objectSearch.regex) {
        find.title = objectSearch.regex;
    }

    // End Search

    // Sort
    let sort = {};

    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue
    } else {
        sort.position = "desc"
    }

    // End Sort

    const records = await ProductCategory.find(find)
        .sort(sort)

    const newRecords = createTreeHelper.tree(records)

    res.render('admin/pages/products-category/index', {
        pageTitle: "Danh mục sản phẩm",
        filterStatus: filterStatus,
        records: newRecords,
        keyword: objectSearch.keyword,
    })
}

// [PATCH] /admin/products-category/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;

    await ProductCategory.updateOne({ _id: id }, { status: status });

    req.flash('success', 'Cập nhật trạng thái sản phẩm thành công');

    res.redirect("back")
}

// [PATCH] /admin/products-category/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type
    const ids = req.body.ids.split(", ");

    switch (type) {
        case "active":
            await ProductCategory.updateMany({ _id: ids }, { status: "active" });
            req.flash('success', `Cập nhật trạng thái thành công ${ids.length} sản phẩm`);
            break;
        case "inactive":
            await ProductCategory.updateMany({ _id: ids }, { status: "inactive" });
            req.flash('success', `Cập nhật trạng thái thành công ${ids.length} sản phẩm`);
            break;
        case "delete-all":
            await ProductCategory.updateMany({ _id: ids }, { deleted: "true", deletedAt: new Date() });
            req.flash('success', `Đã xóa thành công ${ids.length} sản phẩm`);
            break;
        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split("-");
                position = parseInt(position)

                await ProductCategory.updateOne({ _id: id }, { position: position});
            }
            req.flash('success', `Thay đổi thành công ${ids.length} vị trí của sản phẩm`);
            break;
        default:
            break;
    }

    res.redirect("back");
}

// [DELETE] /admin/products-category/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;

    await ProductCategory.updateOne({ _id: id }, {deleted: true, deletedAt: new Date() });

    req.flash('success', `Đã xóa thành công sản phẩm`);

    res.redirect("back")
}

// [GET] /admin/products-category/create.pug
module.exports.create = async (req, res) => {
    let find = {
        deleted: false,
    }

    const records = await ProductCategory.find(find);

    const newRecords = createTreeHelper.tree(records);

    res.render('admin/pages/products-category/create.pug', {
        pageTitle: "Tạo danh mục sản phẩm",
        records: newRecords,
    })
}

// [POST] /admin/products-category/create.pug
module.exports.createPost = async (req, res) => {
    if (req.body.position == "") {
        const countProducts = await ProductCategory.countDocuments({ deleted: false });
        req.body.position = countProducts + 1;
    } else {
        req.body.position = parseInt(req.body.position)
    }

    const record = new ProductCategory(req.body);

    await record.save();

    res.redirect(`${prefixAdmin}/products-category`);
}

// [GET] /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {

    try {
        const find = {
            deleted: false,
            _id: req.params.id,
        }

        const product = await ProductCategory.findOne(find);

        const records = await ProductCategory.find({deleted: false})

        const newRecords = createTreeHelper.tree(records)

        res.render("admin/pages/products-category/edit", {
            pageTitle: "Chỉnh sửa sản phẩm",
            product: product,
            records: newRecords,
        });
    } catch (error) {
        res.redirect(`${prefixAdmin}/products-category`);
    }
}

// [PATCH] /admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;

    req.body.position = parseInt(req.body.position)

    // upload local
    // if (req.file) {
    //     req.body.thumbnail = `/uploads/${req.file.filename}`
    // }

    try {
        await ProductCategory.updateOne({ _id: id }, req.body);
        req.flash('success', `Cập nhật thành công sản phẩm`);
    } catch (error) {
        req.flash('error', `Cập nhật sản phẩm thất bại!`);
    }

    res.redirect("back");
}

// [GET] /admin/products-category/detail/:id
module.exports.detail = async (req, res) => {

    try {
        const find = {
            deleted: false,
            _id: req.params.id,
        }

        const product = await ProductCategory.findOne(find);

        res.render("admin/pages/products-category/detail", {
            pageTitle: "Trang chi tiết sản phẩm",
            product: product,
        });
    } catch (error) {
        res.redirect(`${prefixAdmin}/products-category`);
    }
}