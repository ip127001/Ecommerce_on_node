const http = require('http');

const express = require('express')
const bodyParser = require('body-parser')


const app = express();

app.use(bodyParser.urlencoded({
    extended: false
}))

app.use('/', (req, res, next) => {
    console.log('this always runs!')
    next();
})

app.use('/add-product', (req, res, next) => {
    console.log('in add product middleware')
    res.send('<form action="/product" method="POST"><input type="text" name="title"><button type="submit">Add product</button></form>')

})

app.use('/product', (req, res) => {
    console.log(req.body);
    res.redirect('/');
})

app.use('/', (req, res, next) => {
    console.log('in another middleware!');
    res.send('<h1>Hello from express.js</h1>');
})

app.listen(3000);