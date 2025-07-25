const API_BASE_URL = 'http://localhost:3001';

class ApiService {
    // Helper method để thực hiện API calls
    static async makeRequest(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const token = localStorage.getItem('token');
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
                ...options.headers
            },
            ...options
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'API request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Đăng ký
    static async register(userData) {
        return await this.makeRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    // Đăng nhập
    static async login(credentials) {
        return await this.makeRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
    }

    // Lấy thông tin profile
    static async getProfile() {
        return await this.makeRequest('/auth/profile');
    }

    // Đổi mật khẩu
    static async changePassword(passwordData) {
        return await this.makeRequest('/auth/change-password', {
            method: 'POST',
            body: JSON.stringify(passwordData)
        });
    }

    // Đăng xuất
    static async logout() {
        return await this.makeRequest('/auth/logout', {
            method: 'POST'
        });
    }
}

export default ApiService;
