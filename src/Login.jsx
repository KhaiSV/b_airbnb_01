import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ApiService from './services/apiService';
import './Login.css';

function Login() {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Gọi API backend để đăng nhập
            const response = await ApiService.login({
                username: formData.username,
                password: formData.password
            });

            if (response.token) {
                // Lưu token và thông tin user
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify({
                    ...response.user,
                    isLoggedIn: true
                }));
                
                // Chuyển hướng về trang chủ
                navigate('/');
                window.location.reload();
            }
            
        } catch (error) {
            setError(error.message || 'Đăng nhập thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-header">
                    <h2>Đăng nhập</h2>
                    <p>Chào mừng trở lại!</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    {error && <div className="error-message">{error}</div>}
                    
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

                    <button 
                        type="submit" 
                        className="login-btn"
                        disabled={loading}
                    >
                        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </button>
                </form>

                <div className="login-footer">
                    <p>
                        Chưa có tài khoản? 
                        <Link to="/register" className="register-link">
                            Đăng ký ngay
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
