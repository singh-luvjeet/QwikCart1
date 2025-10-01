const mongoose = require("mongoose");
const initData = require("./data.js");
const Card = require("../Models/Card.js");


mongoose.connect("mongodb://127.0.0.1:27017/qwikcart")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

  const initDB = async () => {
    await Card.insertMany(initData.data);
    console.log("Data inserted successfully");
  };
  
initDB();