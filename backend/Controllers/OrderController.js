const Cart = require("../Models/Cart");
const Order = require("../Models/Order");

module.exports.getOrders = async (req,res) => {
    try{
      const userId = req.user._id
      const orders = await Order.find({userId})
      .populate('address')
      .populate({
        path: 'items',
        populate: {
          path: 'productId',
          model: 'Card'
        }
      });
      // console.log('orders', orders)

      res.json({orders: orders})
    } catch (err) {
        console.log(err)
        res.status(500).json({ err})
    }
}

module.exports.addOrder = async (req,res) => {

    const userId = req.user._id;
    const {addressId} = req.body;
    try{
        const cart = await Cart.findOne({userId});

        const selectedItems = cart?.items?.filter(item => item.isSelected);

        const newOrder = new Order({
            userId,
            items: selectedItems.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
            })),
            address: addressId,
          });

        await newOrder.save();

        cart.items = cart.items.filter(item => !item.isSelected);
        await cart.save();

        res.status(201).json({
        message: 'Order created successfully!',
        order: newOrder,
        });

    }catch (error){
        res.status(500).json({ error: error.message })
    }
}