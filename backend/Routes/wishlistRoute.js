const { wishlists, addWishlist } = require("../Controllers/wishlistController");
const authMiddleware = require("../Middlewares/Auth");
const router = require("express").Router();

router.get('/', authMiddleware, wishlists)
router.post('/add', authMiddleware, addWishlist)

module.exports = router;