const User = require("../Models/UserModel")


module.exports.userInfo = async (req, res) => {
  try {
    const userInfo = await User.findById(req.user._id)
    if (!userInfo) return res.status(404).json({ message: 'User not found' })
    res.json(userInfo)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports.editUser = async (req, res) => {
    try {
      const { firstName, lastName, email } = req.body
      const user = await User.findById(req.user._id)

      if (firstName) user.firstName = firstName
      if (lastName) user.lastName = lastName
      if (email) user.email = email

      if (req.file) {
        console.log('Uploaded file info:', req.file)
        user.profile_image = req.file.filename
      }

      await user.save()

      res.send('User Info Updated')
    } catch (err) {
      console.log(err)
      res.send(err, 'Some error occured')
    }
  }