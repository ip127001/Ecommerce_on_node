const path = require('path')

const express = require('express')

const router = express.Router();

const dirName = require('../util/path')

router.get('/', (req, res, next) => {
    res.sendFile(path.join(dirName, 'views', 'shop.html'));
})

module.exports = router;