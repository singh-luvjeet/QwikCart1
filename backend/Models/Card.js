const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
    AvgRating:{
        type: Number,
        required: true,
    },
    id:{
        type: Number,
        required: true,
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
        required: true,
    },
    stock:{
        type: Number,
        required: true,
    },
    brand: {
        type: String,
        // required: true,
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
        // required: true
    },
    
},{timestamps: true})

module.exports = mongoose.model("Card", cardSchema);