const http = require('http');
const path = require('path');

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI = 'mongodb+srv://rohit_kumawat:cunltC77NOGz1jqS@ecommerce-rs4wl.mongodb.net/shop';

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
})
const csrfProtection = csrf();


app.set('view engine', 'ejs');
app.set('views', 'views');


app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(express.static(path.join(__dirname, '/public')))
app.use(session({ // cookie setting and reading for us in browser
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
}));
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
    // console.log('session user', req.session.user);
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            if (!user) {
                return next();
            }
            req.user = user;
            next();
        })
        .catch(err => {
            throw new Error(err);
        });
});

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.error404);

mongoose
    .connect('mongodb+srv://rohit_kumawat:cunltC77NOGz1jqS@ecommerce-rs4wl.mongodb.net/shop?retryWrites=true')
    .then(result => {
        app.listen(3000);
    })
    .catch(err => console.log(err));