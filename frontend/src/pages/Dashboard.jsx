import { useState, useEffect } from 'react';
import { useToast } from '../hooks/useToast';
import analyticsService from '../services/analyticsService';
import reminderService from '../services/reminderService';
import { getErrorMessage, formatDate, formatRelativeTime } from '../utils/helpers';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './Dashboard.css';

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#6B7280'];

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [trends, setTrends] = useState([]);
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [statsRes, trendsRes, remindersRes] = await Promise.all([
                analyticsService.getDashboardStats(),
                analyticsService.getTrends(),
                reminderService.getReminders({ status: 'upcoming', limit: 5 })
            ]);

            setStats(statsRes.data);
            setTrends(trendsRes.data.trends || []);
            setReminders(remindersRes.data || []);
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading"><div className="spinner" style={{ width: '40px', height: '40px' }}></div></div>;
    }

    const statusData = stats?.byStatus ? Object.entries(stats.byStatus).map(([name, value]) => ({ name, value })) : [];

    return (
        <div className="dashboard">
            <div className="page-header">
                <h1>Dashboard</h1>
                <p>Overview of your job search progress</p>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid grid grid-cols-4">
                <div className="stat-card card">
                    <div className="stat-icon">💼</div>
                    <div className="stat-content">
                        <div className="stat-label">Total Applications</div>
                        <div className="stat-value">{stats?.total || 0}</div>
                    </div>
                </div>
                <div className="stat-card card">
                    <div className="stat-icon">📝</div>
                    <div className="stat-content">
                        <div className="stat-label">Active</div>
                        <div className="stat-value">{stats?.active || 0}</div>
                    </div>
                </div>
                <div className="stat-card card">
                    <div className="stat-icon">🎯</div>
                    <div className="stat-content">
                        <div className="stat-label">Interviews</div>
                        <div className="stat-value">{stats?.byStatus?.Interview || 0}</div>
                    </div>
                </div>
                <div className="stat-card card">
                    <div className="stat-icon">✨</div>
                    <div className="stat-content">
                        <div className="stat-label">Offers</div>
                        <div className="stat-value">{stats?.byStatus?.Offer || 0}</div>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="charts-grid grid grid-cols-2">
                <div className="card">
                    <h3>Application Trends</h3>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={trends}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#4F46E5" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card">
                    <h3>Status Distribution</h3>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Upcoming Reminders */}
            <div className="card">
                <div className="card-header">
                    <h3>Upcoming Reminders</h3>
                </div>
                {reminders.length > 0 ? (
                    <div className="reminders-list">
                        {reminders.map(reminder => (
                            <div key={reminder._id} className="reminder-item">
                                <div className="reminder-info">
                                    <div className="reminder-title">{reminder.title}</div>
                                    <div className="reminder-meta">
                                        {reminder.job && <span>{reminder.job.company} - {reminder.job.title}</span>}
                                        <span>{formatRelativeTime(reminder.reminderDate)}</span>
                                    </div>
                                </div>
                                <span className={`badge priority-${reminder.priority.toLowerCase()}`}>
                                    {reminder.priority}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <p>No upcoming reminders</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
