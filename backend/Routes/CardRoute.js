const { cards, viewCard } = require("../Controllers/CardController");
const authMiddleware = require("../Middlewares/Auth");
const router = require("express").Router();

router.get('/', authMiddleware, cards)
router.get('/:id',authMiddleware, viewCard)

module.exports = router;