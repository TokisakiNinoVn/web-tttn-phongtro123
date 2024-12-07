const express = require('express');
const router = express.Router();

// Import child routers
const authRouter = require('./auth.routes');
const postRouter = require('./post.routes');
const typeRouter = require('./type.routes');

// Use child router
router.use('/auth', authRouter);
router.use('/post', postRouter);
router.use('/type', typeRouter);

module.exports = router;
