import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ApiService from './services/apiService';
import './Register.css';

function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        sex: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        if (!formData.username || !formData.email || !formData.firstName || 
            !formData.lastName || !formData.password || !formData.confirmPassword) {
            setError('Vui lòng điền đầy đủ thông tin');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return false;
        }

        if (formData.password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Email không hợp lệ');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (!validateForm()) {
            setLoading(false);
            return;
        }

        try {
            // Gọi API backend để đăng ký
            const response = await ApiService.register({
                username: formData.username,
                email: formData.email,
                firstName: formData.firstName,
                lastName: formData.lastName,
                password: formData.password,
                dateOfBirth: formData.dateOfBirth,
                sex: formData.sex
            });

            if (response.message) {
                // Hiển thị thông báo thành công
                setSuccess('Đăng ký thành công! Bạn sẽ được chuyển đến trang đăng nhập trong 2 giây...');
                
                // Chuyển hướng về trang đăng nhập sau 2 giây
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
            
        } catch (error) {
            console.error('Registration error:', error);
            setError(error.message || 'Đăng ký thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <div className="register-header">
                    <h2>Đăng ký</h2>
                    <p>Tạo tài khoản mới để bắt đầu</p>
                </div>

                <form onSubmit={handleSubmit} className="register-form">
                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}
                    
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="firstName">Họ</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="Nhập họ"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName">Tên</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Nhập tên"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="username">Tên đăng nhập</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Nhập tên đăng nhập"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Nhập email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="dateOfBirth">Ngày sinh</label>
                        <input
                            type="date"
                            id="dateOfBirth"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="sex">Giới tính</label>
                        <select
                            id="sex"
                            name="sex"
                            value={formData.sex}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        >
                            <option value="" disabled hidden>Chọn giới tính</option>
                            <option value="M">Nam</option>
                            <option value="F">Nữ</option>
                            <option value="O">Khác</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Mật khẩu</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Nhập mật khẩu"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Nhập lại mật khẩu"
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="register-btn"
                        disabled={loading}
                    >
                        {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                    </button>
                </form>

                <div className="register-footer">
                    <p>
                        Đã có tài khoản? 
                        <Link to="/login" className="login-link">
                            Đăng nhập ngay
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;
