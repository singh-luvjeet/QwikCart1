const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      productId: {
        type: Number,
        ref: "Card",
        // localField: 'productId',
        // foreignField: 'id',
        required: true,
      },
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model("Wishlist", wishlistSchema);
