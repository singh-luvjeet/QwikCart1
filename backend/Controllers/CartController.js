const Cart = require("../Models/Cart")


module.exports.cart = async (req, res) => {
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
          product: item.productId,
          isSelected: item.isSelected
        }))
      })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }


  module.exports.addToCart = async (req, res) => {
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
          item => item?.productId?.toString() === productId
        )
        // console.log("existingItem>>", existingItem)
        if (existingItem) {
          existingItem.quantity += quantity
        } else {
          cart?.items?.push({ productId, quantity })
        }
      }
  
      await cart.save()
      res.json(cart)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }


module.exports.updateSelectedItem = async (req, res) => {
  const userId = req.user._id;
  const { productId, isSelected } = req.body;

  try {
    const cart = await Cart.findOne({ userId });

    const item = cart.items.find(item => item.productId.toString() === productId);
    
    item.isSelected = isSelected;

    await cart.save();
    res.status(200).json(cart);
  
  } catch (error) {
      res.status(500).json({ error: error.message })
    }
}