import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Chatbot from './Chatbot';
import './DashboardLayout.css';
import axios from 'axios';

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);

  const menuItems = [
    { name: 'Overview', path: '/dashboard', icon: '📊', gradient: 'from-blue-500 to-cyan-500' },
    { name: 'Resume Analysis', path: '/dashboard/resume-analysis', icon: '📄', gradient: 'from-purple-500 to-pink-500' },
    { name: 'AI Resume Builder', path: '/dashboard/resume-builder', icon: '🤖', gradient: 'from-green-500 to-teal-500' },
    { name: 'Skill Tracker', path: '/dashboard/skill-tracker', icon: '📈', gradient: 'from-orange-500 to-red-500' },
    { name: 'Job Match', path: '/dashboard/job-match', icon: '🎯', gradient: 'from-indigo-500 to-purple-500' },
    { name: 'Portfolio', path: '/dashboard/portfolio', icon: '🌐', gradient: 'from-pink-500 to-rose-500' },
  ];

  useEffect(() => {
    fetchUserProfile();
    fetchNotifications();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    
    // Listen for profile updates from UserProfile component
    const handleProfileUpdate = (event) => {
      setUser(event.detail);
    };
    
    window.addEventListener('profileUpdated', handleProfileUpdate);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const [notifResponse, unreadResponse] = await Promise.all([
        axios.get('http://localhost:8000/notifications', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:8000/notifications/unread', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setNotifications(notifResponse.data);
      setUnreadCount(unreadResponse.data.unread_count);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8000/search?q=${encodeURIComponent(query)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  const markNotificationRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8000/notifications/${notificationId}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:8000/notifications/mark-all-read', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear any cached data
    sessionStorage.clear();
    
    // Navigate to login page
    navigate('/login');
    
    // Force page reload to clear all state
    window.location.href = '/login';
  };

  return (
    <div className="dashboard-container">
      {/* Animated Background */}
      <div className="dashboard-bg">
        <div className="bg-gradient"></div>
        <div className="bg-pattern"></div>
      </div>

      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        {/* Logo */}
        <div className="sidebar-header">
          <div className="logo-container">
            {isSidebarOpen && (
              <div className="logo-text">
                <span className="logo-icon">✨</span>
                <h1>SmartCV</h1>
              </div>
            )}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="sidebar-toggle"
            >
              {isSidebarOpen ? '◀' : '▶'}
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {isSidebarOpen && (
                <>
                  <span className="nav-text">{item.name}</span>
                  {location.pathname === item.path && (
                    <span className="nav-indicator"></span>
                  )}
                </>
              )}
            </button>
          ))}
        </nav>

        {/* User Profile */}
        {isSidebarOpen && (
          <div className="sidebar-profile" onClick={() => navigate('/dashboard/profile')} style={{ cursor: 'pointer' }}>
            <div className="profile-card">
              <div className="profile-avatar">
                {user?.profile_picture ? (
                  <img src={user.profile_picture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                ) : (
                  <span>👤</span>
                )}
              </div>
              <div className="profile-info">
                <p className="profile-name">{user?.full_name || 'User'}</p>
                <p className="profile-email">{user?.email || 'user@smartcv.com'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Logout */}
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <span className="logout-icon">🚪</span>
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Top Bar */}
        <header className="dashboard-header">
          <div className="header-content">
            <div className="header-title">
              <h2>{menuItems.find((item) => item.path === location.pathname)?.name || 'Dashboard'}</h2>
              <p className="header-subtitle">Manage your professional profile</p>
            </div>
            <div className="header-actions">
              <button 
                className="header-btn search-btn" 
                onClick={() => setShowSearch(!showSearch)}
                title="Search"
              >
                <span>🔍</span>
              </button>
              <button 
                className="header-btn notification-btn"
                onClick={() => setShowNotifications(!showNotifications)}
                title="Notifications"
              >
                <span className="notification-icon">🔔</span>
                {unreadCount > 0 && (
                  <span className="notification-badge">{unreadCount}</span>
                )}
              </button>
              <div className="user-menu" onClick={() => navigate('/dashboard/profile')} style={{ cursor: 'pointer' }} title="My Profile">
                <div className="user-avatar">
                  {user?.profile_picture ? (
                    <img src={user.profile_picture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                  ) : (
                    <span>👤</span>
                  )}
                </div>
                <span className="user-status"></span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="dashboard-content">
          {children}
        </div>
      </main>

      {/* Chatbot */}
      <Chatbot />

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="notifications-overlay" onClick={() => setShowNotifications(false)}>
          <div className="notifications-panel" onClick={(e) => e.stopPropagation()}>
            <div className="notifications-header">
              <h3>Notifications</h3>
              {unreadCount > 0 && (
                <button className="mark-all-read-btn" onClick={markAllRead}>
                  Mark all as read
                </button>
              )}
              <button className="close-btn" onClick={() => setShowNotifications(false)}>✕</button>
            </div>
            <div className="notifications-list">
              {notifications.length === 0 ? (
                <div className="no-notifications">
                  <span className="no-notif-icon">🔔</span>
                  <p>No notifications yet</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div 
                    key={notif._id} 
                    className={`notification-item ${notif.is_read ? 'read' : 'unread'}`}
                    onClick={() => !notif.is_read && markNotificationRead(notif._id)}
                  >
                    <div className={`notif-icon ${notif.type}`}>
                      {notif.type === 'success' ? '✅' : notif.type === 'warning' ? '⚠️' : notif.type === 'error' ? '❌' : 'ℹ️'}
                    </div>
                    <div className="notif-content">
                      <h4>{notif.title}</h4>
                      <p>{notif.message}</p>
                      <span className="notif-time">
                        {new Date(notif.created_at).toLocaleString()}
                      </span>
                    </div>
                    {!notif.is_read && <span className="unread-dot"></span>}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Search Modal */}
      {showSearch && (
        <div className="search-overlay" onClick={() => setShowSearch(false)}>
          <div className="search-modal" onClick={(e) => e.stopPropagation()}>
            <div className="search-header">
              <input
                type="text"
                placeholder="Search skills, jobs, projects..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleSearch(e.target.value);
                }}
                autoFocus
                className="search-input"
              />
              <button className="close-btn" onClick={() => setShowSearch(false)}>✕</button>
            </div>
            <div className="search-results">
              {searchResults ? (
                <>
                  {searchResults.skills.length === 0 && 
                   searchResults.job_analyses.length === 0 && 
                   searchResults.portfolio_projects.length === 0 ? (
                    <div className="no-results">
                      <span className="no-results-icon">🔍</span>
                      <p>No results found for "{searchQuery}"</p>
                    </div>
                  ) : (
                    <>
                      {searchResults.skills.length > 0 && (
                        <div className="search-section">
                          <h4>Skills</h4>
                          {searchResults.skills.map((skill) => (
                            <div 
                              key={skill.id} 
                              className="search-result-item"
                              onClick={() => {
                                navigate('/dashboard/skill-tracker');
                                setShowSearch(false);
                              }}
                            >
                              <span className="result-icon">📈</span>
                              <div className="result-content">
                                <h5>{skill.name}</h5>
                                <p>Progress: {skill.progress}%</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {searchResults.job_analyses.length > 0 && (
                        <div className="search-section">
                          <h4>Job Analyses</h4>
                          {searchResults.job_analyses.map((job) => (
                            <div 
                              key={job.id} 
                              className="search-result-item"
                              onClick={() => {
                                navigate('/dashboard/job-match');
                                setShowSearch(false);
                              }}
                            >
                              <span className="result-icon">🎯</span>
                              <div className="result-content">
                                <h5>Match Score: {job.score}%</h5>
                                <p>{job.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {searchResults.portfolio_projects.length > 0 && (
                        <div className="search-section">
                          <h4>Projects</h4>
                          {searchResults.portfolio_projects.map((project) => (
                            <div 
                              key={project.id} 
                              className="search-result-item"
                              onClick={() => {
                                navigate('/dashboard/portfolio');
                                setShowSearch(false);
                              }}
                            >
                              <span className="result-icon">🌐</span>
                              <div className="result-content">
                                <h5>{project.title}</h5>
                                <p>{project.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </>
              ) : (
                <div className="search-placeholder">
                  <span className="search-placeholder-icon">🔍</span>
                  <p>Start typing to search...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
