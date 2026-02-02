import api from './api';

const uploadService = {
    // Upload resume file
    uploadResume: async (file) => {
        const formData = new FormData();
        formData.append('resume', file);

        const response = await api.post('/upload/resume', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    // Get list of uploaded resumes
    getResumes: async () => {
        const response = await api.get('/upload/resumes');
        return response.data;
    },

    // Download resume
    downloadResume: async (filename) => {
        const response = await api.get(`/upload/resume/${filename}`, {
            responseType: 'blob'
        });

        // Create download link
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    },

    // Delete resume
    deleteResume: async (filename) => {
        const response = await api.delete(`/upload/resume/${filename}`);
        return response.data;
    }
};

export default uploadService;
