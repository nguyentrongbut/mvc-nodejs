const Product = require("../../models/product.model");
const {prefixAdmin} = require("../../config/system");

// [GET] /products
module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "active",
        deleted: false,
    })
        .sort({ position: "desc"})

   const newProducts = products.map(product => {
       product.priceNew = (product.price * (100 - product.discountPercentage)/100).toFixed(0)
       return product;
   })

    res.render('client/pages/products/index', {
        pageTitle: "Trang danh sách sản phẩm",
        products: newProducts,
    })
}

// [GET] /products/:slug
module.exports.detail = async (req, res) => {

    try {
        const find = {
            deleted: false,
            slug: req.params.slug,
            status: "active",
        }

        const product = await Product.findOne(find);

        res.render("client/pages/products/detail", {
            pageTitle: "Trang chi tiết sản phẩm",
            product: product,
        });
    } catch (error) {
        res.redirect(`/products`);
    }

}