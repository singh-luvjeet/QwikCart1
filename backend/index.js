const express = require('express')
const app = express()
const mongoose = require('mongoose')
const authRoute = require('./Routes/AuthRoute')
const addressRoute = require('./Routes/AddressRoute')
const userRoute = require('./Routes/UserRoute')
const ordersRoute = require('./Routes/OrdersRoute')
const wishlistRoute = require('./Routes/wishlistRoute')
const CardRoute = require("./Routes/CardRoute")
const CartRoute = require("./Routes/CartRoute")
const cors = require('cors')
const cookieParser = require('cookie-parser')
const path = require('path')
const Card = require('./Models/Card')
const importRoute = require('./Routes/ImportRoute')
const filterRoute = require('./Routes/Filters')


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
app.use('/order', ordersRoute)
app.use('/import', importRoute)
app.use('/', filterRoute);


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

app.listen(PORT, () => {
  console.log(`Server running at Port ${PORT}`)
})
