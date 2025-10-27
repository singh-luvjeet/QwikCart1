const Brand = require("../Models/Brand")
const Card = require("../Models/Card")
const Cart = require("../Models/Cart")
const Category = require("../Models/Category")
const SubCategory = require("../Models/SubCategory")
const Wishlist = require("../Models/Wishlist")


module.exports.cards = async (req, res) => {
    try {
      const { sort, keyword, rating, limit, page, brand, category } = req.query
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
      if (keyword) {
        query.$or = [
          { title: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } },
        ];
      }
  
      if (brand) query.brand = brand;
      if (category) query.category = category;
      if (rating) query.AvgRating = { $gte: Number(rating) };
  
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
      const cards = await Card.find(query)
        .populate("brand")
        .populate("category")
        .sort({ price: order })
        .skip(startIndex)
        .limit(Limit)
      //The $regex operator allows for powerful pattern matching beyond simple string equality, using regular expression syntax.
  
      // console.log('cards', cards)

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
      let card = await Card.findById(req.params.id).populate("owner").populate("brand").populate("category").populate("subCategory");
  
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

module.exports.addCard = async (req, res) => {
    try {
      const { title, description, price, brand, category, subCategory } = req.body

      if (!title || !description || !price || !brand || !category || !subCategory || !req.files?.length) {
        return res.status(400).json({ message: 'All fields are required' })
      }

      const imagePaths = req.files.map(file => file.path)

      let brandDoc = await Brand.findOne({ name: brand });
      if (!brandDoc) {
        brandDoc = await Brand.create({ name: brand });
      }

      let categoryDoc = await Category.findOne({ name: category });
      if (!categoryDoc) {
        categoryDoc = await Category.create({ name: category });
      }

      let subCategoryDoc = await SubCategory.findOne({ name: subCategory });
      if (!subCategoryDoc) {
        subCategoryDoc = await SubCategory.create({ name: subCategory });
      }

      const newCard = new Card({
        title,
        description,
        price,
        brand: brandDoc._id,
        category: categoryDoc._id,
        subCategory: subCategoryDoc._id,
        images: imagePaths,
        owner: req.user._id,
      });

      await newCard.save()

      res
        .status(201)
        .json({ message: 'Product added successfully', product: newCard })
    } catch (err) {
      console.error(err)
      res.status(500).json({ message: 'Server error' })
    }
  }

module.exports.editCard = async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, price, brand, category, subCategory } = req.body

    const card = await Card.findById(id)
    if (!card) return res.status(404).json({ message: 'Card not found' })

    if (card.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: 'Forbidden: You are not the owner' })
    }

    if (title) card.title = title
    if (description) card.description = description
    if (price) card.price = price

    if (brand) {
      let brandDoc = await Brand.findOne({ name: brand });
      if (!brandDoc) brandDoc = await Brand.create({ name: brand });
      card.brand = brandDoc._id;
    }

    if (category) {
      let categoryDoc = await Category.findOne({ name: category });
      if (!categoryDoc) categoryDoc = await Category.create({ name: category });
      card.category = categoryDoc._id;
    }

    if (subCategory) {
      let subCatDoc = await SubCategory.findOne({ name: subCategory });
      if (!subCatDoc) subCatDoc = await SubCategory.create({ name: subCategory });
      card.subCategory = subCatDoc._id;
    }


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

module.exports.deleteCard = async (req, res) => {
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
}