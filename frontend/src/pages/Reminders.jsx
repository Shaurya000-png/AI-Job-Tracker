import { useState, useEffect } from 'react';
import { useToast } from '../hooks/useToast';
import reminderService from '../services/reminderService';
import jobService from '../services/jobService';
import { PRIORITIES } from '../utils/constants';
import { getErrorMessage, formatDate, formatRelativeTime, isOverdue } from '../utils/helpers';
import './Reminders.css';

const Reminders = () => {
    const [reminders, setReminders] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingReminder, setEditingReminder] = useState(null);
    const [filter, setFilter] = useState('all');
    const toast = useToast();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        reminderDate: '',
        priority: 'Medium',
        job: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [remindersRes, jobsRes] = await Promise.all([
                reminderService.getReminders(),
                jobService.getJobs({ isDeleted: false })
            ]);
            setReminders(remindersRes.data || []);
            // Handle paginated or nested response structure for jobs
            setJobs(jobsRes.data?.jobs || jobsRes.data || []);
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingReminder) {
                await reminderService.updateReminder(editingReminder._id, formData);
                toast.success('Reminder updated!');
            } else {
                await reminderService.createReminder(formData);
                toast.success('Reminder created!');
            }
            setShowModal(false);
            resetForm();
            fetchData();
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    const handleToggleComplete = async (id) => {
        try {
            await reminderService.toggleComplete(id);
            fetchData();
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this reminder?')) {
            try {
                await reminderService.deleteReminder(id);
                toast.success('Reminder deleted!');
                fetchData();
            } catch (error) {
                toast.error(getErrorMessage(error));
            }
        }
    };

    const handleEdit = (reminder) => {
        setEditingReminder(reminder);
        setFormData({
            title: reminder.title,
            description: reminder.description || '',
            reminderDate: reminder.reminderDate.split('T')[0] + 'T' + reminder.reminderDate.split('T')[1].substring(0, 5),
            priority: reminder.priority,
            job: reminder.job?._id || ''
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setEditingReminder(null);
        setFormData({
            title: '',
            description: '',
            reminderDate: '',
            priority: 'Medium',
            job: ''
        });
    };

    const filteredReminders = reminders.filter(r => {
        if (filter === 'completed') return r.isCompleted;
        if (filter === 'pending') return !r.isCompleted && !isOverdue(r.reminderDate);
        if (filter === 'overdue') return !r.isCompleted && isOverdue(r.reminderDate);
        return true;
    });

    if (loading) {
        return <div className="loading"><div className="spinner" style={{ width: '40px', height: '40px' }}></div></div>;
    }

    return (
        <div className="reminders-page">
            <div className="page-header">
                <div>
                    <h1>Reminders</h1>
                    <p>Stay on top of your job search tasks</p>
                </div>
                <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
                    + Add Reminder
                </button>
            </div>

            {/* Filter Tabs */}
            <div className="filter-tabs">
                <button
                    className={`tab ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    All
                </button>
                <button
                    className={`tab ${filter === 'pending' ? 'active' : ''}`}
                    onClick={() => setFilter('pending')}
                >
                    Pending
                </button>
                <button
                    className={`tab ${filter === 'overdue' ? 'active' : ''}`}
                    onClick={() => setFilter('overdue')}
                >
                    Overdue
                </button>
                <button
                    className={`tab ${filter === 'completed' ? 'active' : ''}`}
                    onClick={() => setFilter('completed')}
                >
                    Completed
                </button>
            </div>

            {/* Reminders List */}
            {filteredReminders.length > 0 ? (
                <div className="reminders-list">
                    {filteredReminders.map(reminder => (
                        <div key={reminder._id} className={`reminder-card card ${reminder.isCompleted ? 'completed' : ''} ${isOverdue(reminder.reminderDate) && !reminder.isCompleted ? 'overdue' : ''}`}>
                            <div className="reminder-main">
                                <input
                                    type="checkbox"
                                    checked={reminder.isCompleted}
                                    onChange={() => handleToggleComplete(reminder._id)}
                                    className="reminder-checkbox"
                                />
                                <div className="reminder-content">
                                    <h3>{reminder.title}</h3>
                                    {reminder.description && <p className="reminder-desc">{reminder.description}</p>}
                                    <div className="reminder-meta">
                                        {reminder.job && (
                                            <span className="reminder-job">
                                                {reminder.job.company} - {reminder.job.title}
                                            </span>
                                        )}
                                        <span className={isOverdue(reminder.reminderDate) && !reminder.isCompleted ? 'overdue-text' : ''}>
                                            {formatRelativeTime(reminder.reminderDate)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="reminder-actions">
                                <span className={`badge priority-${reminder.priority.toLowerCase()}`}>
                                    {reminder.priority}
                                </span>
                                <button className="btn-icon" onClick={() => handleEdit(reminder)}>✏️</button>
                                <button className="btn-icon" onClick={() => handleDelete(reminder._id)}>🗑️</button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state card">
                    <p>No reminders found</p>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content card" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingReminder ? 'Edit Reminder' : 'New Reminder'}</h2>
                            <button className="btn-icon" onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <form onSubmit={handleSubmit} className="reminder-form">
                            <div className="form-group">
                                <label className="label">Title *</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="label">Description</label>
                                <textarea
                                    className="input"
                                    rows="3"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="label">Date & Time *</label>
                                    <input
                                        type="datetime-local"
                                        className="input"
                                        value={formData.reminderDate}
                                        onChange={(e) => setFormData({ ...formData, reminderDate: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="label">Priority</label>
                                    <select
                                        className="input"
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                    >
                                        {PRIORITIES.map(p => (
                                            <option key={p} value={p}>{p}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="label">Link to Job (Optional)</label>
                                <select
                                    className="input"
                                    value={formData.job}
                                    onChange={(e) => setFormData({ ...formData, job: e.target.value })}
                                >
                                    <option value="">None</option>
                                    {jobs.map(job => (
                                        <option key={job._id} value={job._id}>
                                            {job.company} - {job.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingReminder ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reminders;
