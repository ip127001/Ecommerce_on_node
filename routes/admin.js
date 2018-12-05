const path = require('path')

const express = require('express')

const router = express.Router();

const adminController = require('../controllers/admin');

// const dirName = require('../util/path');

router.get('/add-product', adminController.getAddProduct);

router.get('/products', adminController.getProducts);

router.post('/product', adminController.postAddProduct);

module.exports = router;