import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from './services/apiService';
import './ChangePassword.css';

function ChangePassword() {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
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
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
            setError('Vui lòng điền đầy đủ thông tin');
            return false;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError('Mật khẩu mới và xác nhận mật khẩu không khớp');
            return false;
        }

        if (formData.newPassword.length < 6) {
            setError('Mật khẩu mới phải có ít nhất 6 ký tự');
            return false;
        }

        if (formData.currentPassword === formData.newPassword) {
            setError('Mật khẩu mới phải khác mật khẩu hiện tại');
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
            // Gọi API để đổi mật khẩu
            const response = await ApiService.changePassword({
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            });
            
            if (response.message) {
                setSuccess('Đổi mật khẩu thành công! Bạn sẽ được đăng xuất trong 2 giây...');
                setFormData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
                
                // Đăng xuất và chuyển đến trang login sau 2 giây
                setTimeout(() => {
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                    navigate('/login');
                }, 2000);
            }
            
        } catch (error) {
            setError(error.message || 'Đổi mật khẩu thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="change-password-container">
            <div className="change-password-box">
                <div className="change-password-header">
                    <h2>Đổi mật khẩu</h2>
                    <p>Cập nhật mật khẩu để bảo mật tài khoản</p>
                </div>

                <form onSubmit={handleSubmit} className="change-password-form">
                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}
                    
                    <div className="form-group">
                        <label htmlFor="currentPassword">Mật khẩu hiện tại</label>
                        <input
                            type="password"
                            id="currentPassword"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            placeholder="Nhập mật khẩu hiện tại"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="newPassword">Mật khẩu mới</label>
                        <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            placeholder="Nhập mật khẩu mới"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Nhập lại mật khẩu mới"
                            required
                        />
                    </div>

                    <div className="password-requirements">
                        <h4>Yêu cầu mật khẩu:</h4>
                        <ul>
                            <li className={formData.newPassword.length >= 6 ? 'valid' : ''}>
                                Ít nhất 6 ký tự
                            </li>
                            <li className={formData.newPassword !== formData.currentPassword && formData.newPassword ? 'valid' : ''}>
                                Khác với mật khẩu hiện tại
                            </li>
                            <li className={formData.newPassword === formData.confirmPassword && formData.newPassword ? 'valid' : ''}>
                                Xác nhận mật khẩu khớp
                            </li>
                        </ul>
                    </div>

                    <div className="form-actions">
                        <button 
                            type="button" 
                            className="btn-secondary"
                            onClick={() => navigate('/')}
                        >
                            Hủy
                        </button>
                        <button 
                            type="submit" 
                            className="btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ChangePassword;
