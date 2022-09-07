const express = require("express");

/* LOCAL MODULES */
const credentials = require("../credentials/keys");

/* THIRD PARTY */
const { validationResult } = require("express-validator");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* MODELS */
const User = require("../models/user");

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {Function} next
 */
module.exports.signupUser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error("Validation failed");
            error.statusCode = StatusCodes.UNPROCESSABLE_ENTITY;
            error.data = errors.array();
            throw error;
        }
        const name = req.body["name"];
        const email = req.body["email"];
        const password = req.body["password"];
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({
            email: email,
            password: hashedPassword.toString(),
            name: name,
        });
        const userSaveResult = await user.save();
        return res
            .status(StatusCodes.CREATED)
            .json({ message: "User created", userId: userSaveResult._id });
    } catch (error) {
        console.log(">>>>>>>>>>>>>>>>ERROR REACHED HERE");
        if (!error.statusCode) {
            error.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
        }
        next(error);
    }
};

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {Function} next
 */
module.exports.loginUser = async (req, res, next) => {
    try {
        const email = req.body?.email;
        const password = req.body?.password;
        const user = await User.findOne({ email: email });

        if (!user) {
            const error = new Error("No user found with provided email");
            error.statusCode = StatusCodes.UNAUTHORIZED;
            throw error;
        }
        const authenticated = await bcrypt.compare(password, user.password);

        if (!authenticated) {
            const error = new Error("Wrong password entered");
            error.statusCode = StatusCodes.UNAUTHORIZED;
            throw error;
        }

        const token = jwt.sign(
            { email: user.email, userId: user._id.toString() },
            credentials.SECRET_KEYS.jwtKey,
            { expiresIn: "1h" }
        );

        return res
            .status(StatusCodes.OK)
            .json({ token, userId: user._id.toString() });
    } catch (error) {
        console.log(">>>>>>>>>>>>>>>>ERROR REACHED HERE");
        if (!error.statusCode) {
            error.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
        }
        next(error);
    }
};


/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {Function} next
 */
 module.exports.userStatus = async (req, res, next) => {
    try {
        const userId = req?.userId;
        const user = await User.findById(userId);
        if(!user) {
            const error = new Error("User not found");
            error.statusCode = StatusCodes.BAD_REQUEST;
            throw error;
        }
        res.status(StatusCodes.OK).json({status: user.status});
    } catch (error) {
        console.log(">>>>>>>>>>>>>>>>ERROR REACHED HERE");
        if (!error.statusCode) {
            error.statusCode = StatusCodes.UNPROCESSABLE_ENTITY;
        }
        next(error);
    }
}


/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {Function} next
 */
module.exports.updateUserStatus = async (req, res, next) => {
    try {
        const newStatus = req.body?.status;
        const user = await User.findById(req?.userId);
        if(!user) {
            const error = new Error("User not found");
            error.statusCode = StatusCodes.BAD_REQUEST;
            throw error;
        }
        user.status = newStatus;
        // SAVE USER BACK TO DATABASE
        await user.save();
        res.status(StatusCodes.OK).json({message: 'User status updated'});
    } catch (error) {
        console.log(">>>>>>>>>>>>>>>>ERROR REACHED HERE");
        if (!error.statusCode) {
            error.statusCode = StatusCodes.UNPROCESSABLE_ENTITY;
        }
        next(error);
    }
}