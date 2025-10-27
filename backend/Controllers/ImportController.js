const axios = require("axios");
const Card = require("../Models/Card");
const Brand = require("../Models/Brand");
const Category = require("../Models/Category");

async function saveProductFromAPI(productData, ownerId) {
  let brandId = null;
  let categoryId = null;

  if (productData.brand) {
    let brand = await Brand.findOne({ name: productData.brand });
    if (!brand) {
      brand = await Brand.create({ name: productData.brand });
    }
    brandId = brand._id;
  }

  if (productData.category) {
    let category = await Category.findOne({ name: productData.category });
    if (!category) {
      category = await Category.create({ name: productData.category });
    }
    categoryId = category._id;
  }

  let AvgRating = 0;
  if (productData.reviews && productData.reviews.length > 0) {
    const sum = productData.reviews.reduce((sum, r) => sum + r.rating, 0);
    AvgRating = Math.floor(sum / productData.reviews.length);
  }

  const newCard = new Card({
    id: productData.id,
    title: productData.title,
    description: productData.description,
    price: productData.price,
    minimumOrderQuantity: productData.minimumOrderQuantity || 1,
    stock: productData.stock,
    brand: brandId,
    category: categoryId,
    AvgRating,
    images: productData.images,
    owner: ownerId
  });

  await newCard.save();
}

exports.importProducts = async (req, res) => {
  try {
    // 👇 fetch products from DummyJSON
    const { data } = await axios.get("https://dummyjson.com/products?limit=60");

    const products = data.products;

    //owner comes from logged-in user
    const ownerId = req.user ? req.user._id : null;

    for (const product of products) {
      await saveProductFromAPI(product, ownerId);
    }

    res.status(201).json({ message: "Products imported successfully!" });
  } catch (error) {
    console.error("Error importing products:", error);
    res.status(500).json({ message: "Failed to import products." });
  }
};
