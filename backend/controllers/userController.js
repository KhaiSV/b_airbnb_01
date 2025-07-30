// const database = require('../config/database');
const AuthService = require('../services/authService');

// Temporary in-memory user storage (chỉ để test)
let users = [];

class UserController {
    // Đăng ký user mới
    static async register(req, res) {
        try {
            const { AC_Username, AC_Email, AC_Firstname, AC_Lastname, AC_Password, AC_DateOfBirth, AC_Sex } = req.body;

            // Validate input
            if (!AC_Username || !AC_Email || !AC_Firstname || !AC_Lastname || !AC_Password || !AC_DateOfBirth) {
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

            // Tìm user trong memory (tạm thời)
            const user = users.find(u => u.username === username);

            if (!user) {
                return res.status(401).json({ 
                    error: 'Tên đăng nhập hoặc mật khẩu không đúng' 
                });
            }

            // Kiểm tra mật khẩu
            const isValidPassword = await AuthService.comparePassword(
                password, 
                user.password
            );

            if (!isValidPassword) {
                return res.status(401).json({ 
                    error: 'Tên đăng nhập hoặc mật khẩu không đúng' 
                });
            }

            // Tạo token
            const token = AuthService.generateToken({
                id: user.id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            });

            res.json({
                message: 'Đăng nhập thành công',
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName
                }
            });

        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ error: 'Lỗi server khi đăng nhập' });
        }
    }

    // Lấy thông tin user hiện tại
    static async getProfile(req, res) {
        try {
            const { username } = req.user;

            // Tìm user trong memory (tạm thời)
            const user = users.find(u => u.username === username);

            if (!user) {
                return res.status(404).json({ error: 'User không tìm thấy' });
            }

            res.json({
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    dateOfBirth: user.dateOfBirth
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

            // Tìm user trong memory
            const user = users.find(u => u.username === username);

            if (!user) {
                return res.status(404).json({ error: 'User không tìm thấy' });
            }

            // Kiểm tra mật khẩu hiện tại
            const isValidPassword = await AuthService.comparePassword(
                currentPassword, 
                user.password
            );

            if (!isValidPassword) {
                return res.status(401).json({ 
                    error: 'Mật khẩu hiện tại không đúng' 
                });
            }

            // Mã hóa mật khẩu mới
            const hashedNewPassword = await AuthService.hashPassword(newPassword);

            // Cập nhật mật khẩu trong memory
            user.password = hashedNewPassword;

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
