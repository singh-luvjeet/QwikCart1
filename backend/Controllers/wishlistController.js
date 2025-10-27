const Card = require("../Models/Card")
const Wishlist = require("../Models/Wishlist")


module.exports.wishlists = async (req, res) => {
  try {
    let userId = req.user._id
    let wishlist = await Wishlist.findOne({ userId })

    if (!wishlist) {
      wishlist = { userId, items: [] }
    }

    const productIds = wishlist.items.map(item => item.productId)
    // console.log(productIds);
    const products = await Card.find({ id: { $in: productIds } }).select(
      'id title description images liked _id minimumOrderQuantity stock'
    )

    console.log('products', products)

    res.json({ products })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports.addWishlist = async (req, res) => {
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
}