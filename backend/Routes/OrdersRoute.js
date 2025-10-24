const { getOrders, addOrder } = require("../Controllers/OrderController");
const authMiddleware = require("../Middlewares/Auth");
const router = require("express").Router();

router.get('/', authMiddleware, getOrders)
router.post('/add', authMiddleware, addOrder)

module.exports = router;