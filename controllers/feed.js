const express = require("express");
const os = require("os");
const osType = os.type();

const path = require("path");
const { validationResult } = require("express-validator");
const { StatusCodes } = require("http-status-codes");
const Post = require("../models/post");
const deleteFile = require("../helpers/deleteFile").deleteFile;

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {Function} next
 */
exports.getPosts = async (req, res, next) => {
    try {
        const currentPage = req?.query?.page || 1;
        const perPage = 2;
        const totalPosts = await Post.find().countDocuments();

        const posts = await Post.find()
            .skip((currentPage - 1) * perPage)
            .limit(perPage);
        res.status(StatusCodes.OK).json({
            message: "Fetched posts successfully",
            posts: posts,
            totalItems: totalPosts
        });
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
exports.getPost = async (req, res, next) => {
    try {
        const postId = req.params["postId"];
        console.log(">>>>>>>PostID", postId);
        const post = await Post.findById(postId);
        if (!post) {
            const error = new Error("Couldn't find the post");
            error.statusCode = StatusCodes.NOT_FOUND;
            throw error;
        }
        res.status(StatusCodes.OK).json({
            message: "Post fetched",
            post: post,
        });
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
exports.createPost = async (req, res, next) => {
    try {
        const errors = validationResult(req); // IF THERE ARE ANY ERRORS,
        // IT WILL BE PUT INSIDE "errors"

        if (!errors.isEmpty()) {
            const error = new Error(
                "Validation failed, entered data is incorrect"
            );
            error.statusCode = StatusCodes.UNPROCESSABLE_ENTITY;
            throw error;
        }

        if (!req.file) {
            const error = new Error("No image provided");
            error.statusCode = StatusCodes.OK;
            throw error;
        }

        const title = req.body?.title;
        const content = req.body?.content;
        const imageUrl =
            osType === "Windows_NT"
                ? req.file.path.replace("\\", "/")
                : req.file.path; // IT IS THE PATH WHERE MULTER STORED THE IMAGE FILE

        const post = new Post({
            title: title,
            content: content,
            imageUrl: imageUrl,
            creator: {
                name: "Shouvik",
            },
        });

        const result = await post.save();
        console.log(result);

        res.status(StatusCodes.CREATED).json({
            message: "Successfully created a post",
            post: result,
        });
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
module.exports.updatePost = async (req, res, next) => {
    try {
        const postId = req.params["postId"];
        const errors = validationResult(req); // IF THERE ARE ANY ERRORS,
        // IT WILL BE PUT INSIDE "errors"

        if (!errors.isEmpty()) {
            const error = new Error(
                "Validation failed, entered data is incorrect"
            );
            error.statusCode = StatusCodes.UNPROCESSABLE_ENTITY;
            throw error;
        }
        const title = req.body.title;
        const content = req.body["content"];
        let imageUrl = req.body.image;
        if (req.file) {
            imageUrl =
                osType === "Windows_NT"
                    ? req.file.path.replace("\\", "/")
                    : req.file.path;
        }

        if (!imageUrl) {
            const error = new Error("No file picked");
            error.statusCode = StatusCodes.BAD_REQUEST;
            throw error;
        }

        const post = await Post.findById(postId);
        if (!post) {
            const error = new Error("Couldn't find the post");
            error.statusCode = StatusCodes.NOT_FOUND;
            throw error;
        }

        if (imageUrl !== post.imageUrl) {
            deleteFile(post.imageUrl);
        }
        post.title = title;
        post.content = content;
        post.imageUrl = imageUrl;
        const postSaveResult = await post.save();
        res.status(StatusCodes.OK).json({
            message: "Post updated",
            post: postSaveResult,
        });
    } catch (error) {
        console.log(">>>>>>>>>>>>>>>>ERROR REACHED HERE");
        if (!error.statusCode) {
            error.statusCode = StatusCodes.UNPROCESSABLE_ENTITY;
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
module.exports.deletePost = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const post = await Post.findById(postId);
        if (!post) {
            const error = new Error("Post not found");
            error.statusCode = StatusCodes.NOT_FOUND;
            throw error;
        }

        // CHECK LOGGEDIN USER
        deleteFile(post.imageUrl);
        const postDeleteResult = await Post.findByIdAndRemove(postId);
        return res.status(StatusCodes.OK).json({ message: "Post deleted" });
    } catch (error) {
        console.log(">>>>>>>>>>>>>>>>ERROR REACHED HERE");
        if (!error.statusCode) {
            error.statusCode = StatusCodes.UNPROCESSABLE_ENTITY;
        }
        next(error);
    }
};
