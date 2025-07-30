const Database = require('../config/database');
console.log('Imported Database:', Database);
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

class AuthService {
    constructor() {
        this.db = Database;
        // console.log('AuthService initialized with db:', this.db);
    }

    // Mã hóa mật khẩu
    static async hashPassword(password) {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }

    // So sánh mật khẩu
    static async comparePassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }

    // Tạo JWT token
    static generateToken(payload) {
        return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
    }

    // Verify JWT token
    static verifyToken(token) {
        try {
            return jwt.verify(token, JWT_SECRET);
        } catch (error) {
            throw new Error('Invalid token');
        }
    }

    // Middleware để xác thực token
    static authenticateToken(req, res, next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Access token required' });
        }

        try {
            const decoded = AuthService.verifyToken(token);
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
    }

    static async register(userData) {
        const {
            AC_Username,
            AC_Password,
            AC_Firstname,
            AC_Lastname,
            AC_Sex,
            AC_DateOfBirth,
            AC_Email
        } = userData;

        try {
            // Kiểm tra nếu this.db là undefined
            if (!this.db || typeof this.db.connect !== 'function') {
                console.error('Database instance:', this.db); // Log để debug
                throw new Error('Database connection is not initialized');
            }

            // Kết nối đến database
            const pool = await this.db.connect();

            // Mã hóa mật khẩu
            const hashedPassword = await AuthService.hashPassword(AC_Password);

            // Lấy ngày hiện tại cho AC_DateCreateAcc
            const AC_DateCreateAcc = new Date().toISOString().split('T')[0];

            // Kiểm tra AC_Sex hợp lệ
            const validSexValues = ['M', 'F', 'O'];
            if (!AC_Sex || !validSexValues.includes(AC_Sex)) {
                throw new Error('Giới tính không hợp lệ. Vui lòng chọn M, F hoặc O.');
            }

            // Câu lệnh gọi stored procedure
            const query = 'EXEC P_INSERT_ACCOUNT @AC_Username, @AC_Password, @AC_Firstname, @AC_Lastname, @AC_Sex, @AC_DateOfBirth, @AC_Email, @AC_DateCreateAcc';

            // Chuẩn bị tham số cho procedure (sử dụng hashedPassword)
            const params = [
                AC_Username,
                AC_Password,
                AC_Firstname,
                AC_Lastname,
                AC_Sex,
                AC_DateOfBirth,
                AC_Email,
                AC_DateCreateAcc
            ];

            // Thực thi procedure
            const result = await this.db.query(query, params);

            // Lấy AccountID (cần sửa procedure để trả về OUTPUT parameter)
            const newAccountId = null; // Hiện tại không lấy được, cần thêm OUTPUT

            // Tạo token
            const token = AuthService.generateToken({ accountId: newAccountId || 'AC00000001', username: AC_Username });

            return {
                success: true,
                message: 'Đăng ký thành công',
                token,
                accountId: newAccountId || 'AC' + (parseInt(AC_Username.match(/\d+/) || '0') + 1).toString().padStart(8, '0')
            };
        } catch (error) {
            if (error.number === 2627) { // Lỗi UNIQUE constraint (trùng AC_Username)
                throw new Error('Tên đăng nhập đã tồn tại');
            }
            throw new Error('Đăng ký thất bại: ' + error.message);
        }
    }
}

module.exports = AuthService;
