const express = require("express");
const feedRoutes = require("./routes/feed");

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  res.setHeader("Access-Control-Allow-Methods", 'POST, GET, PUT, DELETE, OPTIONS');

  res.setHeader("Access-Control-Allow-Headers", 'Authorization, Content-Type')
  next(); // calling next middleware
});

app.use("/feed", feedRoutes);

app.listen(8080);
