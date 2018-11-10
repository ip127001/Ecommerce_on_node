const http = require('http');

const express = require('express')

const app = express();

app.use('/add-product', (req, res, next) => {
    console.log('in add product middleware')
    res.send('<h1>hello from another route</h1>')
})
app.use('/', (req, res, next) => {
    console.log('in another middleware!');
    res.send('<h1>Hello from express.js</h1>');
})

app.listen(3000);