const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  firstName:{
    type: String,
    required: true,
  },
  lastName:{
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: [true, "Your email address is required"],
    unique: true,
  },
  password: {
    type: String,
    required: function () {
      return this.authSource === "self";
    },
  },
  profile_image:{
    type:String,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  authSource: {
    type: String,
    enum: ["self", "google"],
    default: "self"
  }
});

userSchema.pre("save", async function () {
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 12);
  }
});

module.exports = mongoose.model("User", userSchema);