const Card = require("../Models/Card")
const Cart = require("../Models/Cart")
const Wishlist = require("../Models/Wishlist")


module.exports.cards = async (req, res) => {
    try {
      const { sort, keyword, rating, limit, page } = req.query
      // console.log("sort>>",sort)
      let order = 1
      if (sort === 'asc') {
        order = 1
      } else if (sort === 'desc') {
        order = -1
      }
      // console.log("order>>", order)
  
  
      const Page = page || 1 // Default to page 1
      const Limit = limit || 12
      const startIndex = (Page - 1) * Limit
  
      let query = {}
      if(keyword) query.title = { $regex: keyword, $options: 'i' };
      // if(rating) query.rating = rating;
  
      // const filteredItems = await Card.find(query);
      const total = await Card.countDocuments(query);
  
      const totalPages = Math.ceil(total / limit)
  
      const userWishlist = await Wishlist.findOne({ userId: req.user._id })
      const likedProductIds = []
      if (userWishlist && userWishlist.items) {
        userWishlist.items.forEach(item => {
          likedProductIds.push(item.productId)
        })
      }
      // console.log("likedProducts>>", likedProductIds)
      const cards = await Card.find({
        $or: [
          { title: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } }
        ],
        AvgRating: { $gte: rating }
      })
        .sort({ price: order })
        .skip(startIndex)
        .limit(Limit)
      //The $regex operator allows for powerful pattern matching beyond simple string equality, using regular expression syntax.
  
      const updatedCards = cards.map(card => {
        const isLiked = likedProductIds.includes(card.id)
        const plainCard = card.toObject()
        return {
          ...plainCard,
          liked: isLiked
        }
      })
  
      // console.log("Updated Cards>>", updatedCards)
  
      res.json({ updatedCards, totalPages, currentPage: page })
    } catch (err) {
      res.status(500).json({ message: 'Server error' })
      console.log(err)
    }
  }



module.exports.viewCard = async (req, res) => {
    try {
      const userId = req.user._id;
      const cart = await Cart.findOne({userId});
      let card = await Card.findById(req.params.id);
  
      if (!card) return res.status(404).json({ message: 'Card not found' })
        // console.log('cart', cart)
        let is_in_cart=cart?.items?.some((item)=>(item.productId).toString()===req.params.id);

      // Convert the Mongoose document to a plain JavaScript object
      card = card.toObject();
  
      const payload = {
        ...card, is_in_cart
      }
    // console.log('payload', payload)
      res.json({card:payload}) 
    } catch (err) {
      console.log('err', err)
      res.status(500).json({ message: 'Server error' })
    }
  }