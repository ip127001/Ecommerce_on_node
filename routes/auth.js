const express = require('express');

const authController = require('../controllers/auth')
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/login', isAuth, authController.getLogin);

router.get('/signup', isAuth, authController.getSignup);

router.post('/login', isAuth, authController.postLogin);

router.post('/signup', isAuth, authController.postSignup);

router.post('/logout', isAuth, authController.postLogout);

module.exports = router;