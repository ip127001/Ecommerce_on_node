const path = require('path')

const express = require('express')

const router = express.Router();

const dirName = require('../util/path')
const adminData = require('./admin')

router.get('/', (req, res, next) => {
    const products = adminData.products;
    res.render('shop', {
        prods: products,
        docTitle: 'shop'
    });

    // console.log(adminData.products);
    // res.sendFile(path.join(dirName, 'views', 'shop.html'));
})

module.exports = router;