const express = require('express');
const multer = require('multer');
const path = require('path');
const AppError = require('../utils/app-error');
const { HTTP_STATUS } = require('../constants/status-code');
const db = require('../config/db.config');

// Set up the multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.mimetype.startsWith('image')) {
            cb(null, 'public/uploads/images/posts/');
        } else if (file.mimetype.startsWith('video')) {
            cb(null, 'public/uploads/videos/posts/');
        } else {
            cb(new Error('Invalid file type'), null);
        }
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Configure multer upload limit (up to 10 files)
const upload = multer({ 
    storage: storage, 
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
}).array('files', 10);

// Upload controller
exports.uploadFile = async (req, res, next) => {
    upload(req, res, async (err) => { 
        try {
            if (!req.files || req.files.length === 0) {
                // return next(new AppError(HTTP_STATUS.BAD_REQUEST, 'No files uploaded', 'You must upload at least one file.'));
                return res.status(HTTP_STATUS.OK).json({
                    data: [],
                    message: 'No files uploaded'
                });
            }

            const postId = req.body.postId; // Lấy postId từ req.body
            
            // Kiểm tra xem postId có hợp lệ không (tùy thuộc vào logic của bạn)
            if (!postId) {
                return next(new AppError(HTTP_STATUS.BAD_REQUEST, 'Invalid post ID', 'You must provide a valid post ID.'));
            }

            // Xử lý các file và lưu vào cơ sở dữ liệu
            const files = req.files.map(file => {
                const type = file.mimetype.startsWith('image') ? 1 : 2; // 1: Image, 2: Video
                const url = `/uploads/${file.mimetype.startsWith('image') ? 'images' : 'videos'}/posts/${file.filename}`;

                // Thực hiện lưu vào cơ sở dữ liệu
                const insertQuery = `INSERT INTO files (id_post, url, type) VALUES (?, ?, ?)`;
                db.pool.execute(insertQuery, [postId, url, type]); // Sử dụng postId đã lấy

                return { url, type };
            });

            return res.status(HTTP_STATUS.OK).json({
                data: files
            });
        } catch (error) {
            return next(new AppError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Error uploading files', error.message));
        }
    });
};

exports.upload3dImage = async (req, res, next) => {
    upload(req, res, async (err) => { 
        try {
            if (!req.files || req.files.length === 0) {
                // return next(new AppError(HTTP_STATUS.BAD_REQUEST, 'No files uploaded', 'You must upload at least one file.'));
                return res.status(HTTP_STATUS.OK).json({
                    data: []
                });
            }
            const postId = req.body.postId;
            // Xử lý các file và lưu vào cơ sở dữ liệu
            const files = req.files.map(file => {
                const type = file.mimetype.startsWith('image') ? 3 : 2; // 1: Image 3d, 2: Video
                const url = `/uploads/${file.mimetype.startsWith('image') ? 'images' : 'videos'}/posts/${file.filename}`;
    
                // Thực hiện lưu vào cơ sở dữ liệu
                const insertQuery = `INSERT INTO files (id_post, url, type) VALUES (?, ?, ?)`;
                db.pool.execute(insertQuery, [postId, url, type]);
    
                return { url, type };
            });
    
            return res.status(HTTP_STATUS.OK).json({
                data: files
            });
        } catch (error) {
            return next(new AppError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Error uploading files', error.message));
        }
    })
};


// exports.saveInforUpload