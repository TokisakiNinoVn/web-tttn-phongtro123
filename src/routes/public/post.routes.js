const express = require('express');
const router = express.Router();
const { postController } = require('../../controllers/index');

// Lấy thông tin chi tiết bài đăng
router.get('/:id', postController.getById);

// Tìm kiếm bài đăng theo địa chỉ
router.post('/search', postController.searchByAddress);

// Lọc bài đăng theo tiêu chí
router.post('/filter', postController.filter);

// Lấy bài đăng mới nhất
router.get('/a/new', postController.getNewPost);

// Lấy bài đăng cùng loại
router.post('/b/same-type', postController.getPostSameType);

module.exports = router;
