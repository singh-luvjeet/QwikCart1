// middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../Models/UserModel");

const authMiddleware = async (req, res, next) => {
  try {
    // console.log('aaaaaaa')
    // console.log('req', req.cookies)
    const token = req.cookies.token;
    // console.log(token, "token authhhhhhhh")
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    // console.log("decoded", decoded)
    const user = await User.findById(decoded.id);
    // console.log("user auth.js ",user)
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    req.user = user; 
    next(); 
  } catch (err) {
    console.log('err', err)
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
