import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { firestoreService } from '../firebase/firestore.js';
import AdminPanel from '../components/AdminPanel';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

const SettingsPage = () => {
  const { user, isGuest, isAdmin, logout, updateUser, refreshUserData } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    bio: '',
    location: '',
    website: '',
    profileImage: '',
    preferences: {
      language: 'filipino',
      notifications: true,
      publicProfile: true,
      emailUpdates: true
    }
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        name: user.name || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
        profileImage: user.profileImage || '',
        preferences: {
          language: user.preferences?.language || 'filipino',
          notifications: user.preferences?.notifications ?? true,
          publicProfile: user.preferences?.publicProfile ?? true,
          emailUpdates: user.preferences?.emailUpdates ?? true
        }
      }));
      
      // Set image preview if user has profile image
      if (user.profileImage) {
        setImagePreview(user.profileImage);
      }
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePreferenceChange = (e) => {
    const { name, checked } = e.target;
    setProfileData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [name]: checked
      }
    }));
  };

  const handleLanguageChange = (e) => {
    setProfileData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        language: e.target.value
      }
    }));
  };

  // Convert image to base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  // Handle profile image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage('Please select a valid image file.');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage('Image size must be less than 5MB.');
        return;
      }

      try {
        setLoading(true);
        setMessage('Converting image...');
        
        // Convert to base64
        const base64String = await convertToBase64(file);
        
        // Update profile data with base64 image
        setProfileData(prev => ({
          ...prev,
          profileImage: base64String
        }));
        
        // Set preview
        setImagePreview(base64String);
        
        setMessage('Image uploaded successfully! Click Save Changes to update your profile.');
      } catch (error) {
        setMessage('Error uploading image: ' + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  // Remove profile image
  const handleRemoveImage = () => {
    setProfileData(prev => ({
      ...prev,
      profileImage: ''
    }));
    setImagePreview('');
    setMessage('Profile image removed. Click Save Changes to update your profile.');
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setMessage('');

    try {
      const result = await firestoreService.users.update(user.uid, profileData);
      if (result.success) {
        // Refresh user data from database to ensure we have the latest data
        const refreshResult = await refreshUserData();
        if (refreshResult.success) {
          setMessage('Profile updated successfully!');
          console.log('✅ Profile updated and refreshed from database:', refreshResult.data.name);
          // Update image preview with fresh data
          if (refreshResult.data.profileImage) {
            setImagePreview(refreshResult.data.profileImage);
          }
        } else {
          // Fallback: update user state manually
          const updatedUser = { ...user, ...profileData };
          updateUser(updatedUser);
          setMessage('Profile updated successfully!');
        }
      } else {
        setMessage('Error updating profile: ' + result.error);
      }
    } catch (error) {
      setMessage('Error updating profile. Please try again.');
      console.error('Profile update error:', error);
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'preferences', label: 'Preferences', icon: '⚙️' },
    { id: 'privacy', label: 'Privacy', icon: '🔒' },
    { id: 'account', label: 'Account', icon: '🛡️' },
    ...(isAdmin() ? [{ id: 'admin', label: 'Admin Panel', icon: '👑' }] : [])
  ];

  if (isGuest()) {
    return (
      <div className="settings-page">
        <div className="page-container">
          <div className="settings-header">
            <h1 className="page-title">Settings</h1>
            <p className="page-subtitle">Manage your account and preferences</p>
          </div>
          
          <div className="login-required">
            <div className="login-card">
              <div className="login-icon">⚙️</div>
              <h2>Login Required</h2>
              <p>You need to be logged in to access settings and manage your account.</p>
              <div className="auth-buttons">
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowLogin(true)}
                >
                  Login
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => setShowRegister(true)}
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        {showLogin && (
          <div className="modal-overlay" onClick={() => setShowLogin(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <LoginForm onClose={() => setShowLogin(false)} />
            </div>
          </div>
        )}

        {showRegister && (
          <div className="modal-overlay" onClick={() => setShowRegister(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <RegisterForm onClose={() => setShowRegister(false)} />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="settings-page">
      <div className="page-container">
        <div className="settings-header">
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your account and preferences</p>
        </div>
        
        <div className="settings-container">
          <div className="settings-sidebar">
            <div className="user-profile-card">
              <div className="user-avatar">
                {user.profileImage ? (
                  <img 
                    src={user.profileImage} 
                    alt="Profile" 
                    className="user-avatar-image"
                  />
                ) : (
                  <span>{user.name?.charAt(0) || 'U'}</span>
                )}
              </div>
              <div className="user-info">
                <h3>{user.name}</h3>
                <p className="user-email">{user.email}</p>
                <span className={`role-badge ${user.role}`}>{user.role}</span>
              </div>
            </div>

            <div className="settings-tabs">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="tab-icon">{tab.icon}</span>
                  <span className="tab-label">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="settings-content">
            {activeTab === 'profile' && (
              <div className="settings-section">
                <h2 className="section-title">Profile Information</h2>
                <div className="form-section">
                  {/* Profile Image Section */}
                  <div className="form-group">
                    <div className="profile-image-section">
                      <div className="image-preview">
                        {imagePreview ? (
                          <img 
                            src={imagePreview} 
                            alt="Profile Preview" 
                            className="profile-preview-image"
                          />
                        ) : (
                          <div className="profile-placeholder">
                            <span>{profileData.name?.charAt(0) || 'U'}</span>
                          </div>
                        )}
                      </div>
                      <div className="image-actions">
                        <input
                          type="file"
                          id="profileImage"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="file-input"
                          disabled={loading}
                        />
                        <label htmlFor="profileImage" className="btn btn-outline btn-sm">
                          📷 Choose Image
                        </label>
                        {imagePreview && (
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="btn btn-outline btn-sm btn-danger"
                            disabled={loading}
                          >
                            🗑️ Remove
                          </button>
                        )}
                      </div>
                      <div className="input-hint">
                        Upload a profile picture (JPG, PNG, GIF - Max 5MB)
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="name">Display Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      className="form-input"
                      placeholder="Enter your display name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="bio">Bio</label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={profileData.bio}
                      onChange={handleProfileChange}
                      className="form-textarea"
                      rows="4"
                      placeholder="Tell us about yourself..."
                      maxLength={500}
                    />
                    <div className="input-hint">{profileData.bio.length}/500 characters</div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="location">Location</label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={profileData.location}
                        onChange={handleProfileChange}
                        className="form-input"
                        placeholder="City, Country"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="website">Website</label>
                      <input
                        type="url"
                        id="website"
                        name="website"
                        value={profileData.website}
                        onChange={handleProfileChange}
                        className="form-input"
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button 
                      className="btn btn-primary"
                      onClick={handleSaveProfile}
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="settings-section">
                <h2 className="section-title">Preferences</h2>
                <div className="form-section">
                  <div className="form-group">
                    <label htmlFor="language">Default Language</label>
                    <select
                      id="language"
                      value={profileData.preferences.language}
                      onChange={handleLanguageChange}
                      className="form-select"
                    >
                      <option value="filipino">Filipino</option>
                      <option value="english">English</option>
                      <option value="mixed">Mixed</option>
                    </select>
                    <div className="input-hint">Choose your preferred language for the interface</div>
                  </div>

                  <div className="preferences-group">
                    <h3>Notifications</h3>
                    <div className="preference-item">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="notifications"
                          checked={profileData.preferences.notifications}
                          onChange={handlePreferenceChange}
                        />
                        <span className="checkmark"></span>
                        <div className="preference-content">
                          <h4>Push Notifications</h4>
                          <p>Receive notifications for likes, comments, and new followers</p>
                        </div>
                      </label>
                    </div>

                    <div className="preference-item">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="emailUpdates"
                          checked={profileData.preferences.emailUpdates}
                          onChange={handlePreferenceChange}
                        />
                        <span className="checkmark"></span>
                        <div className="preference-content">
                          <h4>Email Updates</h4>
                          <p>Receive weekly summaries and important updates via email</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="settings-section">
                <h2 className="section-title">Privacy Settings</h2>
                <div className="form-section">
                  <div className="preferences-group">
                    <div className="preference-item">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="publicProfile"
                          checked={profileData.preferences.publicProfile}
                          onChange={handlePreferenceChange}
                        />
                        <span className="checkmark"></span>
                        <div className="preference-content">
                          <h4>Public Profile</h4>
                          <p>Allow others to view your profile and poems</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="privacy-info">
                    <h3>Data Privacy</h3>
                    <p>We respect your privacy and are committed to protecting your personal information. Your data is encrypted and stored securely.</p>
                    <ul>
                      <li>Your poems are only visible to other users if you choose to make them public</li>
                      <li>We never share your personal information with third parties</li>
                      <li>You can delete your account and all associated data at any time</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'account' && (
              <div className="settings-section">
                <h2 className="section-title">Account Management</h2>
                <div className="form-section">
                  <div className="account-info">
                    <div className="info-item">
                      <label>Email:</label>
                      <span>{user.email}</span>
                    </div>
                    <div className="info-item">
                      <label>Account Type:</label>
                      <span className={`role-badge ${user.role}`}>{user.role}</span>
                    </div>
                    <div className="info-item">
                      <label>Member Since:</label>
                      <span>{new Date(user.joinDate || Date.now()).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="account-actions">
                    <h3>Account Actions</h3>
                    <div className="action-buttons">
                      <button className="btn btn-outline">
                        Change Password
                      </button>
                      <button className="btn btn-outline">
                        Download Data
                      </button>
                      <button className="btn btn-danger">
                        Delete Account
                      </button>
                    </div>
                  </div>

                  <div className="logout-section">
                    <button 
                      className="btn btn-primary"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'admin' && (
              <div className="settings-section">
                <h2 className="section-title">Admin Panel</h2>
                <AdminPanel />
              </div>
            )}

            {message && (
              <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
