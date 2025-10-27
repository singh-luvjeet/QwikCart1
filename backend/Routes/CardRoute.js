const { cards, viewCard, addCard, editCard, deleteCard } = require('../Controllers/CardController')
const authMiddleware = require('../Middlewares/Auth')
const router = require('express').Router()
const multer = require('multer')
const { storage } = require('../cloudConfig')
const upload = multer({ storage })

router.get('/', authMiddleware, cards)
router.get('/:id', authMiddleware, viewCard)
router.post('/add-card', authMiddleware, upload.array('images', 4), addCard)
router.patch('/:id/edit', authMiddleware, upload.array('images', 4), editCard)
router.delete('/:id/delete', authMiddleware, deleteCard)

module.exports = router
