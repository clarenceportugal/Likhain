import React, { useState, useEffect } from 'react';
import { firestoreService } from '../firebase/firestore.js';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [poems, setPoems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editingPoem, setEditingPoem] = useState(null);
  const [editForm, setEditForm] = useState({});

  // Load users and poems from database
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersResult, poemsResult] = await Promise.all([
        firestoreService.users.getAll(),
        firestoreService.poems.getAll()
      ]);

      if (usersResult.success) {
        setUsers(usersResult.data);
      }
      if (poemsResult.success) {
        setPoems(poemsResult.data);
      }
    } catch (error) {
      setMessage('Error loading data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      setLoading(true);
      try {
        const result = await firestoreService.users.delete(userId);
        if (result.success) {
          setMessage('User deleted successfully!');
          loadData(); // Reload data
        } else {
          setMessage('Error deleting user: ' + result.error);
        }
      } catch (error) {
        setMessage('Error deleting user: ' + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeletePoem = async (poemId) => {
    if (window.confirm('Are you sure you want to delete this poem? This action cannot be undone.')) {
      setLoading(true);
      try {
        const result = await firestoreService.poems.delete(poemId);
        if (result.success) {
          setMessage('Poem deleted successfully!');
          loadData(); // Reload data
        } else {
          setMessage('Error deleting poem: ' + result.error);
        }
      } catch (error) {
        setMessage('Error deleting poem: ' + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setEditForm({
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'user',
      bio: user.bio || '',
      location: user.location || '',
      website: user.website || ''
    });
  };

  const handleEditPoem = (poem) => {
    setEditingPoem(poem);
    setEditForm({
      title: poem.title || '',
      content: poem.content || '',
      language: poem.language || 'filipino',
      category: poem.category || 'general',
      tags: poem.tags ? poem.tags.join(', ') : ''
    });
  };

  const handleSaveUser = async () => {
    setLoading(true);
    try {
      const result = await firestoreService.users.update(editingUser.uid, editForm);
      if (result.success) {
        setMessage('User updated successfully!');
        setEditingUser(null);
        loadData(); // Reload data
      } else {
        setMessage('Error updating user: ' + result.error);
      }
    } catch (error) {
      setMessage('Error updating user: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePoem = async () => {
    setLoading(true);
    try {
      const poemData = {
        ...editForm,
        tags: editForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };
      const result = await firestoreService.poems.update(editingPoem.id, poemData);
      if (result.success) {
        setMessage('Poem updated successfully!');
        setEditingPoem(null);
        loadData(); // Reload data
      } else {
        setMessage('Error updating poem: ' + result.error);
      }
    } catch (error) {
      setMessage('Error updating poem: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditingPoem(null);
    setEditForm({});
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h3>🔧 Admin Panel</h3>
        <div className="admin-tabs">
          <button 
            className={`tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
          <button 
            className={`tab ${activeTab === 'poems' ? 'active' : ''}`}
            onClick={() => setActiveTab('poems')}
          >
            Poems
          </button>
          <button 
            className={`tab ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            Statistics
          </button>
        </div>
      </div>

      {message && (
        <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="admin-content">
        {activeTab === 'users' && (
          <div className="users-section">
            <h4>User Management</h4>
            {loading ? (
              <div className="loading">Loading users...</div>
            ) : (
              <div className="users-list">
                {users.filter(user => user.role !== 'admin').map(user => (
                  <div key={user.uid} className="user-item">
                    {editingUser && editingUser.uid === user.uid ? (
                      <div className="edit-form">
                        <div className="form-group">
                          <label>Name:</label>
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                            className="form-input"
                          />
                        </div>
                        <div className="form-group">
                          <label>Email:</label>
                          <input
                            type="email"
                            value={editForm.email}
                            onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                            className="form-input"
                          />
                        </div>
                        <div className="form-group">
                          <label>Role:</label>
                          <select
                            value={editForm.role}
                            onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                            className="form-select"
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Bio:</label>
                          <textarea
                            value={editForm.bio}
                            onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                            className="form-textarea"
                            rows="3"
                          />
                        </div>
                        <div className="form-actions">
                          <button 
                            className="btn btn-primary btn-sm"
                            onClick={handleSaveUser}
                            disabled={loading}
                          >
                            Save
                          </button>
                          <button 
                            className="btn btn-outline btn-sm"
                            onClick={handleCancelEdit}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="user-info">
                          <h5>{user.name}</h5>
                          <p>{user.email}</p>
                          <span className={`user-role ${user.role}`}>{user.role}</span>
                          <span className="poem-count">{user.poemsCount || 0} poems</span>
                        </div>
                        <div className="user-actions">
                          <button 
                            className="btn btn-sm btn-outline"
                            onClick={() => handleEditUser(user)}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDeleteUser(user.uid)}
                            disabled={user.uid === 'renz42gal'} // Prevent deleting admin
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'poems' && (
          <div className="poems-section">
            <h4>Poem Management</h4>
            {loading ? (
              <div className="loading">Loading poems...</div>
            ) : (
              <div className="poems-list">
                {poems.map(poem => (
                  <div key={poem.id} className="poem-item">
                    {editingPoem && editingPoem.id === poem.id ? (
                      <div className="edit-form">
                        <div className="form-group">
                          <label>Title:</label>
                          <input
                            type="text"
                            value={editForm.title}
                            onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                            className="form-input"
                          />
                        </div>
                        <div className="form-group">
                          <label>Content:</label>
                          <textarea
                            value={editForm.content}
                            onChange={(e) => setEditForm({...editForm, content: e.target.value})}
                            className="form-textarea"
                            rows="6"
                          />
                        </div>
                        <div className="form-row">
                          <div className="form-group">
                            <label>Language:</label>
                            <select
                              value={editForm.language}
                              onChange={(e) => setEditForm({...editForm, language: e.target.value})}
                              className="form-select"
                            >
                              <option value="filipino">Filipino</option>
                              <option value="english">English</option>
                              <option value="mixed">Mixed</option>
                            </select>
                          </div>
                          <div className="form-group">
                            <label>Category:</label>
                            <select
                              value={editForm.category}
                              onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                              className="form-select"
                            >
                              <option value="love">Love</option>
                              <option value="nature">Nature</option>
                              <option value="life">Life</option>
                              <option value="hope">Hope</option>
                              <option value="general">General</option>
                            </select>
                          </div>
                        </div>
                        <div className="form-group">
                          <label>Tags (comma-separated):</label>
                          <input
                            type="text"
                            value={editForm.tags}
                            onChange={(e) => setEditForm({...editForm, tags: e.target.value})}
                            className="form-input"
                            placeholder="love, hope, filipino"
                          />
                        </div>
                        <div className="form-actions">
                          <button 
                            className="btn btn-primary btn-sm"
                            onClick={handleSavePoem}
                            disabled={loading}
                          >
                            Save
                          </button>
                          <button 
                            className="btn btn-outline btn-sm"
                            onClick={handleCancelEdit}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="poem-info">
                          <h5>{poem.title}</h5>
                          <p>by {poem.author}</p>
                          <div className="poem-meta">
                            <span className="poem-likes">❤️ {poem.likes || 0}</span>
                            <span className="poem-language">{poem.language}</span>
                            <span className="poem-category">{poem.category}</span>
                          </div>
                          <div className="poem-preview">
                            {poem.content?.substring(0, 100)}...
                          </div>
                        </div>
                        <div className="poem-actions">
                          <button 
                            className="btn btn-sm btn-outline"
                            onClick={() => handleEditPoem(poem)}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDeletePoem(poem.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="stats-section">
            <h4>Platform Statistics</h4>
            <div className="stats-grid">
              <div className="stat-card">
                <h5>Total Users</h5>
                <p className="stat-number">{users.length}</p>
              </div>
              <div className="stat-card">
                <h5>Total Poems</h5>
                <p className="stat-number">{poems.length}</p>
              </div>
              <div className="stat-card">
                <h5>Total Likes</h5>
                <p className="stat-number">{poems.reduce((total, poem) => total + (poem.likes || 0), 0)}</p>
              </div>
              <div className="stat-card">
                <h5>Admin Users</h5>
                <p className="stat-number">{users.filter(user => user.role === 'admin').length}</p>
              </div>
            </div>
            <div className="stats-details">
              <h5>Recent Activity</h5>
              <div className="activity-list">
                {poems.slice(0, 5).map(poem => (
                  <div key={poem.id} className="activity-item">
                    <span className="activity-text">
                      <strong>{poem.author}</strong> published "{poem.title}"
                    </span>
                    <span className="activity-date">
                      {new Date(poem.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
