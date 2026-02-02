import api from './api';

const reminderService = {
    // Get all reminders with optional filters
    getReminders: async (filters = {}) => {
        const params = new URLSearchParams();
        Object.keys(filters).forEach(key => {
            if (filters[key]) params.append(key, filters[key]);
        });
        const response = await api.get(`/reminders?${params.toString()}`);
        return response.data;
    },

    // Get reminder statistics
    getStats: async () => {
        const response = await api.get('/reminders/stats');
        return response.data;
    },

    // Get single reminder by ID
    getReminderById: async (id) => {
        const response = await api.get(`/reminders/${id}`);
        return response.data;
    },

    // Create new reminder
    createReminder: async (reminderData) => {
        const response = await api.post('/reminders', reminderData);
        return response.data;
    },

    // Update reminder
    updateReminder: async (id, reminderData) => {
        const response = await api.put(`/reminders/${id}`, reminderData);
        return response.data;
    },

    // Delete reminder
    deleteReminder: async (id) => {
        const response = await api.delete(`/reminders/${id}`);
        return response.data;
    },

    // Toggle reminder completion
    toggleComplete: async (id) => {
        const response = await api.patch(`/reminders/${id}/complete`);
        return response.data;
    }
};

export default reminderService;
