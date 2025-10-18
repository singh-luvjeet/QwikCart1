const { Signup, Login, Logout, changePassword, googleAuth, currentUser } = require("../Controllers/AuthController");
const authMiddleware = require("../Middlewares/Auth");
const { userVerification } = require("../Middlewares/AuthMiddleware");
const router = require("express").Router();

router.post("/signup", Signup);
router.post('/login', Login)
router.post('/',userVerification)
router.post('/logout', Logout);
router.post('/change-password', authMiddleware, changePassword);
router.post('/google-auth', googleAuth);
router.get('/current-user', authMiddleware, currentUser)

module.exports = router;