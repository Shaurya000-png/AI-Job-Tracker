import { useState, useEffect } from 'react';
import { useToast } from '../hooks/useToast';
import jobService from '../services/jobService';
import { JOB_STATUSES, JOB_TYPES, LOCATION_TYPES, PRIORITIES, STATUS_COLORS } from '../utils/constants';
import { getErrorMessage, formatDate } from '../utils/helpers';
import './Jobs.css';

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingJob, setEditingJob] = useState(null);
    const [filters, setFilters] = useState({ status: '', jobType: '', search: '' });
    const toast = useToast();

    const [formData, setFormData] = useState({
        company: '',
        title: '',
        jobType: 'Full-Time',
        status: 'Applied',
        priority: 'Medium',
        location: 'Remote',
        applicationDate: new Date().toISOString().split('T')[0],
        jobLink: '',
        notes: ''
    });

    useEffect(() => {
        fetchJobs();
    }, [filters]);

    const fetchJobs = async () => {
        try {
            const response = await jobService.getJobs(filters);
            // Handle paginated or nested response structure
            setJobs(response.data?.jobs || response.data || []);
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingJob) {
                await jobService.updateJob(editingJob._id, formData);
                toast.success('Job updated successfully!');
            } else {
                await jobService.createJob(formData);
                toast.success('Job added successfully!');
            }
            setShowModal(false);
            resetForm();
            fetchJobs();
        } catch (error) {
            console.error('Job submission error:', error);
            const errorMessage = getErrorMessage(error);
            toast.error(errorMessage);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this job?')) {
            try {
                await jobService.deleteJob(id);
                toast.success('Job deleted successfully!');
                fetchJobs();
            } catch (error) {
                toast.error(getErrorMessage(error));
            }
        }
    };

    const handleEdit = (job) => {
        setEditingJob(job);
        setFormData({
            company: job.company,
            title: job.title,
            jobType: job.jobType,
            status: job.status,
            priority: job.priority,
            location: job.location,
            applicationDate: job.applicationDate.split('T')[0],
            jobLink: job.jobLink || '',
            notes: job.notes || ''
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setEditingJob(null);
        setFormData({
            company: '',
            title: '',
            jobType: 'Full-Time',
            status: 'Applied',
            priority: 'Medium',
            location: 'Remote',
            applicationDate: new Date().toISOString().split('T')[0],
            jobLink: '',
            notes: ''
        });
    };

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = !filters.search ||
            job.company.toLowerCase().includes(filters.search.toLowerCase()) ||
            job.title.toLowerCase().includes(filters.search.toLowerCase());
        const matchesStatus = !filters.status || job.status === filters.status;
        const matchesType = !filters.jobType || job.jobType === filters.jobType;
        return matchesSearch && matchesStatus && matchesType;
    });

    if (loading) {
        return <div className="loading"><div className="spinner" style={{ width: '40px', height: '40px' }}></div></div>;
    }

    return (
        <div className="jobs-page">
            <div className="page-header">
                <div>
                    <h1>Job Applications</h1>
                    <p>Track and manage your job applications</p>
                </div>
                <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
                    + Add Job
                </button>
            </div>

            {/* Filters */}
            <div className="filters card">
                <input
                    type="text"
                    className="input"
                    placeholder="Search by company or title..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
                <select
                    className="input"
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                    <option value="">All Statuses</option>
                    {JOB_STATUSES.map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
                <select
                    className="input"
                    value={filters.jobType}
                    onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
                >
                    <option value="">All Types</option>
                    {JOB_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
            </div>

            {/* Jobs List */}
            {filteredJobs.length > 0 ? (
                <div className="jobs-grid grid grid-cols-1">
                    {filteredJobs.map(job => (
                        <div key={job._id} className="job-card card">
                            <div className="job-header">
                                <div>
                                    <h3>{job.title}</h3>
                                    <p className="job-company">{job.company}</p>
                                </div>
                                <div className="job-actions">
                                    <button className="btn-icon" onClick={() => handleEdit(job)}>✏️</button>
                                    <button className="btn-icon" onClick={() => handleDelete(job._id)}>🗑️</button>
                                </div>
                            </div>
                            <div className="job-details">
                                <span className={`badge ${STATUS_COLORS[job.status]}`}>{job.status}</span>
                                <span className="job-meta">{job.jobType}</span>
                                <span className="job-meta">{job.location}</span>
                                <span className="job-meta">Applied: {formatDate(job.applicationDate)}</span>
                            </div>
                            {job.notes && <p className="job-notes">{job.notes}</p>}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state card">
                    <p>No jobs found. Add your first job application!</p>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content card" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingJob ? 'Edit Job' : 'Add New Job'}</h2>
                            <button className="btn-icon" onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <form onSubmit={handleSubmit} className="job-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="label">Company *</label>
                                    <input
                                        type="text"
                                        className="input"
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="label">Job Title *</label>
                                    <input
                                        type="text"
                                        className="input"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="label">Job Type</label>
                                    <select
                                        className="input"
                                        value={formData.jobType}
                                        onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                                    >
                                        {JOB_TYPES.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="label">Status</label>
                                    <select
                                        className="input"
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        {JOB_STATUSES.map(status => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="label">Location</label>
                                    <select
                                        className="input"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    >
                                        {LOCATION_TYPES.map(loc => (
                                            <option key={loc} value={loc}>{loc}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="label">Priority</label>
                                    <select
                                        className="input"
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                    >
                                        {PRIORITIES.map(priority => (
                                            <option key={priority} value={priority}>{priority}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="label">Application Date</label>
                                <input
                                    type="date"
                                    className="input"
                                    value={formData.applicationDate}
                                    onChange={(e) => setFormData({ ...formData, applicationDate: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="label">Job Link</label>
                                <input
                                    type="url"
                                    className="input"
                                    placeholder="https://..."
                                    value={formData.jobLink}
                                    onChange={(e) => setFormData({ ...formData, jobLink: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="label">Notes</label>
                                <textarea
                                    className="input"
                                    rows="3"
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                />
                            </div>
                            <div className="form-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingJob ? 'Update' : 'Add'} Job
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Jobs;
