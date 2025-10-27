const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
    AvgRating:{
        type: Number,
        default: 4,
    },
    id:{
        type: Number,
    },
    title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    price:{
        type: Number,
        required: true,
    },
    minimumOrderQuantity:{
        type: Number,
        default:1,
    },
    stock:{
        type: Number,
        default: 25,
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand"
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subCategory"
    },
    liked:{
        type: Boolean,
        default: false,
    },
    addedToCart:{
        type: Boolean,
        default: false,
    },
    images: [   
        {
          type: String,
          required: true,
        },
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    
},{timestamps: true})

module.exports = mongoose.model("Card", cardSchema);