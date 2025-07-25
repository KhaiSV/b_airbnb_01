import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from './services/apiService';
import './Profile.css';

function Profile() {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        dateOfBirth: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Kiểm tra đăng nhập
        const userData = localStorage.getItem('user');
        if (!userData) {
            navigate('/login');
            return;
        }

        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setFormData({
            username: parsedUser.username || '',
            email: parsedUser.email || '',
            firstName: parsedUser.firstName || '',
            lastName: parsedUser.lastName || '',
            dateOfBirth: parsedUser.dateOfBirth || ''
        });
    }, [navigate]);

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
        setSuccess('');

        try {
            // TODO: Gọi API để cập nhật thông tin user
            // const response = await ApiService.updateProfile(formData);
            
            // Tạm thời cập nhật localStorage
            const updatedUser = { ...user, ...formData };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            setSuccess('Cập nhật thông tin thành công!');
            
        } catch (error) {
            setError(error.message || 'Cập nhật thất bại');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-container">
            <div className="profile-box">
                <div className="profile-header">
                    <h2>Thông tin cá nhân</h2>
                    <p>Quản lý thông tin tài khoản của bạn</p>
                </div>

                <form onSubmit={handleSubmit} className="profile-form">
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
                            disabled
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

                    <div className="form-actions">
                        <button 
                            type="button" 
                            className="btn-secondary"
                            onClick={() => navigate('/')}
                        >
                            Quay lại
                        </button>
                        <button 
                            type="submit" 
                            className="btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Đang cập nhật...' : 'Cập nhật'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Profile;
