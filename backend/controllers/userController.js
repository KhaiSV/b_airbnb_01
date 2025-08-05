// const database = require('../config/database');
const AuthService = require('../services/authService');

// Temporary in-memory user storage (chỉ để test) - SẼ KHÔNG DÙNG NỮA
// let users = [];

class UserController {
    // Đăng ký user mới
    static async register(req, res) {
        try {
            const { AC_Username, AC_Password, AC_Firstname, AC_Lastname, AC_DateOfBirth, AC_Sex, AC_Email } = req.body;

            // Validate input
            if (!AC_Username || !AC_Password || !AC_Firstname || !AC_Lastname || !AC_DateOfBirth || !AC_Sex || !AC_Email) {
                return res.status(400).json({ 
                    error: 'Vui lòng điền đầy đủ thông tin bắt buộc' 
                });
            }

            // Kiểm tra định dạng email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(AC_Email)) {
                return res.status(400).json({ 
                    error: 'Email không hợp lệ' 
                });
            }

            // Kiểm tra định dạng ngày sinh
            const dateObj = new Date(AC_DateOfBirth);
            if (isNaN(dateObj.getTime()) || dateObj > new Date()) {
                return res.status(400).json({ 
                    error: 'Ngày sinh không hợp lệ hoặc nằm trong tương lai' 
                });
            }

            // Kiểm tra AC_Sex hợp lệ
            const validSexValues = ['M', 'F', 'O'];
            if (!AC_Sex || !validSexValues.includes(AC_Sex)) {
                return res.status(400).json({ 
                    error: 'Giới tính không hợp lệ. Vui lòng chọn M, F hoặc O.' 
                });
            }

            // Chuẩn bị dữ liệu gửi vào AuthService
            const userData = {
                AC_Username,
                AC_Password,
                AC_Firstname,
                AC_Lastname,
                AC_Sex,
                AC_DateOfBirth,
                AC_Email
            };

            // Gọi AuthService để đăng ký
            const result = await AuthService.register(userData);

            res.status(201).json({
                message: result.message,
                token: result.token,
                accountId: result.accountId
            });

            } catch (error) {
                console.error('Register error:', error);
                if (error.message === 'Tên đăng nhập đã tồn tại') {
                    return res.status(409).json({ error: error.message });
                }
                // Kiểm tra lỗi cụ thể từ AuthService (VD: lỗi database)
                if (error.message.includes('Database connection is not initialized')) {
                    return res.status(500).json({ error: 'Lỗi kết nối database' });
                }
                res.status(500).json({ error: 'Lỗi server khi đăng ký' });
            }
    }

    // Đăng nhập
    static async login(req, res) {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({ 
                    error: 'Vui lòng nhập tên đăng nhập và mật khẩu' 
                });
            }

            // Gọi AuthService để đăng nhập
            const result = await AuthService.login(username, password);

            res.json({
                message: result.message,
                token: result.token,
                user: result.user
            });

        } catch (error) {
            console.error('Login error:', error);
            if (error.message === 'Tên đăng nhập hoặc mật khẩu không đúng') {
                return res.status(401).json({ error: error.message });
            }
            res.status(500).json({ error: 'Lỗi server khi đăng nhập' });
        }
    }

    // Lấy thông tin user hiện tại
    static async getProfile(req, res) {
        try {
            const { username } = req.user;
            const Database = require('../config/database');

            // Tìm user trong database
            const query = 'SELECT AccountID, AC_Username, AC_Firstname, AC_Lastname, AC_Email, AC_DateOfBirth FROM Account WHERE AC_Username = @param0';
            const result = await Database.query(query, [username]);

            if (result.recordset.length === 0) {
                return res.status(404).json({ error: 'User không tìm thấy' });
            }

            const user = result.recordset[0];

            res.json({
                user: {
                    id: user.AccountID,
                    username: user.AC_Username,
                    firstName: user.AC_Firstname,
                    lastName: user.AC_Lastname,
                    email: user.AC_Email,
                    dateOfBirth: user.AC_DateOfBirth
                }
            });

        } catch (error) {
            console.error('Get profile error:', error);
            res.status(500).json({ error: 'Lỗi server khi lấy thông tin user' });
        }
    }

    // Đổi mật khẩu
    static async changePassword(req, res) {
        try {
            const { currentPassword, newPassword } = req.body;
            const { username } = req.user;
            const Database = require('../config/database');

            if (!currentPassword || !newPassword) {
                return res.status(400).json({ 
                    error: 'Vui lòng nhập đầy đủ thông tin' 
                });
            }

            if (newPassword.length < 6) {
                return res.status(400).json({ 
                    error: 'Mật khẩu mới phải có ít nhất 6 ký tự' 
                });
            }

            // Tìm user trong database
            const getUserQuery = 'SELECT AC_Password FROM Account WHERE AC_Username = @param0';
            const userResult = await Database.query(getUserQuery, [username]);

            if (userResult.recordset.length === 0) {
                return res.status(404).json({ error: 'User không tìm thấy' });
            }

            const user = userResult.recordset[0];

            // Kiểm tra mật khẩu hiện tại
            const isValidPassword = await AuthService.comparePassword(
                currentPassword, 
                user.AC_Password
            );

            if (!isValidPassword) {
                return res.status(401).json({ 
                    error: 'Mật khẩu hiện tại không đúng' 
                });
            }

            // Mã hóa mật khẩu mới
            const hashedNewPassword = await AuthService.hashPassword(newPassword);

            // Cập nhật mật khẩu trong database
            const updateQuery = 'UPDATE Account SET AC_Password = @param0 WHERE AC_Username = @param1';
            await Database.query(updateQuery, [hashedNewPassword, username]);

            res.json({
                message: 'Đổi mật khẩu thành công'
            });

        } catch (error) {
            console.error('Change password error:', error);
            res.status(500).json({ error: 'Lỗi server khi đổi mật khẩu' });
        }
    }
}

module.exports = UserController;
