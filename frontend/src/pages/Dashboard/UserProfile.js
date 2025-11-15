import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserProfile.css';

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
    phone: '',
    location: '',
    job_title: '',
    company: '',
    linkedin: '',
    github: '',
    website: ''
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
      setFormData({
        full_name: response.data.full_name || '',
        bio: response.data.bio || '',
        phone: response.data.phone || '',
        location: response.data.location || '',
        job_title: response.data.job_title || '',
        company: response.data.company || '',
        linkedin: response.data.linkedin || '',
        github: response.data.github || '',
        website: response.data.website || ''
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:8000/users/profile-picture', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Update local state
      const updatedUser = { ...user, profile_picture: response.data.profile_picture };
      setUser(updatedUser);
      
      // Trigger global update event
      window.dispatchEvent(new CustomEvent('profileUpdated', { detail: updatedUser }));
      
      setUploading(false);
      alert('Profile picture updated successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Please log in again');
        window.location.href = '/login';
        return;
      }

      const response = await axios.put('http://localhost:8000/users/profile', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Update local state
      const updatedUser = response.data.user;
      setUser(updatedUser);
      
      // Trigger global update event to update sidebar, header, and all other places
      window.dispatchEvent(new CustomEvent('profileUpdated', { detail: updatedUser }));
      
      setIsEditing(false);
      alert('✅ Profile updated successfully! All sections have been updated.');
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMsg = error.response?.data?.detail || error.message || 'Unknown error';
      alert(`❌ Failed to update profile: ${errorMsg}\n\nPlease check:\n1. You are logged in\n2. Backend is running\n3. All fields are valid`);
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="user-profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
        <button
          className="edit-profile-btn"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? '❌ Cancel' : '✏️ Edit Profile'}
        </button>
      </div>

      <div className="profile-content">
        {/* Profile Picture Section */}
        <div className="profile-picture-section">
          <div className="profile-picture-wrapper">
            {user?.profile_picture ? (
              <img src={user.profile_picture} alt="Profile" className="profile-picture" />
            ) : (
              <div className="profile-picture-placeholder">
                <span className="placeholder-icon">👤</span>
              </div>
            )}
            {uploading && (
              <div className="upload-overlay">
                <div className="spinner-small"></div>
              </div>
            )}
          </div>
          <label className="upload-btn">
            📷 Change Photo
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
          </label>
        </div>

        {/* Profile Information */}
        <div className="profile-info-section">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={user?.email}
                    disabled
                    className="disabled-input"
                  />
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 234 567 8900"
                  />
                </div>

                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="City, Country"
                  />
                </div>

                <div className="form-group">
                  <label>Job Title</label>
                  <input
                    type="text"
                    name="job_title"
                    value={formData.job_title}
                    onChange={handleInputChange}
                    placeholder="Software Developer"
                  />
                </div>

                <div className="form-group">
                  <label>Company</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Company Name"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself..."
                    rows="4"
                  />
                </div>

                <div className="form-group">
                  <label>LinkedIn</label>
                  <input
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>

                <div className="form-group">
                  <label>GitHub</label>
                  <input
                    type="url"
                    name="github"
                    value={formData.github}
                    onChange={handleInputChange}
                    placeholder="https://github.com/username"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Website</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="save-btn">
                  💾 Save Changes
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-display">
              <div className="info-card">
                <h3>Personal Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">👤 Full Name</span>
                    <span className="info-value">{user?.full_name || 'Not set'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">📧 Email</span>
                    <span className="info-value">{user?.email}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">📱 Phone</span>
                    <span className="info-value">{user?.phone || 'Not set'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">📍 Location</span>
                    <span className="info-value">{user?.location || 'Not set'}</span>
                  </div>
                </div>
              </div>

              <div className="info-card">
                <h3>Professional Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">💼 Job Title</span>
                    <span className="info-value">{user?.job_title || 'Not set'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">🏢 Company</span>
                    <span className="info-value">{user?.company || 'Not set'}</span>
                  </div>
                </div>
                {user?.bio && (
                  <div className="bio-section">
                    <span className="info-label">📝 Bio</span>
                    <p className="bio-text">{user.bio}</p>
                  </div>
                )}
              </div>

              <div className="info-card">
                <h3>Social Links</h3>
                <div className="social-links">
                  {user?.linkedin && (
                    <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="social-link">
                      <span className="social-icon">💼</span> LinkedIn
                    </a>
                  )}
                  {user?.github && (
                    <a href={user.github} target="_blank" rel="noopener noreferrer" className="social-link">
                      <span className="social-icon">💻</span> GitHub
                    </a>
                  )}
                  {user?.website && (
                    <a href={user.website} target="_blank" rel="noopener noreferrer" className="social-link">
                      <span className="social-icon">🌐</span> Website
                    </a>
                  )}
                  {!user?.linkedin && !user?.github && !user?.website && (
                    <p className="no-links">No social links added yet</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
