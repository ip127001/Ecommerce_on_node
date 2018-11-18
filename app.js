const http = require('http');
const path = require('path');

const express = require('express')
const bodyParser = require('body-parser')
const expressHbs = require('express-handlebars')

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoute = require('./routes/admin');
const shopRoute = require('./routes/shop');

app.use(bodyParser.urlencoded({
    extended: false
}))

app.use(express.static(path.join(__dirname, 'public')))

app.use('/admin', adminRoute.routes);
app.use(shopRoute);

app.use((req, res, next) => {
    res.status(404).render('404', {
        pageTitle: 'Error Page'
    });
});

app.listen(8080);