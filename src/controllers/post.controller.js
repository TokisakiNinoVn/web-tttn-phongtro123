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
    const { 
        postId, 
        title, 
        type, 
        address, 
        price, 
        acreage, 
        realaddress, 
        owner, 
        phoneOwner, 
        description, 
        amenities
    } = req.body;
    const filesNormal = req.body.files.files;
    const files3d = req.body.files.files3d;
    try {
        const updatePostQuery = `
            UPDATE posts
            SET title = ?, type = ?, address = ?, price = ?, acreage = ?, realaddress = ?, owner = ?, phone_owner = ?, description = ?, updatedAt = NOW()
            WHERE id = ?
        `;
        await db.pool.execute(updatePostQuery, [
            title, type, address, price, acreage, realaddress, owner, phoneOwner, description, postId
        ]);
        const checkAmenitiesQuery = `SELECT COUNT(*) AS count FROM amenities WHERE id_post = ?`;
        const [rows] = await db.pool.execute(checkAmenitiesQuery, [postId]);
        if (rows[0].count === 0) {
            const insertAmenitiesQuery = `
                INSERT INTO amenities (id_post, fully_furnished, garret, washing_machine, free_time, fridge, protect, kitchen_shelf, elevator, common_owner, air_conditioner, parking)
                VALUES (?, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
            `;
            await db.pool.execute(insertAmenitiesQuery, [postId]);
        }

        const updateAmenitiesQuery = `
            UPDATE amenities
            SET fully_furnished = ?, garret = ?, washing_machine = ?, free_time = ?, fridge = ?, protect = ?, 
                kitchen_shelf = ?, elevator = ?, common_owner = ?, air_conditioner = ?, parking = ?
            WHERE id_post = ?
        `;
        await db.pool.execute(updateAmenitiesQuery, [...amenities, postId]);

        const deleteFilesQuery = `DELETE FROM files WHERE id_post = ?`;
        const result = await db.pool.execute(deleteFilesQuery, [postId]);
        if (result[0].affectedRows > 0) {
            console.log('Complete Deleted files');
            const fileInsertQuery = `
                INSERT INTO files (id_post, url, type, status)
                VALUES (?, ?, ?, ?)
            `;
            if (Array.isArray(filesNormal)) {
                for (const file of filesNormal) {
                    if (file.url && file.type) {
                        const result = await db.pool.execute(fileInsertQuery, [postId, file.url, file.type, 1]);
                        console.log("file", result);
                    }
                }
            }

            if (Array.isArray(files3d)) {
                for (const file of files3d) {
                    if (file.url) {
                        const result = await db.pool.execute(fileInsertQuery, [postId, file.url, 3, 1]);
                        console.log("3d",result);
                    }
                }
            }
                
        } else {
            console.log('Not Deleted files');
            return next(new AppError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'fail', 'Can Not Deleted files', []), req, res, next);
        }

        res.status(200).json({
            code: 200,
            status: 'success',
            message: 'Post and files updated successfully',
        });
    } catch (error) {
        console.error('Error updating post:', error);
        return res.status(500).json({
            status: 'fail',
            message: error.message
        });
    }
};

exports.delete = async (req, res, next) => {
    const { id } = req.params;
    try {
        await db.pool.execute(`DELETE FROM amenities WHERE id_post = ?`, [id]);

        const [files] = await db.pool.execute(`SELECT url FROM files WHERE id_post = ?`, [id]);

        await db.pool.execute(`DELETE FROM files WHERE id_post = ?`, [id]);

        files.forEach(file => {
            const filePath = path.join(__dirname, '..', 'public', file.url);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        });

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
            SELECT id, phone, name, zalo, fbUrl, avatar, verify, bio, status, createdAt
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
        if (!posts.length) {
            return next(new AppError(HTTP_STATUS.OK, 'fail', 'No posts found', []), req, res, next);
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
    const { type, address, price, acreage } = req.body;
    console.log(req.body);
    try {
        // Điều kiện lọc cơ bản
        const filterType = type && type.trim() ? `%${type.trim()}%` : '%';
        const filterAddress = address && address.trim() ? `%${address.trim()}%` : '%';

        // Điều kiện lọc theo giá
        const priceConditions = {
            0: 'price > 0',
            1: 'price <= 1000000',
            2: 'price > 1000000 AND price <= 2000000',
            3: 'price > 2000000 AND price <= 3000000',
            4: 'price > 3000000 AND price <= 4000000',
            5: 'price > 4000000 AND price <= 5000000',
            6: 'price > 5000000',
        };
        const conditionPrice = price && !isNaN(price) && priceConditions[price] 
            ? priceConditions[price] 
            : 'price > 0';

        // Điều kiện lọc theo diện tích
        const acreageConditions = {
            0: 'acreage > 0',
            1: 'acreage < 20',
            2: 'acreage >= 20 AND acreage < 30',
            3: 'acreage >= 30 AND acreage < 40',
            4: 'acreage >= 40 AND acreage < 50',
            5: 'acreage >= 50 AND acreage < 60',
        };
        const conditionAcreage = acreage && !isNaN(acreage) && acreageConditions[acreage] 
            ? acreageConditions[acreage] 
            : 'acreage > 0';

        // Xây dựng câu truy vấn
        const query = `
            SELECT * FROM posts
            WHERE type LIKE ? AND address LIKE ? AND ${conditionPrice} AND ${conditionAcreage}
        `;
        const params = [filterType, filterAddress];

        // Thực thi truy vấn
        const [posts] = await db.pool.execute(query, params);

        // Lấy danh sách file liên quan
        const postsWithFiles = await Promise.all(
            posts.map(async (post) => {
                const [files] = await db.pool.execute(
                    `SELECT * FROM files WHERE id_post = ?`,
                    [post.id]
                );
                return { ...post, files };
            })
        );

        // Phản hồi kết quả
        res.status(HTTP_STATUS.OK).json({
            code: HTTP_STATUS.OK,
            totalDocs: postsWithFiles.length,
            data: postsWithFiles,
            message: 'Posts filtered successfully',
        });
    } catch (error) {
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
    const { type } = req.body;
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

exports.getRandomPost = async (req, res, next) => { 
    try {
        // Lấy 10 bài đăng ngẫu nhiên
        const sql = `SELECT * FROM posts ORDER BY RAND() LIMIT 10`;
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

        res.status(HTTP_STATUS.OK).json({
            code: HTTP_STATUS.OK,
            totalDocs: posts.length,
            data: postsWithFiles,
            message: 'Random posts retrieved successfully',
        });
    } catch (error) {
        return next(new AppError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'fail', error.message, []), req, res, next);
    }
}


//Get all post of user
exports.getAllPostOfUser = async (req, res, next) => {
    const { id } = req.params;
    try {
        // Lấy danh sách bài đăng của user
        const sql = `SELECT * FROM posts WHERE id_user_post = ? ORDER BY createdAt DESC`;
        const [posts] = await db.pool.execute(sql, [id]);

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
            totalDocs: posts.length,
            data: postsWithFiles,
            message: 'Posts of the same type retrieved successfully',
        });
    } catch (error) {
        return next(new AppError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'fail', error.message, []), req, res, next);
    }
};