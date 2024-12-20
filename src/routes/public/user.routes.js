// user.router.js
const express = require('express');
const router = express.Router();
const { userController } = require('../../controllers/index');

router.get('/post/:userId', userController.getAllPostOfUser);

module.exports = router;
