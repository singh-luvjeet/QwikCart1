const express = require("express");
const app = express();
const mongoose = require("mongoose");
const authRoute = require("./Routes/AuthRoute");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authMiddleware = require("./Middlewares/Auth");
const Card = require("./Models/Card");
const Cart = require("./Models/Cart");

const PORT = 4000;

mongoose.connect("mongodb://127.0.0.1:27017/qwikcart")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

app.use(
cors({
    origin: ["http://localhost:4000", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
})
);

app.use(cookieParser());
app.use(express.json());

app.use("/", authRoute);

app.get("/cards", async (req, res) => {
    try {
      const cards = await Card.find();
      res.json(cards);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/cards/add-card", async (req, res) => {
    try {
        const { name, description, price, image } = req.body;

        if (!name || !description || !price || !image) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newCard = new Card({ name, description, price, image });
        await newCard.save();

        res.status(201).json({ message: "Product added successfully", product: newCard });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

  app.get("/cards/:id", async (req, res) => {
    try {
      const card = await Card.findById(req.params.id);
      if (!card) {
        return res.status(404).json({ message: "Card not found" });
      }
      res.json(card);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

app.post("/cart/add", authMiddleware, async (req, res) => {
    const { productId, quantity } = req.body;
    try {
      const userId = req.user._id; 
      
      let cart = await Cart.findOne({ userId });
      if (!cart) {
        cart = new Cart({
          userId,
          items: [{ productId, quantity }]
        });
      } else {
        const existingItem = cart.items.find(item => item.productId.toString() === productId);
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          cart.items.push({ productId, quantity });
        }
      }
  
      await cart.save();
      res.json(cart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

app.get("/cart", authMiddleware, async (req, res) => {
    try {
      const userId = req.user._id;
      const cart = await Cart.findOne({ userId }).populate("items.productId");
      if (!cart) {
        cart = { userId, items: [] };
      }
  
      res.json({
        userId: cart.userId,
        items: cart.items.map(item => ({
          _id: item._id,
          quantity: item.quantity,
          product: item.productId,
        }))
      });
      
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

 app.get("/current-user", authMiddleware, (req, res) => {
    try {
      // Exclude password from user data
      const { password, ...userData } = req.user._doc;
  
      res.json(userData);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });

  

app.listen(PORT, () => {
  console.log(`Server running at Port ${PORT}`);
});
