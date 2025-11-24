const productsService = require('../services/products.service');

exports.getProducts = async (req, res) => {
    const products = await productsService.getProducts();
    if (products) {
        res.json(products);
    } else {
        res.status(500).json({ message: 'Failed to fetch products' });
    }
};

exports.getCartItems = async (req, res) => {
    const user_id = req.user.id;
    const resultItems = await productsService.getCartItems(user_id);

    if (resultItems) {
        res.json({ resultItems });
    } else {
        res.status(500).json({ message: 'Failed to get cart items' });
    }
};

exports.addProductToCart = async (req, res) => {
    const { product_id } = req.body;
    const user_id = req.user.id;

    const result = await productsService.addProductToCart(user_id, product_id);

    if (result) {
        res.json({ message: 'Added to cart successfully' });
    } else {
        res.status(500).json({ message: 'Failed to add product to cart' });
    }
};

exports.updateCart = async (req, res) => {
    const { product_id, quantity } = req.body;
    const user_id = req.user.id;

    const result = await productsService.updateCart(user_id, product_id, quantity);

    if (result) {
        res.json({ message: 'Updated cart successfully' });
    } else {
        res.status(500).json({ message: 'Failed to update cart' });
    }
}

exports.deleteProductFromCart = async (req, res) => {
    const { product_id } = req.body;
    const user_id = req.user.id;

    const result = await productsService.deleteProductFromCart(user_id, product_id);

    if (result) {
        res.json({ message: 'Deleted from cart successfully' });
    } else {
        res.status(500).json({ message: 'Failed to delete product from cart' });
    }
};

exports.decrementQuantity = async (req, res) => {};