import api from './api';

const authService = {
    // Register new user
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        if (response.data.success) {
            const { accessToken, refreshToken, user } = response.data.data;
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('user', JSON.stringify(user));
        }
        return response.data;
    },

    // Login user
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        if (response.data.success) {
            const { accessToken, refreshToken, user } = response.data.data;
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('user', JSON.stringify(user));
        }
        return response.data;
    },

    // Logout user
    logout: async () => {
        try {
            await api.post('/auth/logout');
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
        }
    },

    // Get current user profile
    getProfile: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    // Update user profile
    updateProfile: async (profileData) => {
        const response = await api.put('/auth/profile', profileData);
        return response.data;
    },

    // Update user preferences
    updatePreferences: async (preferences) => {
        const response = await api.put('/auth/preferences', preferences);
        return response.data;
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        return !!localStorage.getItem('accessToken');
    },

    // Get current user from localStorage
    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }
};

export default authService;
