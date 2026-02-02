import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { useTheme } from '../hooks/useTheme';
import uploadService from '../services/uploadService';
import { THEMES } from '../utils/constants';
import { getErrorMessage, formatFileSize, formatDate } from '../utils/helpers';
import './Settings.css';

const Settings = () => {
    const { user, updateUserProfile, updateUserPreferences } = useAuth();
    const { theme, setTheme } = useTheme();
    const toast = useToast();

    const [activeTab, setActiveTab] = useState('profile');
    const [resumes, setResumes] = useState([]);
    const [uploading, setUploading] = useState(false);

    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        phone: user?.profile?.phone || '',
        location: user?.profile?.location || '',
        linkedIn: user?.profile?.linkedIn || '',
        portfolio: user?.profile?.portfolio || ''
    });

    const [preferences, setPreferences] = useState({
        emailNotifications: user?.preferences?.emailNotifications ?? true,
        reminderNotifications: user?.preferences?.reminderNotifications ?? true,
        theme: user?.preferences?.theme || 'system'
    });

    useEffect(() => {
        if (activeTab === 'resumes') {
            fetchResumes();
        }
    }, [activeTab]);

    const fetchResumes = async () => {
        try {
            const response = await uploadService.getResumes();
            setResumes(response.data || []);
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateUserProfile(profileData);
            toast.success('Profile updated successfully!');
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    const handlePreferencesSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateUserPreferences(preferences);
            setTheme(preferences.theme);
            toast.success('Preferences updated successfully!');
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size must be less than 5MB');
            return;
        }

        setUploading(true);
        try {
            await uploadService.uploadResume(file);
            toast.success('Resume uploaded successfully!');
            fetchResumes();
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    const handleDeleteResume = async (filename) => {
        if (window.confirm('Delete this resume?')) {
            try {
                await uploadService.deleteResume(filename);
                toast.success('Resume deleted!');
                fetchResumes();
            } catch (error) {
                toast.error(getErrorMessage(error));
            }
        }
    };

    const handleDownloadResume = async (filename) => {
        try {
            await uploadService.downloadResume(filename);
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    return (
        <div className="settings-page">
            <div className="page-header">
                <h1>Settings</h1>
                <p>Manage your account and preferences</p>
            </div>

            {/* Tabs */}
            <div className="settings-tabs">
                <button
                    className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
                    onClick={() => setActiveTab('profile')}
                >
                    Profile
                </button>
                <button
                    className={`tab ${activeTab === 'preferences' ? 'active' : ''}`}
                    onClick={() => setActiveTab('preferences')}
                >
                    Preferences
                </button>
                <button
                    className={`tab ${activeTab === 'resumes' ? 'active' : ''}`}
                    onClick={() => setActiveTab('resumes')}
                >
                    Resumes
                </button>
            </div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
                <div className="settings-content card">
                    <h2>Profile Information</h2>
                    <form onSubmit={handleProfileSubmit} className="settings-form">
                        <div className="form-group">
                            <label className="label">Full Name</label>
                            <input
                                type="text"
                                className="input"
                                value={profileData.name}
                                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label className="label">Email</label>
                            <input
                                type="email"
                                className="input"
                                value={user?.email}
                                disabled
                            />
                            <small className="form-hint">Email cannot be changed</small>
                        </div>
                        <div className="form-group">
                            <label className="label">Phone</label>
                            <input
                                type="tel"
                                className="input"
                                placeholder="+1 (555) 123-4567"
                                value={profileData.phone}
                                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label className="label">Location</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="New York, NY"
                                value={profileData.location}
                                onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label className="label">LinkedIn Profile</label>
                            <input
                                type="url"
                                className="input"
                                placeholder="https://linkedin.com/in/username"
                                value={profileData.linkedIn}
                                onChange={(e) => setProfileData({ ...profileData, linkedIn: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label className="label">Portfolio Website</label>
                            <input
                                type="url"
                                className="input"
                                placeholder="https://yourportfolio.com"
                                value={profileData.portfolio}
                                onChange={(e) => setProfileData({ ...profileData, portfolio: e.target.value })}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">
                            Save Changes
                        </button>
                    </form>
                </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
                <div className="settings-content card">
                    <h2>Preferences</h2>
                    <form onSubmit={handlePreferencesSubmit} className="settings-form">
                        <div className="form-group">
                            <label className="label">Theme</label>
                            <select
                                className="input"
                                value={preferences.theme}
                                onChange={(e) => setPreferences({ ...preferences, theme: e.target.value })}
                            >
                                {THEMES.map(t => (
                                    <option key={t.value} value={t.value}>{t.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={preferences.emailNotifications}
                                    onChange={(e) => setPreferences({ ...preferences, emailNotifications: e.target.checked })}
                                />
                                <span>Enable email notifications</span>
                            </label>
                            <small className="form-hint">Receive emails for important updates</small>
                        </div>
                        <div className="form-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={preferences.reminderNotifications}
                                    onChange={(e) => setPreferences({ ...preferences, reminderNotifications: e.target.checked })}
                                />
                                <span>Enable reminder notifications</span>
                            </label>
                            <small className="form-hint">Get notified about upcoming reminders</small>
                        </div>
                        <button type="submit" className="btn btn-primary">
                            Save Preferences
                        </button>
                    </form>
                </div>
            )}

            {/* Resumes Tab */}
            {activeTab === 'resumes' && (
                <div className="settings-content card">
                    <div className="resumes-header">
                        <h2>Resume Management</h2>
                        <label className="btn btn-primary">
                            {uploading ? <div className="spinner"></div> : '+ Upload Resume'}
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={handleFileUpload}
                                disabled={uploading}
                                style={{ display: 'none' }}
                            />
                        </label>
                    </div>
                    {resumes.length > 0 ? (
                        <div className="resumes-list">
                            {resumes.map(resume => (
                                <div key={resume.filename} className="resume-item">
                                    <div className="resume-info">
                                        <div className="resume-name">📄 {resume.originalName}</div>
                                        <div className="resume-meta">
                                            {formatFileSize(resume.size)} • Uploaded {formatDate(resume.uploadedAt)}
                                        </div>
                                    </div>
                                    <div className="resume-actions">
                                        <button
                                            className="btn btn-secondary btn-sm"
                                            onClick={() => handleDownloadResume(resume.filename)}
                                        >
                                            Download
                                        </button>
                                        <button
                                            className="btn-icon"
                                            onClick={() => handleDeleteResume(resume.filename)}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <p>No resumes uploaded yet</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Settings;
