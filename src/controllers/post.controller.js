const db = require('../config/db.config');
const { HTTP_STATUS } = require('../constants/status-code');
const AppError = require('../utils/app-error');
const path = require('path');
const fs = require('fs')

exports.create = async (req, res, next) => {
    const { userId, title, type, address, price, acreage, realaddress, owner, phoneOwner, description, amenities } = req.body;

    try {
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
    const { id } = req.params;

    try {
        // Lấy thông tin bài viết
        const [post] = await db.pool.execute(`
            SELECT *
            FROM posts
            WHERE id = ?
        `, [id]);

        if (post.length === 0) {
            return next(new AppError(HTTP_STATUS.NOT_FOUND, 'fail', 'Post not found', []), req, res, next);
        }

        const [amenities] = await db.pool.execute(`
            SELECT fully_furnished, garret, washing_machine, free_time, fridge, protect, kitchen_shelf, elevator, common_owner, air_conditioner, parking
            FROM amenities
            WHERE id_post = ?
        `, [id]);

        const [files] = await db.pool.execute(`
            SELECT *
            FROM files
            WHERE id_post = ?
        `, [id]);

        // Phân loại files
        const filesNormal = files.filter(file => file.type !== 3);
        const files360 = files.filter(file => file.type === 3);

        const idUserPost = post[0].id_user_post;
        const [user] = await db.pool.execute(`
            SELECT phone, name, zalo, fbUrl, avatar, verify, bio, status, createdAt
            FROM users
            WHERE id = ?
        `, [idUserPost]);

        if (user.length === 0) {
            return next(new AppError(HTTP_STATUS.NOT_FOUND, 'fail', 'User not found', []), req, res, next);
        }

        const postData = {
            ...post[0],
            amenities: amenities || [],
            filesNormal: filesNormal || [],
            files360: files360 || [],
            user: user[0]
        };

        // Trả về kết quả
        res.status(HTTP_STATUS.OK).json({
            code: HTTP_STATUS.OK,
            message: 'Post retrieved successfully',
            data: postData
        });
    } catch (error) {
        return next(new AppError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'fail', error.message, []), req, res, next);
    }
};

exports.searchByAddress = async (req, res, next) => {
    const { address } = req.body;

    try {
        const [posts] = await db.pool.execute(`SELECT * FROM posts WHERE address LIKE ?`, [`%${address}%`]);
        if (posts.length === 0) {
            return next(new AppError(HTTP_STATUS.NOT_FOUND, 'fail', 'No posts found', []), req, res, next);
        }

        const postsWithFiles = await Promise.all(
            posts.map(async (post) => {
                const [files] = await db.pool.execute(
                    `SELECT * FROM files WHERE id_post = ?`,
                    [post.id]
                );
                return { ...post, files };
            })
        );

        res.status(HTTP_STATUS.OK).json({
            code: HTTP_STATUS.OK,
            message: 'Posts retrieved successfully',
            data: postsWithFiles
        });
    } catch (error) {
        return next(new AppError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'fail', error.message, []), req, res, next);
    }
};
exports.filter = async (req, res, next) => {
    const { type, address, price, acreage, amenities } = req.body;

    try {
        // Build the base query
        let query = `
            SELECT * FROM posts
            WHERE type LIKE ? AND address LIKE ? AND price <= ? AND acreage >= ?
        `;
        const params = [`%${type}%`, `%${address}%`, price, acreage];

        // Append amenities filter if provided
        if (amenities && amenities.length > 0) {
            const amenitiesConditions = amenities.map(id => `${id} = 1`).join(' AND ');
            query += ` AND id IN (
                SELECT id_post FROM amenities WHERE ${amenitiesConditions}
            )`;
        }

        // Execute the query to get posts
        const [posts] = await db.pool.execute(query, params);

        // Fetch files associated with each post
        const postsWithFiles = await Promise.all(
            posts.map(async (post) => {
                const [files] = await db.pool.execute(
                    `SELECT * FROM files WHERE id_post = ?`,
                    [post.id]
                );
                return { ...post, files };
            })
        );

        // Respond with filtered posts and their files
        res.status(HTTP_STATUS.OK).json({
            code: HTTP_STATUS.OK,
            totalDocs: postsWithFiles.length,
            data: postsWithFiles,
            message: 'Posts filtered successfully',
        });
    } catch (error) {
        // Handle errors gracefully
        return next(new AppError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'fail', error.message, []), req, res, next);
    }
};

exports.getNewPost = async (req, res, next) => {
    try {
        // Lấy 10 bài đăng mới nhất
        const sql = `SELECT * FROM posts ORDER BY createdAt DESC LIMIT 10`;
        const [posts] = await db.pool.execute(sql);

        const postsWithFiles = await Promise.all(
            posts.map(async (post) => {
                const [files] = await db.pool.execute(
                    `SELECT * FROM files WHERE id_post = ?`,
                    [post.id]
                );
                return { ...post, files };
            })
        );

        // return next({ status: HTTP_STATUS.OK, message: 'Newest posts retrieved successfully', data: posts }, req, res, next);
        res.status(HTTP_STATUS.OK).json({
            code: HTTP_STATUS.OK,
            totalDocs: posts.length,
            data: postsWithFiles,
            message: 'Newest posts retrieved successfully',
        });
    } catch (error) {
        return next(new AppError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'fail', error.message, []), req, res, next);
    }
};

exports.getPostSameType = async (req, res, next) => {
    const { type } = req.query;

    try {
        // Lấy danh sách bài đăng cùng loại
        const sql = `SELECT * FROM posts WHERE type = ? ORDER BY createdAt DESC`;
        const [posts] = await db.pool.execute(sql, [type]);

        const postsWithFiles = await Promise.all(
            posts.map(async (post) => {
                const [files] = await db.pool.execute(
                    `SELECT * FROM files WHERE id_post = ?`,
                    [post.id]
                );
                return { ...post, files };
            })
        );

        // return next({ status: HTTP_STATUS.OK, message: 'Posts of the same type retrieved successfully', data: posts }, req, res, next);
        res.status(HTTP_STATUS.OK).json({
            code: HTTP_STATUS.OK,
            totalDocs: posts.length,
            data: postsWithFiles,
            message: 'Posts of the same type retrieved successfully',
        });
    } catch (error) {
        return next(new AppError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'fail', error.message, []), req, res, next);
    }
};
