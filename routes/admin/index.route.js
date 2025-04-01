const systemConfig = require("../../config/system")

const authMiddleware = require("../../middlewares/admin/auth.middlewares");

const dashboardRouters = require("./dashboard.route")
const productRouters = require("./product.route")
const productCategoryRouters = require("./products-category.router")
const roleRouters = require("./role.router")
const accountRouters = require("./account.route")
const authRouters = require("./auth.route")
const myAccountRouters = require("./my-account")
const settingRouters = require("./setting.route")


module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin

    app.use(PATH_ADMIN + '/dashboard',
        authMiddleware.requireAuth,
        dashboardRouters);

    app.use(PATH_ADMIN + '/products',
        authMiddleware.requireAuth,
        productRouters);

    app.use(PATH_ADMIN + '/products-category',
        authMiddleware.requireAuth,
        productCategoryRouters);

    app.use(PATH_ADMIN + '/roles',
        authMiddleware.requireAuth,
        roleRouters);

    app.use(PATH_ADMIN + '/accounts',
        authMiddleware.requireAuth,
        accountRouters);

    app.use(PATH_ADMIN + '/auth', authRouters);

    app.use(PATH_ADMIN + '/my-account',
        authMiddleware.requireAuth,
        myAccountRouters);

    app.use(PATH_ADMIN + '/settings',
        authMiddleware.requireAuth,
        settingRouters);
}