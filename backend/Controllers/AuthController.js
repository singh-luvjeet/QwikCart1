const User = require('../Models/UserModel')
const { createSecretToken } = require('../util/SecretToken')
const bcrypt = require('bcryptjs')

module.exports.Signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, createdAt } = req.body
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.json({ message: 'User already exists' })
    }
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      createdAt
    })
    const token = createSecretToken(user._id)
    res.cookie('token', token, {
      httpOnly: true, //JS can’t access the cookie
      sameSite: "lax", //sent on same-site requests
      secure: false, //works over HTTP (not just HTTPS)
      maxAge: 7 * 24 * 60 * 60 * 1000  
    })
    res
      .status(201)
      .json({ message: 'User signed in successfully', success: true, user })
  } catch (error) {
    console.error(error)
  }
}

module.exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.json({ message: 'All fields are required' })
    }
    const user = await User.findOne({ email })
    if (!user) {
      return res.json({ message: 'Incorrect password or email' })
    }
    const auth = await bcrypt.compare(password, user.password)
    if (!auth) {
      return res.json({ message: 'Incorrect password or email' })
    }
    const token = createSecretToken(user._id)
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000  
    })
    res
      .status(201)
      .json({ message: 'User logged in successfully', success: true, user })
  } catch (error) {
    console.error(error)
  }
}

module.exports.Logout = async (req, res) => {
  try {
    res.cookie('token', '', {
      httpOnly: true,
      expires: new Date(0), // expires immediately
      sameSite: "lax",
      secure: false
    });
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};