const homeRouters = require('./home.route')
const productRouters = require('./product.route')
const searchRouters = require('./search.route')
const cartRouters = require('./cart.route')
const checkoutRouters = require('./checkout.route')
const userRouters = require('./user.route')
const chatRouters = require('./chat.route')
const authMiddlewares = require('../../middlewares/client/auth.middlewares')
const categoryMiddlewares = require('../../middlewares/client/category.middlewares')
const cartMiddlewares = require('../../middlewares/client/cart.middlewares')
const userMiddlewares = require('../../middlewares/client/user.middlewares')
const settingMiddlewares = require('../../middlewares/client/setting.middlewares')

module.exports = (app) => {
    app.use(categoryMiddlewares.category)

    app.use(cartMiddlewares.cardId)

    app.use(userMiddlewares.infoUser)

    app.use(settingMiddlewares.settingGeneral)

    app.use('/', homeRouters);

    app.use('/products', productRouters);

    app.use('/search', searchRouters)

    app.use('/cart', cartRouters)

    app.use('/checkout', checkoutRouters)

    app.use('/user', userRouters)

    app.use('/chat',
        authMiddlewares.requireAuth,
        chatRouters)
}