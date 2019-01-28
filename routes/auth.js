const express = require('express');
const {
    check,
    body
} = require('express-validator/check');

const authController = require('../controllers/auth')

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.get('/reset', authController.getReset);

router.post('/login', authController.postLogin);

router.get('/reset/:token', authController.getNewPassword);

router.post(
    '/signup',
    [check('email')
        .isEmail()
        .withMessage('Please enter a valid email'),
        body('password', 'enter a password of length atleast 5 with numbers and text only')
        .isLength({
            min: 5
        }).isAlphanumeric()
    ],
    authController.postSignup);

router.post('/logout', authController.postLogout);

router.post('/reset', authController.postReset);

router.post('/new-password', authController.postNewPassword);

module.exports = router;