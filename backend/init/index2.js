const mongoose = require("mongoose");
const initData = require("./data.js");
const Card = require("../Models/Card.js");


mongoose.connect("mongodb://127.0.0.1:27017/qwikcart")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

  const initDB = async () => {
    // await Card.deleteMany({});
    initData.data = initData.data.map((obj) => ({
      ...obj,
      owner: "68df5b98e51e009b2289768a",
      image:"http://localhost:3000/assets/headphone.png"
    }));
    await Card.insertMany(initData.data);
    console.log("Data inserted successfully");
  };
  
initDB();