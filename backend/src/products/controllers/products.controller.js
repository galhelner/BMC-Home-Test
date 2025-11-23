const productsService = require('../services/products.service');

exports.getProducts = async (req, res) => {
    const products = await productsService.getProducts();
    if (products) {
        res.json(products);
    } else {
        res.status(500).json({ message: 'Failed to fetch products' });
    }
};

exports.getCartItems = async (req, res) => {};

exports.addProductToCart = async (req, res) => {};

exports.deleteProductFromCart = async (req, res) => {};

exports.incrementQuantity = async (req, res) => {};