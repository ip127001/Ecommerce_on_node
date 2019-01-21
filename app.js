const http = require('http');
const path = require('path');

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const errorController = require('./controllers/error');

const User = require('./models/user');

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');


const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(express.static(path.join(__dirname, '/public')))

app.use(bodyParser.urlencoded({
    extended: false
}))

app.use((req, res, next) => {
    User.findById('5c424a56bfd7b0446ac53b8f')
        .then(user => {
            // console.log("user", user)
            req.user = user; // user = full mongoose model all functionality added
            next();
        })
        .catch(err => {
            console.log(err);
        });
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.error404);

mongoose
    .connect('mongodb+srv://rohit_kumawat:cunltC77NOGz1jqS@ecommerce-rs4wl.mongodb.net/shop?retryWrites=true')
    .then(result => {
        User.findOne().then(user => {
            if (!user) {
                const user = new User({
                    name: 'rohit',
                    email: 'geekrk.01@gmail.com',
                    cart: {
                        items: []
                    }
                })
                user.save();
            }
        })
        app.listen(3000);
    })
    .catch(err => console.log(err));