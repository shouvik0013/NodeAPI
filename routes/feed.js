/* THIRD PARTY */
const express = require("express");
const { body, check } = require("express-validator");

/* CONTROLLER */
const feedController = require("../controllers/feed");

/* LOCALS */
const isAuth = require("../middleware/is-auth");

/* ROUTER */
const router = express.Router();

router.get("/posts", isAuth, feedController.getPosts);


router.post(
    "/posts",
    [
        body("title").trim().isLength({ min: 5 }),
        body("content").trim().isLength({ min: 5 }),
    ],
    isAuth,
    feedController.createPost
);

router.get("/post/:postId", isAuth, feedController.getPost);

router.put(
    "/post/:postId",
    isAuth,
    [
        body("title").trim().isLength({ min: 5 }),
        body("content").trim().isLength({ min: 5 }),
    ],
    feedController.updatePost
);

router.delete("/post/:postId", isAuth, feedController.deletePost);

module.exports = router;
