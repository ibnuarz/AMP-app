const express = require("express");
const router = express.Router();
const { addProductToCart, viewProductsInCart, editCartItemQuantity, deleteCart, getCartItemsByTransactionCode } = require("../controllers/cartController");
const { authenticateToken } = require("../middleware/authenticateToken");
router.post("/add-cart-item", authenticateToken, addProductToCart);
router.delete('/cart-items/:id', authenticateToken, deleteCart);
router.get("/cart-items", authenticateToken, viewProductsInCart);
router.post("/edit-cart-item", authenticateToken, editCartItemQuantity);
router.get('/items/:transactionCode', authenticateToken, getCartItemsByTransactionCode);
module.exports = router;
