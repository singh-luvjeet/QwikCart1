const { default: mongoose } = require("mongoose")
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

exports.deleteFromCart = async (req, res) => {

  // console.log("inside delete from cart")
  try {
    const {selectedItems:selectedItems,  type:type} = req.body;
    console.log('req.body', req.body)
    const userId = req.user._id;
    

    // console.log('userId', userId)

    // console.log('id', id)

    // if(type === "only one"){
    //   const updatedCart = await Cart.findOneAndUpdate(
    //     {userId: userId},
    //     { $pull: { items: { productId: selectedItems } } }, 
    //     { new: true } 
    //   );

    //   // console.log('updatedCart', updatedCart)
    //   if (!updatedCart) {
    //     console.log(`Cart with userId ${userId} not found.`);
    //     return res.status(404).json({ message: 'Item not found' });}
    // }

    let cart;

    cart = await Cart.findOne({ userId })
    if(!cart){
      return res.status(404).json({message:'Cart not Found'});

    }
    if(type==="all") {
      cart.items=[];
      cart.save();
      return res.status(200).json({message:"Items removed successfully"})
    }  

    // if (type === "selected"){
    //   let isValid = true
    //   let arr = []
    //   cart.items = cart.items.filter(item => {
    //     for(let i=0; i<selectedItems.length; i++){
    //       if(selectedItems[i] === item.productId.toString()){
    //         isValid = false
    //       }
    //       if (isValid === true){
    //         arr.push(item.productId)
    //       }
    //     }
    //     return arr
        
    //   })
    //   cart.save()
    //   return res.status(200).json({message:"Items removed successfully"})
    // }

    // const objectId = new mongoose.Types.ObjectId(stringId);
    // const arr = selectedItems.map(id => new mongoose.Types.ObjectId(id));
    //   console.log('arr', arr)

    if (type === "selected" || type==="only one"){  
      cart.items = cart.items.filter(item => !selectedItems.includes(item.productId.toString()))
      cart.save()
      return res.status(200).json({message:"Items removed successfully"})
    }
    
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};