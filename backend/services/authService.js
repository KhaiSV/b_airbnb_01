const Database = require('../config/database');
console.log('Imported Database:', Database);
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

class AuthService {
    constructor() {
        this.db = Database;
        console.log('AuthService initialized with db:', this.db);
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
            // Mã hóa mật khẩu
            const hashedPassword = await AuthService.hashPassword(AC_Password);

            // Kiểm tra AC_Sex hợp lệ
            const validSexValues = ['M', 'F', 'O'];
            if (!AC_Sex || !validSexValues.includes(AC_Sex)) {
                throw new Error('Giới tính không hợp lệ. Vui lòng chọn M, F hoặc O.');
            }

            // Kiểm tra username đã tồn tại chưa
            const checkQuery = 'SELECT AC_Username FROM Account WHERE AC_Username = @param0';
            const checkResult = await Database.query(checkQuery, [AC_Username]);
            
            if (checkResult.recordset.length > 0) {
                throw new Error('Tên đăng nhập đã tồn tại');
            }

            // Tạo AccountID mới
            const lastIdQuery = 'SELECT TOP 1 AccountID FROM Account ORDER BY AccountID DESC';
            const lastIdResult = await Database.query(lastIdQuery, []);
            
            let newAccountId;
            if (lastIdResult.recordset.length > 0) {
                const lastId = lastIdResult.recordset[0].AccountID;
                const numPart = parseInt(lastId.substring(2)) + 1;
                newAccountId = 'AC' + numPart.toString().padStart(8, '0');
            } else {
                newAccountId = 'AC00000001';
            }

            // Insert vào database
            const insertQuery = `
                INSERT INTO Account (AccountID, AC_Username, AC_Password, AC_Firstname, AC_Lastname, AC_Sex, AC_DateOfBirth, AC_Email, AC_DateCreateAcc)
                VALUES (@param0, @param1, @param2, @param3, @param4, @param5, @param6, @param7, GETDATE())
            `;
            
            await Database.query(insertQuery, [
                newAccountId,
                AC_Username,
                hashedPassword,
                AC_Firstname,
                AC_Lastname,
                AC_Sex,
                AC_DateOfBirth,
                AC_Email
            ]);

            // Tạo token
            const token = AuthService.generateToken({ 
                accountId: newAccountId, 
                username: AC_Username,
                firstName: AC_Firstname,
                lastName: AC_Lastname,
                email: AC_Email
            });

            return {
                success: true,
                message: 'Đăng ký thành công',
                token,
                accountId: newAccountId
            };
        } catch (error) {
            console.error('Register error:', error);
            if (error.message === 'Tên đăng nhập đã tồn tại') {
                throw error;
            }
            if (error.number === 2627) { // Lỗi UNIQUE constraint
                throw new Error('Tên đăng nhập đã tồn tại');
            }
            throw new Error('Đăng ký thất bại: ' + error.message);
        }
    }

    static async login(username, password) {
        try {
            // Tìm user trong database
            const query = 'SELECT AccountID, AC_Username, AC_Password, AC_Firstname, AC_Lastname, AC_Email FROM Account WHERE AC_Username = @param0';
            const result = await Database.query(query, [username]);
            
            if (result.recordset.length === 0) {
                throw new Error('Tên đăng nhập hoặc mật khẩu không đúng');
            }
            
            const user = result.recordset[0];
            
            // Kiểm tra mật khẩu
            const isValidPassword = await AuthService.comparePassword(password, user.AC_Password);
            
            if (!isValidPassword) {
                throw new Error('Tên đăng nhập hoặc mật khẩu không đúng');
            }
            
            // Tạo token
            const token = AuthService.generateToken({
                accountId: user.AccountID,
                username: user.AC_Username,
                firstName: user.AC_Firstname,
                lastName: user.AC_Lastname,
                email: user.AC_Email
            });
            
            return {
                success: true,
                message: 'Đăng nhập thành công',
                token,
                user: {
                    id: user.AccountID,
                    username: user.AC_Username,
                    firstName: user.AC_Firstname,
                    lastName: user.AC_Lastname,
                    email: user.AC_Email
                }
            };
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }
}

module.exports = AuthService;
