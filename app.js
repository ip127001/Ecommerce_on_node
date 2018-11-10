const http = require('http');

const express = require('express')

const app = express();

app.use((req, res, next) => {
    console.log('in the middleware')
    next();
})

app.use((req, res, next) => {
    console.log('in another middleware!');
    res.setHeader('Content-type', 'text/html')
    res.send('<h1>Hello from express.js</h1>');
})


app.listen(3000);