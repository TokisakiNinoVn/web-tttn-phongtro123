const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');  // Import jsonwebtoken
const { HTTP_STATUS } = require('../constants/status-code.js');
const AppError = require('../utils/app-error.js');
const db = require('../config/db.config');

exports.login = async (req, res, next) => {
  const { phone, password } = req.body;

  try {
    // Query the database for the user
    const [rows] = await db.pool.execute(
      'SELECT * FROM users WHERE phone = ?',
      [phone]
    );

    if (rows.length === 0) {
      return next(new AppError(HTTP_STATUS.NOT_FOUND, 'failed', 'Không tìm thấy người dùng', []), req, res, next);
    }

    const user = rows[0];

    // Compare password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Mật khẩu không chính xác' });
    }

    // Create a JWT token
    const token = jwt.sign(
      { id: user.id, phone: user.phone },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1h' }
    );

    // Optionally store user session (if required)
    req.session.user = {
      id: user.id,
    };

    // Return response with token
    res.status(200).json({
      status: 'success',
      data: {
        id: user.id,
        name: user.name,
        zalo: user.zalo,
        phone: user.phone,
        address: user.address,
        fbUrl: user.fbUrl,
        avatar: user.avatar,
        updatedAt: user.updatedAt,
      },
      message: 'Đăng nhập thành công',
      token: token,
    });
  } catch (error) {
    console.error('Error in login function:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.register = async (req, res, next) => {
  const { name, phone, password } = req.body;
  console.log(">> Req: ", req.body);
  try {
    const [phoneCheck] = await db.pool.execute('SELECT * FROM users WHERE phone = ?', [phone]);
    if (phoneCheck.length > 0) {
      return next(new AppError(HTTP_STATUS.BAD_REQUEST, 'failed', 'Số điện thoại đã được đăng ký', []), req, res, next);
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const createdAt = new Date();

    await db.pool.execute('INSERT INTO users (name, phone, password, createdAt) VALUES (?, ?, ?, ?)', [name, phone,  hashedPassword, createdAt]);

    const user = { phone, createdAt };

    res.status(201).json({
      code: 201,
      status: 'success',
      data: user,
      message: 'Đăng ký thành công',
    });

  } catch (error) {
    console.error('Error in register function:', error);
    res.status(500).json({ error: error.message });
    next(error);
  }
}

exports.logout = async (req, res, next) => { 
  try {
    if (req.session.user) {
      await db.pool.execute(
        'UPDATE users SET status = ? WHERE id = ?',
        ['offline', req.session.user.id]
      );
      req.session.destroy();
      res.status(200).json({ message: 'Đăng xuất thành công' });
    } else {
      res.status(200).json({ message: 'Bạn chưa đăng nhập' });
    }
  } catch (error) {
    console.error('Error in logout function:', error);
    res.status(500).json({ error: error.message });
  }
}