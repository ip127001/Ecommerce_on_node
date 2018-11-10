const http = require('http');

const express = require('express')
const bodyParser = require('body-parser')


const app = express();

app.use(bodyParser.urlencoded({
    extended: false
}))

app.get('/add-product', (req, res, next) => {
    console.log('in add product middleware')
    res.send('<form action="/product" method="POST"><input type="text" name="title"><button type="submit">Add product</button></form>')

})

app.post('/product', (req, res) => {
    console.log(req.body);
    res.redirect('/');
})

app.get('/', (req, res, next) => {
    console.log('in another middleware!');
    res.send('<h1>Hello from express.js</h1>');
})

app.listen(3000);