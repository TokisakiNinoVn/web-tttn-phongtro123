const express = require('express');
const router = express.Router();
const { postController } = require('../../controllers/index');

router.post('/search', postController.searchByAddress);
router.post('/filter', postController.filter);
router.post('/b/same-type', postController.getPostSameType);

router.get('/:id', postController.getById);
router.get('/a/new', postController.getNewPost);


module.exports = router;
