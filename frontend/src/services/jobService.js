import api from './api';

const jobService = {
    // Get all jobs with optional filters
    getJobs: async (filters = {}) => {
        const params = new URLSearchParams();
        Object.keys(filters).forEach(key => {
            if (filters[key]) params.append(key, filters[key]);
        });
        const response = await api.get(`/jobs?${params.toString()}`);
        return response.data;
    },

    // Get single job by ID
    getJobById: async (id) => {
        const response = await api.get(`/jobs/${id}`);
        return response.data;
    },

    // Create new job
    createJob: async (jobData) => {
        const response = await api.post('/jobs', jobData);
        return response.data;
    },

    // Update job
    updateJob: async (id, jobData) => {
        const response = await api.put(`/jobs/${id}`, jobData);
        return response.data;
    },

    // Delete job (soft delete)
    deleteJob: async (id) => {
        const response = await api.delete(`/jobs/${id}`);
        return response.data;
    },

    // Restore deleted job
    restoreJob: async (id) => {
        const response = await api.post(`/jobs/${id}/restore`);
        return response.data;
    },

    // Permanently delete job
    permanentlyDeleteJob: async (id) => {
        const response = await api.delete(`/jobs/${id}/permanent`);
        return response.data;
    },

    // Bulk update job statuses
    bulkUpdateStatus: async (jobIds, status) => {
        const response = await api.post('/jobs/bulk-update', { jobIds, status });
        return response.data;
    }
};

export default jobService;
