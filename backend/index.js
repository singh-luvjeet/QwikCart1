const express = require('express')
const app = express()
const mongoose = require('mongoose')
const authRoute = require('./Routes/AuthRoute')
const addressRoute = require('./Routes/AddressRoute')
const userRoute = require('./Routes/UserRoute')
const wishlistRoute = require('./Routes/wishlistRoute')
const CardRoute = require("./Routes/CardRoute")
const CartRoute = require("./Routes/CartRoute")
const cors = require('cors')
const cookieParser = require('cookie-parser')
const multer = require('multer')
const { storage } = require('./cloudConfig')
const upload = multer({ storage })
const path = require('path')
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
      'http://localhost:3000'
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
app.use('/user', userRoute)
app.use('/wishlist', wishlistRoute)
app.use('/cards', CardRoute)
app.use('/cart', CartRoute)



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




// app.post(
//   '/cards/add-card',
//   authMiddleware,
//   upload.array('images', 4),
//   async (req, res) => {
//     try {
//       const { name, description, price } = req.body

//       if (!name || !description || !price || !req.files?.length) {
//         return res.status(400).json({ message: 'All fields are required' })
//       }

//       const imagePaths = req.files.map(file => file.path)

//       const newCard = new Card({
//         name,
//         description,
//         price,
//         images: imagePaths,
//         owner: req.user._id
//       })
//       await newCard.save()

//       res
//         .status(201)
//         .json({ message: 'Product added successfully', product: newCard })
//     } catch (err) {
//       console.error(err)
//       res.status(500).json({ message: 'Server error' })
//     }
//   }
// )


// app.patch(
//   '/cards/:id/edit',
//   authMiddleware,
//   upload.array('images', 4),
//   async (req, res) => {
//     try {
//       const { id } = req.params
//       const { name, description, price } = req.body

//       const card = await Card.findById(id)
//       if (!card) return res.status(404).json({ message: 'Card not found' })

//       if (card.owner.toString() !== req.user._id.toString()) {
//         return res
//           .status(403)
//           .json({ message: 'Forbidden: You are not the owner' })
//       }

//       if (name) card.name = name
//       if (description) card.description = description
//       if (price) card.price = price

//       // Parse the list of images to keep
//       const imagesToKeep = req.body.existingImages
//         ? JSON.parse(req.body.existingImages)
//         : []

//       // Remove deleted images from card.images
//       const removedImages = card.images.filter(
//         img => !imagesToKeep.includes(img)
//       )
//       // Optionally: delete removedImages from cloud storage here

//       card.images = [...imagesToKeep]

//       // Add newly uploaded images
//       if (req.files?.length) {
//         const newImagePaths = req.files.map(file => file.path)
//         card.images.push(...newImagePaths)
//       }
//       await card.save()
//       res.json({ message: 'Card updated successfully', card })
//     } catch (err) {
//       console.error(err)
//       res.status(500).json({ message: 'Server error' })
//     }
//   }
// )

// app.delete('/cards/:id/delete', authMiddleware, async (req, res) => {
//   try {
//     const { id } = req.params

//     const card = await Card.findById(id)
//     if (!card) return res.status(404).json({ message: 'Card not found' })

//     if (card.owner.toString() !== req.user._id.toString()) {
//       return res
//         .status(403)
//         .json({ message: 'Forbidden: You are not the owner' })
//     }

//     await Card.findByIdAndDelete(id)

//     res.json({ message: 'Card deleted successfully' })
//   } catch (err) {
//     console.error(err)
//     res.status(500).json({ message: 'Server error' })
//   }
// })

app.listen(PORT, () => {
  console.log(`Server running at Port ${PORT}`)
})
