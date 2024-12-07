const express = require('express');
var app = express();

// Import child routers
const postRouter = require("./post.routes");
const uploadRouter = require("./upload.routes");

// Use child router
app.use("/post", postRouter);
app.use("/upload", uploadRouter);

module.exports = app;