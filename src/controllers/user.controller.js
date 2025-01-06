const db = require('../config/db.config');
const bcrypt = require('bcrypt');
const { HTTP_STATUS } = require('../constants/status-code');
const AppError  = require('../utils/app-error');

exports.savePost = async (req, res, next) => {
  const { userId, postId } = req.body;

  try {
    // Kiểm tra xem postId và userId có tồn tại không
    const [post] = await db.pool.execute(`SELECT id FROM posts WHERE id = ?`, [postId]);
    const [user] = await db.pool.execute(`SELECT id FROM users WHERE id = ?`, [userId]);

    if (post.length === 0 || user.length === 0) {
      return next(new AppError(HTTP_STATUS.NOT_FOUND, 'fail', 'Post or User not found', []), req, res, next);
    }

    // check xem post đã được lưu chưa
    const [savedPost] = await db.pool.execute(`SELECT * FROM saves_post WHERE id_user = ? AND id_post = ?`, [userId, postId]);
    if (savedPost.length > 0) { 
      // return next(new AppError(HTTP_STATUS.BAD_REQUEST, 'fail', 'Bạn đã lưu bài viết này', []), req, res, next);
      return res.status(HTTP_STATUS.OK).json({
        code: 200,
        message: 'Bạn đã lưu bài viết này',
        // data: []
      });
    }
    
    const createAt = new Date();

      // Lưu post vào danh sách đã lưu
      const sql = `INSERT INTO saves_post (id_user, id_post, createAt) VALUES (?, ?, ?)`;
      await db.pool.execute(sql, [userId, postId, createAt]);

    // return next({ status: HTTP_STATUS.OK, message: 'Post saved successfully', data: [] }, req, res, next);
    res.status(HTTP_STATUS.OK).json({
      message: 'Post saved successfully',
      data: []
    });
  } catch (error) {
      return next(new AppError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'fail', error.message, []), req, res, next);
  }
};

exports.getSavedPost = async (req, res, next) => { 
  const { userId } = req.params;
  try {
      // Lấy danh sách bài đăng đã lưu
      const [posts] = await db.pool.execute(`
          SELECT p.* FROM saves_post s
          JOIN posts p ON s.id_post = p.id
          WHERE s.id_user = ?
      `, [userId]);
    
      const postsWithFiles = await Promise.all(
        posts.map(async (post) => {
            const [files] = await db.pool.execute(
                `SELECT * FROM files WHERE id_post = ?`,
                [post.id]
            );
            return { ...post, files };
        })
    );

    // Trả về kết quả
    res.status(HTTP_STATUS.OK).json({
        code: HTTP_STATUS.OK,
        message: 'Posts retrieved successfully',
        totalDocs: postsWithFiles.length,
        data: postsWithFiles
    });
  } catch (error) {
    return next(new AppError(HTTP_STATUS.INTERNAL_SERVER_ERROR,'fail',error.message,[]), req,res, next);
  }
}

exports.getAllPostOfUser = async (req, res, next) => {
    const { userId } = req.params;

    try {
        // Lấy danh sách bài đăng của người dùng
        const [posts] = await db.pool.execute(
            `SELECT * FROM posts WHERE id_user_post = ?`,
            [userId]
        );

        if (!posts.length) {
            // Trả về nếu không có bài đăng nào
            return res.status(200).json({
                code: HTTP_STATUS.OK,
                message: 'No posts found for this user',
                data: []
            });
        }

        // Lấy thông tin files cho từng bài đăng
        const postsWithFiles = await Promise.all(
            posts.map(async (post) => {
                const [files] = await db.pool.execute(
                    `SELECT * FROM files WHERE id_post = ?`,
                    [post.id]
                );
                return { ...post, files };
            })
        );

        // Trả về kết quả
        res.status(HTTP_STATUS.OK).json({
            code: HTTP_STATUS.OK,
            message: 'Posts retrieved successfully',
            totalDocs: postsWithFiles.length,
            data: postsWithFiles
        });
    } catch (error) {
        // Xử lý lỗi
        return next(new AppError(HTTP_STATUS.INTERNAL_SERVER_ERROR,'fail',error.message,[]), req,res, next);
    }
};

// Cập nhật thông tin người dùng
exports.updateUser = async (req, res, next) => {
  const { id } = req.params; // Lấy id từ params
  const { name, phone, address, gender, bio, avatar, fbUrl, zalo } = req.body;

  try {
    const query = `
      UPDATE users 
      SET 
        name = ?, 
        phone = ?, 
        address = ?, 
        gender = ?, 
        bio = ?, 
        avatar = ?, 
        fbUrl = ?, 
        zalo = ?
      WHERE id = ?
    `;

    // Thực thi câu lệnh SQL
    const [result] = await db.pool.execute(query, [
      name, phone, address, gender, bio, avatar, fbUrl, zalo, id,
    ]);

    // Kiểm tra xem người dùng có tồn tại hay không
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Trả về thông báo thành công
    res.status(200).json({
      message: 'User updated successfully',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const sql = `DELETE FROM users WHERE id = ?`;
    await db.pool.execute(sql, [id]);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.unSavePost = async (req, res, next) => { 
  const { userId, postId } = req.body;

  try {
    const [post] = await db.pool.execute(`SELECT id FROM posts WHERE id = ?`, [postId]);
    const [user] = await db.pool.execute(`SELECT id FROM users WHERE id = ?`, [userId]);

    if (post.length === 0 || user.length === 0) {
      return next(new AppError(HTTP_STATUS.NOT_FOUND, 'fail', 'Post or User not found', []), req, res, next);
    }

    const [savedPost] = await db.pool.execute(`SELECT * FROM saves_post WHERE id_user = ? AND id_post = ?`, [userId, postId]);
    if (savedPost.length === 0) { 
      return next(new AppError(HTTP_STATUS.BAD_REQUEST, 'fail', 'Bạn chưa lưu bài viết này', []), req, res, next);
    }
    
    const sql = `DELETE FROM saves_post WHERE id_user = ? AND id_post = ?`;
    await db.pool.execute(sql, [userId, postId]);

    res.status(HTTP_STATUS.OK).json({
      message: 'Post unliked successfully',
      data: []
    });
  } catch (error) {
    return next(new AppError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'fail', error.message, []), req, res, next);
  }
}

exports.changePassword = async (req, res, next) => {
  const { phone, oldPassword, newPassword } = req.body;
  try {
    const [users] = await db.pool.execute(`SELECT * FROM users WHERE phone = ?`, [phone]);

    // Check if user exists
    if (users.length === 0) {
      return next(new AppError(HTTP_STATUS.NOT_FOUND, 'fail', 'User not found', []), req, res, next);
    }

    const user = users[0];
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

    // Check if old password matches
    if (!isPasswordMatch) {
      return next(new AppError(HTTP_STATUS.BAD_REQUEST, 'fail', 'Mật khẩu cũ không chính xác', []), req, res, next);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.pool.execute(`UPDATE users SET password = ? WHERE phone = ?`, [hashedPassword, phone]);

    res.status(HTTP_STATUS.OK).json({
      message: 'Password changed successfully',
    });
  } catch (error) {
    return next(new AppError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'fail', error.message, []), req, res, next);
  }
}

exports.getCodeAccount = async (req, res, next) => { 
  const { phone } = req.body;
  try {
    const [users] = await db.pool.execute(`SELECT * FROM users WHERE phone = ?`, [phone]);

    if (users.length === 0) {
      return next(new AppError(HTTP_STATUS.NOT_FOUND, 'fail', 'User not found', []), req, res, next);
    }

    // const randomCode = Math.floor(100000 + Math.random() * 9000);
    const randomCode = Math.floor(100000 + Math.random() * 900000);
    await db.pool.execute(`UPDATE users SET last_otp = ? WHERE phone = ?`, [randomCode, phone]);

    const message = `Mã xác thực của bạn là: ${randomCode}`;
    res.status(HTTP_STATUS.OK).json({
      code: randomCode,
      message: message
    });
  } catch (error) {
    return next(new AppError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'fail', error.message, []), req, res, next);
  }
}

exports.forgetPassword = async (req, res, next) => { 
  const { phone, code, newPassword } = req.body;
  try {
    const [users] = await db.pool.execute(`SELECT * FROM users WHERE phone = ?`, [phone]);

    if (users.length === 0) {
      return res.status(HTTP_STATUS.OK).json({
        code: 404,
        message: 'Khoong tìm thấy người dùng',
      });
    }

    const user = users[0];
    const codeInt = parseInt(code);
    if (user.last_otp !== codeInt) {
      return res.status(HTTP_STATUS.OK).json({
        code: 400,
        message: 'Mã xác thực không chính xác',
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.pool.execute(`UPDATE users SET password = ? WHERE phone = ?`, [hashedPassword, phone]);

    res.status(HTTP_STATUS.OK).json({
      code: 200,
      message: 'Thay đổi mật khẩu thành công',
    });
  } catch (error) {
    return next(new AppError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'fail', error.message, []), req, res, next);
  }
}