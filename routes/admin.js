const path = require('path')

const express = require('express')
const {
    body
} = require('express-validator/check')

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// const dirName = require('../util/path');

router.get('/add-product', isAuth, adminController.getAddProduct);

router.post('/add-product',
    [
        body('title', 'Give the corret title')
        .isString()
        .isLength({
            min: 3
        })
        .trim(),

        body('price')
        .isFloat(),

        body('description', 'description should be min 5 and max 400 characters')
        .isLength({
            min: 5,
            max: 400
        })
        .trim()
    ], isAuth, adminController.postAddProduct);

router.get('/products', isAuth, adminController.getProducts);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product',
    [
        body('title', 'Give the corret title')
        .isString()
        .isLength({
            min: 3
        })
        .trim(),

        body('price')
        .isFloat(),

        body('description', 'description should be min 5 and max 400 characters')
        .isLength({
            min: 5,
            max: 400
        })
        .trim()
    ],
    isAuth, adminController.postEditProduct);

router.post('/delete-product/', isAuth, adminController.postDeleteProduct);

module.exports = router;