const path = require('path');
const fs = require('fs')
const https = require('https');

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');
const helmet = require('helmet')
const compression = require('compression')
const morgan = require('morgan');

const errorController = require('./controllers/error');
const User = require('./models/user');
const shopController = require('./controllers/shop');
const isAuth = require('./middleware/is-auth');

const MONGODB_URI = 
        `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@ecommerce-rs4wl.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`;

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
})
const csrfProtection = csrf();
const privateKey = fs.readFileSync('server.key')
const certificate = fs.readFileSync('server.cert')
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname)
    }
})
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

app.set('view engine', 'ejs');
app.set('views', 'views');


app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(multer({
    storage: fileStorage,
    fileFilter: fileFilter
}).single('image'));
app.use(express.static(path.join(__dirname, '/public'))) // express static middleware
app.use('/images', express.static(path.join(__dirname, '/images')))
app.use(session({ // cookie setting and reading for us in browser
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
}));
app.use(flash());
app.use((req, res, next) => {
    // console.log('session user', req.session.user);
    // throw new Error('Sync dummy');  
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            //throw new Error(err);       
            if (!user) {
                return next();
            }
            req.user = user;
            next();
        })
        .catch(err => {
            next(new Error(err));
        });
});
// if throw error outside then()catch() then it redirect to error middleware, if use inside then() then use next(err)

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});
app.use(helmet());
app.use(compression());
app.use(morgan('combined', {stream: accessLogStream}));


app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    next();
})

app.post('/create-order', isAuth, shopController.postOrder);

app.use(csrfProtection);

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);


app.get('/500', errorController.error500)

app.use(errorController.error404);

app.use((error, req, res, next) => {
    // res.redirect('/500')
    console.log('error in app.js', error);
    res.status(500).render('500', {
        pageTitle: 'Server Error Page',
        path: '/500',
        isAuthenticated: req.session.isLoggedIn
    });
})

console.log(process.env.NODE_ENV);

mongoose
    .connect(MONGODB_URI)
    .then(result => {
        // https.createServer({key: privateKey, cert: certificate}, app)
        app.listen(process.env.PORT || 3000);
    })
    .catch(err => console.log(err));