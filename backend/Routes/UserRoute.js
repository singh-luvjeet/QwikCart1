const router = require("express").Router();
const multer = require("multer");
const { userInfo, editUser } = require("../Controllers/UserController");
const authMiddleware = require("../Middlewares/Auth");
const path = require('path')


const storage1 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

const upload1 = multer({ storage: storage1 })

router.get('/user-info', authMiddleware, userInfo);
router.patch('/edit', authMiddleware, upload1.single('profile_image'), editUser)

module.exports = router;