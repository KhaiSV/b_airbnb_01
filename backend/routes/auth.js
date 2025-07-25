const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const AuthService = require('../services/authService');

// Routes cho đăng ký/đăng nhập thông thường
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/profile', AuthService.authenticateToken, UserController.getProfile);
router.post('/change-password', AuthService.authenticateToken, UserController.changePassword);

// Logout
router.post('/logout', (req, res) => {
    res.json({ message: 'Đăng xuất thành công' });
});

module.exports = router;
