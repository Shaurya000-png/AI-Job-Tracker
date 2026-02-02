import api from './api';

const analyticsService = {
    // Get dashboard statistics
    getDashboardStats: async () => {
        const response = await api.get('/analytics/dashboard');
        return response.data;
    },

    // Get application trends
    getTrends: async (period = '30d') => {
        const response = await api.get(`/analytics/trends?period=${period}`);
        return response.data;
    },

    // Get upcoming follow-ups
    getUpcomingFollowUps: async () => {
        const response = await api.get('/analytics/follow-ups');
        return response.data;
    },

    // Get activity timeline
    getActivityTimeline: async (limit = 10) => {
        const response = await api.get(`/analytics/activity?limit=${limit}`);
        return response.data;
    }
};

export default analyticsService;
