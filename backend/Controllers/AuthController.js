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
    const token = createSecretToken(user._id);
    // console.log('token', token)
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

module.exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body
  console.log(req.user._id, 'changePAssworrrrrrrd')

  const auth = await bcrypt.compare(oldPassword, req.user.password)
  if (!auth) {
    return res.json({ message: 'Incorrect password' })
  }

  const encryptedPassword = await bcrypt.hash(newPassword, 10)
  await User.updateOne(
    {
      _id: req.user._id
    },
    {
      $set: {
        password: encryptedPassword
      }
    }
  )

  res.status(200).json({ message: 'Password changed successfully!' })
};

module.exports.googleAuth = async (req, res) => {
  const { email, firstName, lastName } = req.body
  console.log({ email, firstName, lastName })

  try {
    if (!email) {
      return res
        .status(400)
        .json({ error: 'Missing email from Google response' })
    }

    let user = await User.findOne({ email })
    console.log('user', { user })
    if (!user) {
      console.log('creating user')
      user = await User.create({
        email,
        firstName,
        lastName,
        authSource: 'google'
      })
    }

    // console.log(user, 'user google')
    const token = createSecretToken(user._id)
    res.cookie('token', token, {
      httpOnly: true, //JS can’t access the cookie
      sameSite: 'lax', //sent on same-site requests
      secure: false, //works over HTTP (not just HTTPS)
      maxAge: 7 * 24 * 60 * 60 * 1000
    })
    res
      .status(201)
      .json({ message: 'Google sign in successfully', success: true, user })
  } catch (err) {
    console.error('Error during Google Authentication:', err)
    res.status(400).json({ error: 'Authentication failed' })
  }
}


module.exports.currentUser = (req, res) => {
  try {
    // Exclude password from user data
    const { password, ...userData } = req.user._doc

    res.json(userData)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}