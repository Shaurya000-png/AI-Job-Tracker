// Job status options
export const JOB_STATUSES = [
    'Applied',
    'OA',
    'Interview',
    'Offer',
    'Rejected',
    'Withdrawn'
];

// Job types
export const JOB_TYPES = [
    'Internship',
    'Full-Time',
    'Contract',
    'Part-Time'
];

// Location types
export const LOCATION_TYPES = [
    'Remote',
    'On-site',
    'Hybrid'
];

// Priority levels
export const PRIORITIES = [
    'Low',
    'Medium',
    'High'
];

// Theme options
export const THEMES = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System' }
];

// Status colors for UI
export const STATUS_COLORS = {
    Applied: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    OA: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    Interview: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    Offer: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    Rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    Withdrawn: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
};

// Priority colors
export const PRIORITY_COLORS = {
    Low: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    High: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
};

// Date filter options
export const DATE_FILTERS = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: 'all', label: 'All time' }
];
