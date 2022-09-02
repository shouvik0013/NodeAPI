const express = require("express");

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {Function} next
 */
exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [{ title: "This is first post", content: "This is dummy content" }],
  });
};

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {Function} next
 */
exports.postPost = (req, res, next) => {
  const title = req.body?.title;
  const content = req.body?.content;

  res.status(201).json({
    message: "Successfully created a post",
    post: {
      id: new Date().toISOString(),
      title: title,
      content: content,
    },
  });
};
