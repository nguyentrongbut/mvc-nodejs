module.exports.priceNewProducts = (products) => {
    const newProducts = products.map(product => {
        product.priceNew = (product.price * (100 - product.discountPercentage)/100).toFixed(0)
        return product;
    })

    return newProducts;
}

module.exports.priceNewProduct = (product) => {
    const priceNew =  (product.price * (100 - product.discountPercentage)/100).toFixed(0)

    return priceNew
}