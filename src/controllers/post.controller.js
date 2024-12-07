const db = require('../config/db.config');
const { HTTP_STATUS } = require('../constants/status-code');
const AppError = require('../utils/app-error');
const path = require('path');
const fs = require('fs')

exports.create = async (req, res, next) => {
    const { userId, title, type, address, price, acreage, realaddress, owner, phoneOwner, description, amenities } = req.body;
    // console.log(req.body);

    try {
        // Tạo bài đăng
        const createPostQuery = `
            INSERT INTO posts (id_user_post, title, type, address, price, acreage, realaddress, owner, phone_owner, description, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        `;
        const [postResult] = await db.pool.execute(createPostQuery, [
            userId,
            title,
            type,
            address,
            price,
            acreage,
            realaddress,
            owner,
            phoneOwner,
            description
        ]);

        const postId = postResult.insertId;

        const createAmenityQuery = `
            INSERT INTO amenities (id_post, fully_furnished, garret, washing_machine, free_time, fridge, protect, kitchen_shelf, elevator, common_owner, air_conditioner, parking)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        await db.pool.execute(createAmenityQuery, [postId, ...amenities]);

        res.status(HTTP_STATUS.OK).json({
            message: 'Post created successfully',
            data: { postId }
        });
    } catch (error) {
        return next(new AppError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'fail', error.message, []), req, res, next);
    }
}


exports.update = async (req, res, next) => {
    // Cấu hình upload giống như trong hàm create
    upload(req, res, async (err) => {
        if (err) {
            return next(new AppError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Error uploading files', err.message), req, res, next);
        }

        const { postId, title, type, address, price, acreage, realaddress, owner, phoneOwner, description, amenities } = req.body;

        // Kiểm tra dữ liệu tiện ích
        if (!Array.isArray(amenities) || amenities.length !== 11) {
            return next(new AppError(HTTP_STATUS.BAD_REQUEST, 'Invalid amenities format', 'Amenities must be an array of 12 integers'), req, res, next);
        }

        try {
            // Cập nhật bài đăng
            const updatePostQuery = `
                UPDATE posts
                SET title = ?, type = ?, address = ?, price = ?, acreage = ?, realaddress = ?, owner = ?, phone_owner = ?, description = ?, updatedAt = NOW()
                WHERE id = ?
            `;
            await db.pool.execute(updatePostQuery, [
                title,
                type,
                address,
                price,
                acreage,
                realaddress,
                owner,
                phoneOwner,
                description,
                postId
            ]);

            // Kiểm tra xem tiện ích đã tồn tại hay chưa
            const checkAmenitiesQuery = `SELECT COUNT(*) AS count FROM amenities WHERE id_post = ?`;
            const [rows] = await db.pool.execute(checkAmenitiesQuery, [postId]);
            const { count } = rows[0];

            if (count === 0) {
                // Chèn bản ghi mặc định nếu chưa tồn tại
                const insertAmenitiesQuery = `
                    INSERT INTO amenities (id_post, fully_furnished, garret, washing_machine, free_time, fridge, protect, kitchen_shelf, elevator, common_owner, air_conditioner, parking)
                    VALUES (?, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
                `;
                await db.pool.execute(insertAmenitiesQuery, [postId]);
            }

            // Cập nhật tiện ích
            const updateAmenitiesQuery = `
                UPDATE amenities
                SET fully_furnished = ?, garret = ?, washing_machine = ?, free_time = ?, fridge = ?, protect = ?, 
                    kitchen_shelf = ?, elevator = ?, common_owner = ?, air_conditioner = ?, parking = ?
                WHERE id_post = ?
            `;
            await db.pool.execute(updateAmenitiesQuery, [...amenities, postId]);

            // Xử lý upload file (ảnh/video) mới nếu có
            if (req.files && req.files.length > 0) {
                const fileInsertQuery = `
                    INSERT INTO files (id_post, url, type)
                    VALUES (?, ?, ?)
                `;
                const filePromises = req.files.map(file => {
                    const type = file.mimetype.startsWith('image') ? 1 : 2; // 1: Image, 2: Video
                    const url = `/uploads/${file.mimetype.startsWith('image') ? 'images' : 'videos'}/posts/${file.filename}`;
                    return db.pool.execute(fileInsertQuery, [postId, url, type]);
                });
                await Promise.all(filePromises);
            }

            return next({ statusCode: HTTP_STATUS.OK, message: 'Post and amenities updated successfully', data: {} }, req, res, next);
        } catch (error) {
            return next(new AppError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'fail', error.message, []), req, res, next);
        }
    });
};

exports.delete = async (req, res, next) => {
    // const { userId, postId } = req.body;
    const { id } = req.params;

    try {
        await db.pool.execute(`DELETE FROM amenities WHERE id_post = ?`, [id]);

        // Lấy thông tin về các file đã upload (để xóa chúng khỏi server)
        const [files] = await db.pool.execute(`SELECT url FROM files WHERE id_post = ?`, [id]);

        // Xóa các file trong bảng 'files'
        await db.pool.execute(`DELETE FROM files WHERE id_post = ?`, [id]);

        // Xóa các tệp tin trên server
        files.forEach(file => {
            const filePath = path.join(__dirname, '..', 'public', file.url); // Đảm bảo đường dẫn đúng với thư mục public trên server
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        });

        // Xóa bài đăng trong bảng 'posts'
        await db.pool.execute(`DELETE FROM posts WHERE id = ?`, [id]);

        return next({ statusCode: HTTP_STATUS.OK, message: 'Post and related data deleted successfully', data: {} }, req, res, next);
    } catch (error) {
        return next(new AppError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'fail', error.message, []), req, res, next);
    }
};


exports.getById = async (req, res, next) => {
    const { postId } = req.params;

    try {
        const [post] = await db.pool.execute(`SELECT * FROM posts WHERE id = ?`, [postId]);
        if (post.length === 0) {
            return next(new AppError(HTTP_STATUS.NOT_FOUND, 'fail', 'Post not found', []), req, res, next);
        }

        return next({ statusCode: HTTP_STATUS.OK, message: 'Post retrieved successfully', data: post[0] }, req, res, next);
    } catch (error) {
        return next(new AppError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'fail', error.message, []), req, res, next);
    }
};

exports.getAllPostOfUser = async (req, res, next) => {
    const { userId } = req.params;

    try {
        const [posts] = await db.pool.execute(`SELECT * FROM posts WHERE id_user_post = ?`, [userId]);

        return next({ statusCode: HTTP_STATUS.OK, message: 'Posts retrieved successfully', data: posts }, req, res, next);
    } catch (error) {
        return next(new AppError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'fail', error.message, []), req, res, next);
    }
};

exports.searchByAddress = async (req, res, next) => {
    const { address } = req.body;

    try {
        const [posts] = await db.pool.execute(`SELECT * FROM posts WHERE address LIKE ?`, [`%${address}%`]);

        return next({ statusCode: HTTP_STATUS.OK, message: 'Posts retrieved successfully', data: posts }, req, res, next);
    } catch (error) {
        return next(new AppError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'fail', error.message, []), req, res, next);
    }
};

exports.filter = async (req, res, next) => {
    const { type, address, price, acreage, amenities } = req.body;

    try {
        let query = `
            SELECT * FROM posts
            WHERE type LIKE ? AND address LIKE ? AND price <= ? AND acreage >= ?
        `;
        const params = [`%${type}%`, `%${address}%`, price, acreage];

        if (amenities && amenities.length > 0) {
            query += ` AND id IN (
                SELECT id_post FROM amenities WHERE ${amenities.map(id => `${id} = 1`).join(' AND ')}
            )`;
        }

        const [posts] = await db.pool.execute(query, params);

        return next({ statusCode: HTTP_STATUS.OK, message: 'Posts filtered successfully', data: posts }, req, res, next);
    } catch (error) {
        return next(new AppError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'fail', error.message, []), req, res, next);
    }
};


exports.savePost = async (req, res, next) => {
    const { userId, postId } = req.body;

    try {
        // Kiểm tra xem postId và userId có tồn tại không
        const [post] = await db.pool.execute(`SELECT id FROM posts WHERE id = ?`, [postId]);
        const [user] = await db.pool.execute(`SELECT id FROM users WHERE id = ?`, [userId]);

        if (post.length === 0 || user.length === 0) {
            return next(new AppError(HTTP_STATUS.NOT_FOUND, 'fail', 'Post or User not found', []), req, res, next);
        }

        // Lưu post vào danh sách đã lưu
        const sql = `INSERT INTO saves_post (id_user, id_post) VALUES (?, ?)`;
        await db.pool.execute(sql, [userId, postId]);

        return next({ status: HTTP_STATUS.OK, message: 'Post saved successfully', data: [] }, req, res, next);
    } catch (error) {
        return next(new AppError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'fail', error.message, []), req, res, next);
    }
};

exports.getSavedPost = async (req, res, next) => {
    const { userId } = req.params;

    try {
        // Lấy danh sách bài đăng đã lưu của user
        const sql = `
            SELECT p.id, p.title, p.price, p.address, p.createdAt 
            FROM saves_post sp
            INNER JOIN posts p ON sp.id_post = p.id
            WHERE sp.id_user = ?`;
        const [posts] = await db.pool.execute(sql, [userId]);

        return next({ status: HTTP_STATUS.OK, message: 'Saved posts retrieved successfully', data: posts }, req, res, next);
    } catch (error) {
        return next(new AppError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'fail', error.message, []), req, res, next);
    }
};

exports.getNewPost = async (req, res, next) => {
    try {
        // Lấy 10 bài đăng mới nhất
        const sql = `SELECT id, title, price, address, createdAt FROM posts ORDER BY createdAt DESC LIMIT 10`;
        const [posts] = await db.pool.execute(sql);

        return next({ status: HTTP_STATUS.OK, message: 'Newest posts retrieved successfully', data: posts }, req, res, next);
    } catch (error) {
        return next(new AppError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'fail', error.message, []), req, res, next);
    }
};

exports.getPostSameType = async (req, res, next) => {
    const { type } = req.body;

    try {
        // Lấy danh sách bài đăng cùng loại
        const sql = `SELECT id, title, price, address, createdAt FROM posts WHERE type = ? ORDER BY createdAt DESC`;
        const [posts] = await db.pool.execute(sql, [type]);

        return next({ status: HTTP_STATUS.OK, message: 'Posts of the same type retrieved successfully', data: posts }, req, res, next);
    } catch (error) {
        return next(new AppError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'fail', error.message, []), req, res, next);
    }
};
