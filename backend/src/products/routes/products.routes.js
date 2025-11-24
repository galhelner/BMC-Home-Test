const express = require('express');
const router = express.Router();
const productController = require('../controllers/products.controller');
const authenticateToken = require('../../auth/middlewares/authMiddleware');

router.use('/', authenticateToken);

// return all available products
router.get('/', productController.getProducts);

// updates a cart product quantity
router.put('/cart', productController.updateCart);

// return all cart items for a specific user by id
router.get('/cart', productController.getCartItems);

// add a product to cart by product_id and user_id
router.post('/cart', productController.addProductToCart);

// delete a product from a cart by product_id and user_id
router.delete('/cart', productController.deleteProductFromCart);

// decrement cart product quantity
router.post('/cart/decrement', productController.decrementQuantity);

module.exports = router;