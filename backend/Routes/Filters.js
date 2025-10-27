const express = require('express');
const router = express.Router();
const Brand = require('../Models/Brand');
const Category = require('../Models/Category');

router.get('/brands', async (req, res) => {
  const brands = await Brand.find().sort({ name: 1 });
  res.json(brands);
});

router.get('/categories', async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  res.json(categories);
});

module.exports = router;
