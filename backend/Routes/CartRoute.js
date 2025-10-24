const { cart, addToCart, updateSelectedItem } = require("../Controllers/CartController");
const authMiddleware = require("../Middlewares/Auth");
const router = require("express").Router();

router.get('/', authMiddleware, cart)
router.post('/add', authMiddleware, addToCart)
router.put('/selected', authMiddleware, updateSelectedItem)

module.exports = router;