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
    image: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model("Card", cardSchema);