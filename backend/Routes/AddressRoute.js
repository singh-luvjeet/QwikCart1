const express = require('express');
const router = express.Router();
const authMiddleware = require('../Middlewares/Auth');
const {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress
} = require('../Controllers/AddressController');

router.post('/', authMiddleware, addAddress);

router.get('/', authMiddleware, getAddresses);

router.put('/:id', authMiddleware, updateAddress);

router.delete('/:id', authMiddleware, deleteAddress);

module.exports = router;
