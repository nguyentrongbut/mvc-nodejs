const Cart = require('../../models/cart.model');

module.exports.cardId = async (req, res, next) => {

    if (!req.cookies.cartId) {
        const cart = new Cart();
        await cart.save();

        const expiresTime = 1000 * 60 * 60 * 1000;

        res.cookie("cartId", cart.id, {
            expires: new Date(Date.now() + expiresTime),
        })
    } else {
        const cart = await Cart.findOne({
            _id: req.cookies.cartId,
        })

        cart.totalQuantity = cart.products.reduce((total, product) => {
            return total + product.quantity;
        }, 0)

        res.locals.miniCart = cart;
    }

    next()
}