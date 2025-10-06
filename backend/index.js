const express = require('express')
const app = express()
const mongoose = require('mongoose')
const authRoute = require('./Routes/AuthRoute')
const addressRoute = require('./Routes/AddressRoute');
const cors = require('cors')
const cookieParser = require('cookie-parser')
const authMiddleware = require('./Middlewares/Auth')
const Card = require('./Models/Card')
const Cart = require('./Models/Cart')
const multer = require('multer')
const { storage } = require('./cloudConfig')
const upload = multer({ storage })

const PORT = 4000

mongoose
  .connect('mongodb://127.0.0.1:27017/qwikcart')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err))

app.use(
  cors({
    origin: ['http://localhost:4000', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true
  })
)

app.use(cookieParser())
app.use(express.json())

app.use('/', authRoute)
app.use('/address', addressRoute);

app.get('/cards', async (req, res) => {
  try {
    const cards = await Card.find()
    res.json(cards)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

app.post(
  '/cards/add-card',
  authMiddleware,
  upload.array('images', 4),
  async (req, res) => {
    try {
      const { name, description, price } = req.body

      if (!name || !description || !price || !req.files?.length) {
        return res.status(400).json({ message: 'All fields are required' })
      }

      const imagePaths = req.files.map(file => file.path);

      const newCard = new Card({
        name,
        description,
        price,
        images: imagePaths,
        owner: req.user._id
      })
      await newCard.save()

      res
        .status(201)
        .json({ message: 'Product added successfully', product: newCard })
    } catch (err) {
      console.error(err)
      res.status(500).json({ message: 'Server error' })
    }
  }
)

app.get('/cards/:id', async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).json({ message: 'Card not found' });
    res.json(card); // anyone can access
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.patch(
  '/cards/:id/edit',
  authMiddleware,
  upload.array('images', 4),
  async (req, res) => {
    try {
      const { id } = req.params
      const { name, description, price } = req.body

      const card = await Card.findById(id)
      if (!card) return res.status(404).json({ message: 'Card not found' })

      if (card.owner.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({ message: 'Forbidden: You are not the owner' })
      }

      if (name) card.name = name
      if (description) card.description = description
      if (price) card.price = price
      
        // Parse the list of images to keep
        const imagesToKeep = req.body.existingImages ? JSON.parse(req.body.existingImages) : [];
        
        // Remove deleted images from card.images
        const removedImages = card.images.filter(img => !imagesToKeep.includes(img));
        // Optionally: delete removedImages from cloud storage here
  
        card.images = [...imagesToKeep];
  
        // Add newly uploaded images
        if (req.files?.length) {
          const newImagePaths = req.files.map(file => file.path);
          card.images.push(...newImagePaths);
        }
      await card.save()
      res.json({ message: 'Card updated successfully', card })
    } catch (err) {
      console.error(err)
      res.status(500).json({ message: 'Server error' })
    }
  }
)

app.delete('/cards/:id/delete', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const card = await Card.findById(id);
    if (!card) return res.status(404).json({ message: 'Card not found' });

    if (card.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden: You are not the owner' });
    }

    await Card.findByIdAndDelete(id);

    res.json({ message: 'Card deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


app.post('/cart/add', authMiddleware, async (req, res) => {
  const { productId, quantity } = req.body
  try {
    const userId = req.user._id

    let cart = await Cart.findOne({ userId })
    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId, quantity }]
      })
    } else {
      const existingItem = cart.items.find(
        item => item.productId.toString() === productId
      )
      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        cart.items.push({ productId, quantity })
      }
    }

    await cart.save()
    res.json(cart)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/cart', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id
    const cart = await Cart.findOne({ userId }).populate('items.productId')
    if (!cart) {
      cart = { userId, items: [] }
    }

    res.json({
      userId: cart.userId,
      items: cart.items.map(item => ({
        _id: item._id,
        quantity: item.quantity,
        product: item.productId
      }))
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/current-user', authMiddleware, (req, res) => {
  try {
    // Exclude password from user data
    const { password, ...userData } = req.user._doc

    res.json(userData)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

app.listen(PORT, () => {
  console.log(`Server running at Port ${PORT}`)
})
