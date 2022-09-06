const express = require('express');
const jwt = require('jsonwebtoken');
const {StatusCodes} = require('http-status-codes')

const credentials = require('../credentials/keys');


/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {Function} next 
 */
module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if(!authHeader) {
        const error = new Error('Not authenticated');
        error.statusCode = StatusCodes.UNAUTHORIZED;
        throw error;
    }
    const token = authHeader.split(' ')[1];

    let decodedToken;

    try {
        decodedToken = jwt.verify(token, credentials.SECRET_KEYS.jwtKey);
    } catch (error) {
        error.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
        throw error;
    }

    if(!decodedToken) {
        const error = new Error("Not authorized.");
        error.statusCode = StatusCodes.UNAUTHORIZED;
        throw error;
    }

    req.userId = decodedToken?.userId;
    next(); // FORWARD TO THE NEXT MIDDLEWARE
}