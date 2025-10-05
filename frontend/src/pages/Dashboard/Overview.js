import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Overview() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('User');

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.clear();
    
    // Redirect to login
    window.location.href = '/login';
  };
  const [stats, setStats] = useState([
    { label: 'Resume Score', value: '0%', gradient: 'from-emerald-400 to-teal-500', icon: '📊', iconBg: 'bg-emerald-100' },
    { label: 'Skills Tracked', value: '0', gradient: 'from-blue-400 to-indigo-500', icon: '📈', iconBg: 'bg-blue-100' },
    { label: 'Job Matches', value: '0', gradient: 'from-purple-400 to-pink-500', icon: '🎯', iconBg: 'bg-purple-100' },
    { label: 'Profile Views', value: '0', gradient: 'from-amber-400 to-orange-500', icon: '👁️', iconBg: 'bg-amber-100' },
  ]);
  const [recentActivity, setRecentActivity] = useState([]);

  const quickActions = [
    { title: 'Upload Resume', desc: 'Get AI analysis', path: '/dashboard/resume-analysis', icon: '📄', gradient: 'from-blue-500 to-blue-600', hover: 'hover:from-blue-600 hover:to-blue-700' },
    { title: 'Build New CV', desc: 'AI-powered builder', path: '/dashboard/resume-builder', icon: '🤖', gradient: 'from-green-500 to-emerald-600', hover: 'hover:from-green-600 hover:to-emerald-700' },
    { title: 'Track Skills', desc: 'Add learning goals', path: '/dashboard/skill-tracker', icon: '📚', gradient: 'from-purple-500 to-indigo-600', hover: 'hover:from-purple-600 hover:to-indigo-700' },
    { title: 'Match Jobs', desc: 'Find perfect fit', path: '/dashboard/job-match', icon: '🔍', gradient: 'from-red-500 to-pink-600', hover: 'hover:from-red-600 hover:to-pink-700' },
  ];

  useEffect(() => {
    fetchDashboardData();

    // Listen for profile updates
    const handleProfileUpdate = (event) => {
      setUserName(event.detail.full_name || 'User');
    };

    // Listen for resume generation
    const handleResumeGenerated = () => {
      fetchDashboardData();
    };

    // Listen for skill updates
    const handleSkillUpdate = () => {
      fetchDashboardData();
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    window.addEventListener('resumeGenerated', handleResumeGenerated);
    window.addEventListener('skillUpdated', handleSkillUpdate);

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);

    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
      window.removeEventListener('resumeGenerated', handleResumeGenerated);
      window.removeEventListener('skillUpdated', handleSkillUpdate);
      clearInterval(interval);
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch user profile
      const userResponse = await axios.get('http://localhost:8000/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserName(userResponse.data.full_name || 'User');

      // Fetch skills count
      const skillsResponse = await axios.get('http://localhost:8000/skills', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const skillsCount = skillsResponse.data.length;

      // Fetch job matches count
      const jobsResponse = await axios.get('http://localhost:8000/job-analyses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const jobMatchesCount = jobsResponse.data.length;

      // Fetch notifications for recent activity
      const notificationsResponse = await axios.get('http://localhost:8000/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update stats
      setStats([
        { label: 'Resume Score', value: '92%', gradient: 'from-emerald-400 to-teal-500', icon: '📊', iconBg: 'bg-emerald-100' },
        { label: 'Skills Tracked', value: skillsCount.toString(), gradient: 'from-blue-400 to-indigo-500', icon: '📈', iconBg: 'bg-blue-100' },
        { label: 'Job Matches', value: jobMatchesCount.toString(), gradient: 'from-purple-400 to-pink-500', icon: '🎯', iconBg: 'bg-purple-100' },
        { label: 'Profile Views', value: '156', gradient: 'from-amber-400 to-orange-500', icon: '👁️', iconBg: 'bg-amber-100' },
      ]);

      // Update recent activity from notifications
      const activities = notificationsResponse.data.slice(0, 3).map(notif => ({
        icon: notif.type === 'success' ? '✅' : notif.type === 'info' ? '📚' : '🎯',
        title: notif.title,
        time: getTimeAgo(new Date(notif.created_at)),
        bgGradient: notif.type === 'success' ? 'from-green-50 to-emerald-50' : 
                    notif.type === 'info' ? 'from-blue-50 to-indigo-50' : 
                    'from-purple-50 to-pink-50',
        iconBg: notif.type === 'success' ? 'bg-green-100' : 
                notif.type === 'info' ? 'bg-blue-100' : 
                'bg-purple-100'
      }));
      
      setRecentActivity(activities.length > 0 ? activities : [
        { icon: '✅', title: 'Resume analyzed', time: '2 hours ago', bgGradient: 'from-green-50 to-emerald-50', iconBg: 'bg-green-100' },
        { icon: '📚', title: 'Added skill: React.js', time: '1 day ago', bgGradient: 'from-blue-50 to-indigo-50', iconBg: 'bg-blue-100' },
        { icon: '🎯', title: 'Matched 3 new jobs', time: '2 days ago', bgGradient: 'from-purple-50 to-pink-50', iconBg: 'bg-purple-100' }
      ]);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 -m-6 p-6">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-2xl">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome back, {userName}! 👋</h1>
              <p className="text-indigo-100">Manage your professional profile and track your career growth</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 backdrop-blur-sm border border-white/30 hover:scale-105"
            >
              <span className="text-xl">🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                  <p className={`text-4xl font-bold mt-2 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.iconBg} w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-2xl font-bold mb-6 text-gray-800">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => navigate(action.path)}
                className={`bg-gradient-to-br ${action.gradient} ${action.hover} text-white p-6 rounded-2xl shadow-xl transition-all duration-300 text-left hover:shadow-2xl hover:-translate-y-1 group`}
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">{action.icon}</div>
                <h4 className="font-bold text-xl mb-1">{action.title}</h4>
                <p className="text-sm opacity-90">{action.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6">
          <h3 className="text-2xl font-bold mb-6 text-gray-800">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, idx) => (
                <div key={idx} className={`flex items-center gap-4 p-4 bg-gradient-to-r ${activity.bgGradient} rounded-xl hover:shadow-md transition-shadow`}>
                  <div className={`${activity.iconBg} w-12 h-12 rounded-xl flex items-center justify-center text-2xl`}>
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{activity.title}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
