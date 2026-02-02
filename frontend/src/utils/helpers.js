import { format, formatDistance, formatRelative, isValid, parseISO } from 'date-fns';

// Format date to readable string
export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
    if (!date) return '';
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return isValid(parsedDate) ? format(parsedDate, formatStr) : '';
};

// Format date to relative time (e.g., "2 hours ago")
export const formatRelativeTime = (date) => {
    if (!date) return '';
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return isValid(parsedDate) ? formatDistance(parsedDate, new Date(), { addSuffix: true }) : '';
};

// Format date relative to now (e.g., "tomorrow at 3:00 PM")
export const formatRelativeDate = (date) => {
    if (!date) return '';
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return isValid(parsedDate) ? formatRelative(parsedDate, new Date()) : '';
};

// Validate email
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Validate URL
export const isValidUrl = (url) => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

// Truncate text
export const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

// Format file size
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// Get initials from name
export const getInitials = (name) => {
    if (!name) return '';
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
};

// Handle API errors
export const getErrorMessage = (error) => {
    if (error.response?.data?.message) {
        return error.response.data.message;
    }
    if (error.response?.data?.error) {
        return error.response.data.error;
    }
    if (error.response?.data?.errors) {
        return error.response.data.errors.map(e => e.message).join(', ');
    }
    if (error.message) {
        return error.message;
    }
    return 'An unexpected error occurred';
};

// Debounce function
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Check if date is overdue
export const isOverdue = (date) => {
    if (!date) return false;
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return isValid(parsedDate) && parsedDate < new Date();
};
