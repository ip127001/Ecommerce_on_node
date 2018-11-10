const express = require('express')
const router = express.Router();

router.use('/', (req, res, next) => {
    console.log('in another middleware!');
    res.send('<h1>Hello from express.js</h1>');
})

module.exports = router;