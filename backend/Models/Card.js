const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
    name:{
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
    liked:{
        type: Boolean,
        default: false,
    },
    images: [   // 👈 Changed from 'image' to 'images'
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
})

module.exports = mongoose.model("Card", cardSchema);