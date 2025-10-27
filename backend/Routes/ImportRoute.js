const express = require("express");
const router = express.Router();
const { importProducts } = require("../Controllers/ImportController");
const authMiddleware = require("../Middlewares/Auth");

router.post("/", authMiddleware, importProducts);

module.exports = router;
