import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import './Layout.css';

const Layout = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();

    const handleLogout = async () => {
        await logout();
    };

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/jobs', label: 'Jobs', icon: '💼' },
        { path: '/reminders', label: 'Reminders', icon: '🔔' },
        { path: '/settings', label: 'Settings', icon: '⚙️' }
    ];

    return (
        <div className="layout">
            {/* Navbar */}
            <nav className="navbar">
                <div className="navbar-content">
                    <div className="navbar-brand">
                        <h2>📋 Job Tracker</h2>
                    </div>

                    <div className="navbar-actions">
                        <button onClick={toggleTheme} className="btn-icon" title="Toggle theme">
                            {theme === 'dark' ? '☀️' : '🌙'}
                        </button>
                        <div className="user-menu">
                            <span className="user-name">{user?.name}</span>
                            <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="layout-main">
                {/* Sidebar */}
                <aside className="sidebar">
                    <nav className="sidebar-nav">
                        {navItems.map(item => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
                            >
                                <span className="sidebar-icon">{item.icon}</span>
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
