const systemConfig = require("../../config/system")
const dashboardRouters = require("./dashboard.route")
const productRouters = require("./product.route")
const productCategoryRouters = require("./products-category.router")

module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin

    app.use(PATH_ADMIN + '/dashboard', dashboardRouters);

    app.use(PATH_ADMIN + '/products', productRouters);

    app.use(PATH_ADMIN + '/products-category', productCategoryRouters);
}