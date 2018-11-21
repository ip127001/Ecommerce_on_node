const path = require('path')

const express = require('express')

const router = express.Router();

const productController = require('../controllers/products')

// const dirName = require('../util/path');
// const adminData = require('./admin');

router.get('/', productController.getProducts);

module.exports = router;