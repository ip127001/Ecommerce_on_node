const path = require('path')

const express = require('express')

const router = express.Router();

const dirName = require('../util/path')

router.get('/add-product', (req, res, next) => {
    res.sendFile(path.join(dirName, 'views', 'add-product.html'));
})

router.post('/product', (req, res) => {
    console.log(req.body);
    res.redirect('/');
})

module.exports = router;