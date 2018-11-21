const path = require('path')

const express = require('express')

const router = express.Router();

const productController = require('../controllers/products');

// const dirName = require('../util/path');

router.get('/add-product', productController.getAddProduct);

router.post('/product', productController.postAddProduct);

module.exports = router;