const path = require("path");
const { v4: uuidv4 } = require("uuid");
const express = require("express");
const multer = require("multer");

const mongoose = require("mongoose");
const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");

const app = express();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images");
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4().toString() + "-" + file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    console.log(file);
    /**
   * {
        fieldname: 'image',
        originalname: 'Capture.PNG',
        encoding: '7bit',
        mimetype: 'image/png'
      }
   */
    if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

app.use(express.json());
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')); // REGISTERING MULTER
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");

    res.setHeader(
        "Access-Control-Allow-Methods",
        "POST, GET, PUT, DELETE, OPTIONS, PATCH"
    );

    res.setHeader(
        "Access-Control-Allow-Headers",
        "Authorization, Content-Type"
    );
    next(); // calling next middleware
});

/* ROUTES */
app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);

app.use((error, req, res, next) => {
    console.log(">>>>>>>>>>>>ERROR HANDLING MIDDLEWARE", error);
    const status = error.statusCode || 500; // default value is 500
    const message = error.message;
    const data = error.data || null;
    res.status(status).json({
        message: message,
        data: data
    });
});

mongoose
    .connect(
        "mongodb+srv://devusr:ddreb0660@cluster0.fyweo.mongodb.net/messages?retryWrites=true&w=majority"
    )
    .then((result) => {
        app.listen(8080);
    })
    .catch((err) => console.log(err));
