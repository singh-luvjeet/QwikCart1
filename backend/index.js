const express = require('express')
const app = express()
const mongoose = require('mongoose')
const authRoute = require('./Routes/AuthRoute')
const addressRoute = require('./Routes/AddressRoute')
const userRoute = require('./Routes/UserRoute')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const authMiddleware = require('./Middlewares/Auth')
const Card = require('./Models/Card')
const Cart = require('./Models/Cart')
const User = require('./Models/UserModel')
const multer = require('multer')
const { storage } = require('./cloudConfig')
const upload = multer({ storage })
const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client(
  '144563076261-dn1lnei7eram10465q5vfel8lvn74u1n.apps.googleusercontent.com'
)
// const { createSecretToken } = require('./util/SecretToken')
const bcrypt = require('bcryptjs')
const path = require('path')
const Wishlist = require('./Models/Wishlist')
app.use(express.static(path.join(__dirname, 'public')))

const PORT = 4000

mongoose
  .connect('mongodb://127.0.0.1:27017/qwikcart')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err))

app.use(
  cors({
    origin: [
      'http://localhost:4000',
      'http://localhost:3000',
      'http://localhost:3001'
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true
  })
)

app.use(cookieParser())
app.use(express.json())
app.use(
  express.urlencoded({
    extended: true
  })
)
app.use(express.static('public'))

app.use('/', authRoute)
app.use('/address', addressRoute)
// app.use('/', userRoute)

const storage1 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

const upload1 = multer({ storage: storage1 })

app.get('/user-info', authMiddleware, async (req, res) => {
  try {
    const userInfo = await User.findById(req.user._id)
    if (!userInfo) return res.status(404).json({ message: 'User not found' })
    res.json(userInfo)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

app.get('/wishlists', authMiddleware, async (req, res) => {
  try {
    let userId = req.user._id
    let wishlist = await Wishlist.findOne({ userId })

    if (!wishlist) {
      wishlist = { userId, items: [] }
    }

    const productIds = wishlist.items.map(item => item.productId);
    // console.log(productIds);
    const products = await Card.find({"id": { "$in": productIds }}).select('id title description images liked');

    res.json({products})
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/wishlist/add', authMiddleware, async (req, res) => {
  const { productId, liked: isLiked } = req.body
  // console.log({ productId, isLiked })
  let wishlist
  try {
    const userId = req.user._id
    wishlist = await Wishlist.findOne({ userId })
    // console.log('wishlist>>', wishlist)

    if (isLiked === true) {
      if (!wishlist) {
        wishlist = new Wishlist({
          userId,
          items: [{ productId }]
        })
      } else {
        const existingItem = wishlist.items.find(
          item => item.productId === productId
        )
        console.log(existingItem)
        if (!existingItem) {
          wishlist.items.push({ productId })
        }
      }
      await wishlist.save()
    } else {
      // console.log("when isliked is false")
      wishlist = await Wishlist.findOneAndUpdate(
        { userId: userId },
        { $pull: { items: { productId: productId } } },
        { new: true }
      )
    }
    // console.log('Wishlist', wishlist)

    res.json(wishlist)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// app.post("/import", async (req,res) => {
//   try {
//     const {allCards} = req.body;

//     await Card.insertMany(allCards);
//     res.status(201).json({ message: 'Products imported successfully!' });
//   } catch (error) {
//     console.error('Error importing products:', error);
//     res.status(500).json({ message: 'Failed to import products.' });
// }
// })

app.patch(
  '/user/edit',
  authMiddleware,
  upload1.single('profile_image'),
  async (req, res) => {
    try {
      const { firstName, lastName, email } = req.body
      const user = await User.findById(req.user._id)

      if (firstName) user.firstName = firstName
      if (lastName) user.lastName = lastName
      if (email) user.email = email

      if (req.file) {
        console.log('Uploaded file info:', req.file)
        user.profile_image = req.file.filename
      }

      await user.save()

      res.send('User Info Updated')
    } catch (err) {
      console.log(err)
      res.send(err, 'Some error occured')
    }
  }
)

app.get('/cards', authMiddleware, async (req, res) => {
  try {
    const {sort} = req.query;
    // console.log("sort>>",)
    let order=1;
    if (sort === 'asc') {
     order=1
    } else if (sort === 'desc') {
      order=-1
    }
    // console.log("order>>", order)

    const userWishlist = await Wishlist.findOne({ userId: req.user._id })
    const likedProductIds = []
    if (userWishlist && userWishlist.items) {
      userWishlist.items.forEach(item => {
        likedProductIds.push(item.productId)
      })
    }
    // console.log("likedProducts>>", likedProductIds)
    const cards = await Card.find().sort({price:order})

    const updatedCards = cards.map(card => {
      const isLiked = likedProductIds.includes(card.id)
      const plainCard = card.toObject()
      return {
        ...plainCard,
        liked: isLiked
      }
    })

    // console.log("Updated Cards>>", updatedCards)

    res.json(updatedCards)
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

      const imagePaths = req.files.map(file => file.path)

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
    const card = await Card.findById(req.params.id)
    if (!card) return res.status(404).json({ message: 'Card not found' })
    res.json(card) // anyone can access
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

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
      const imagesToKeep = req.body.existingImages
        ? JSON.parse(req.body.existingImages)
        : []

      // Remove deleted images from card.images
      const removedImages = card.images.filter(
        img => !imagesToKeep.includes(img)
      )
      // Optionally: delete removedImages from cloud storage here

      card.images = [...imagesToKeep]

      // Add newly uploaded images
      if (req.files?.length) {
        const newImagePaths = req.files.map(file => file.path)
        card.images.push(...newImagePaths)
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
    const { id } = req.params

    const card = await Card.findById(id)
    if (!card) return res.status(404).json({ message: 'Card not found' })

    if (card.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: 'Forbidden: You are not the owner' })
    }

    await Card.findByIdAndDelete(id)

    res.json({ message: 'Card deleted successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

app.post('/cart/add', authMiddleware, async (req, res) => {
  const { productId, quantity } = req.body
  try {
    const userId = req.user._id

    let cart = await Cart.findOne({ userId })
    // console.log("cart>>", cart);
    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId, quantity }]
      })
      // console.log("cart2>>", cart);
    } else {
      const existingItem = cart.items.find(
        item => item.productId.toString() === productId
      )
      // console.log("existingItem>>", existingItem)
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
    // console.log("cart>>", cart)
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
