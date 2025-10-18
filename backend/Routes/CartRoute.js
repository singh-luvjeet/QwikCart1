const { cart, addToCart } = require("../Controllers/CartController");
const authMiddleware = require("../Middlewares/Auth");
const router = require("express").Router();

router.get('/', authMiddleware, cart)
router.post('/add', authMiddleware, addToCart)

module.exports = router;