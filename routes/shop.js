const path = require('path')

const express = require('express')

const router = express.Router();

const dirName = require('../util/path')
const adminData = require('./admin')

router.get('/', (req, res, next) => {
    const products = adminData.products;
    res.render('shop', {
        prods: products,
        pageTitle: 'shop',
        path: '/shop',
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true
    });

    // console.log(adminData.products);
    // res.sendFile(path.join(dirName, 'views', 'shop.html'));
})

module.exports = router;