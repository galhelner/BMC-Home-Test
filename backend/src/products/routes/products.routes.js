const express = require('express');
const router = express.Router();
const productController = require('../controllers/products.controller');
const authenticateToken = require('../../auth/middlewares/authMiddleware');

router.use('/', authenticateToken);

// return all available products
router.get('/', productController.getProducts);

// return all cart items for a specific user by id
router.get('/cart:user_id', productController.getCartItems);

// add a product to cart by product_id and user_id
router.post('/cart', productController.addProductToCart);

// delete a product from a cart by product_id and user_id
router.delete('/cart', productController.deleteProductFromCart);

// increment product quantity by product_id and user_id
router.post('/cart/increment', productController.incrementQuantity);

module.exports = router;