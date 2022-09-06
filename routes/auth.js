const express = require("express");
const { body, check } = require("express-validator");
const User = require("../models/user");
const authController = require('../controllers/auth');

const router = express.Router();

router.post("/signup", [
    body("email")
        .isEmail()
        .withMessage("Please enter a valid email")
        .custom((value, { req }) => {
            return User.findOne({ email: value }).then((userDoc) => {
                if (userDoc) {
                    return Promise.reject("User with email is already present");
                }
            });
        }).normalizeEmail(),
    body('password').trim().isLength({min: 5}),
    body('name').trim().not().isEmpty()
], authController.signupUser);


router.post('/login', authController.loginUser);

module.exports = router;
