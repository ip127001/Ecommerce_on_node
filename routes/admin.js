const path = require('path')

const express = require('express')

const router = express.Router();

const products = [];

const dirName = require('../util/path')

router.get('/add-product', (req, res, next) => {
    res.render('add-product', {
        pageTitle: 'Add-Product',
        path: '/admin/add-product'
    })
    // res.sendFile(path.join(dirName, 'views', 'add-product.html'));
})

router.post('/product', (req, res) => {
    products.push({
        title: req.body.title
    })
    console.log(req.body);
    res.redirect('/');
})

exports.routes = router;
exports.products = products