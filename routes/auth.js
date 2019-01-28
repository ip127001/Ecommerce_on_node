const express = require('express');
const {
    check,
    body
} = require('express-validator/check');

const authController = require('../controllers/auth')
const User = require('../models/user')

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
        .withMessage('Please enter a valid email')
        .custom((value, {
            req
        }) => {
            // if (value === 'test@test.com') {
            //     throw new Error('This email is forbidden')
            // }
            // return true;
            return User.findOne({
                email: value
            }).then(userDoc => {
                if (userDoc) {
                    return Promise.reject('Email exists already, pick another one')
                }
            })
        }),
        body(
            'password',
            'enter a password of length atleast 5 with numbers and text only'
        )
        .isLength({
            min: 5
        }).isAlphanumeric(),

        body('confirmPassword')
        .custom((value, {
            req
        }) => {
            if (value !== req.body.password) {
                throw new Error('password do not match');
            }
            return true;
        })
    ],
    authController.postSignup);

router.post('/logout', authController.postLogout);

router.post('/reset', authController.postReset);

router.post('/new-password', authController.postNewPassword);

module.exports = router;