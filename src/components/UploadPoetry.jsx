import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { firestoreService } from '../firebase/firestore.js';

const UploadPoetry = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { user } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const poemData = {
        title: formData.title,
        content: formData.content,
        author: user.name,
        authorId: user.uid
      };

      const result = await firestoreService.poems.create(poemData);
      
      if (result.success) {
        setMessage('Poem uploaded successfully!');
        setFormData({ title: '', content: '' });
        setShowForm(false);
        
        // Refresh the page to show the new poem
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setMessage('Error uploading poem: ' + result.error);
      }
      
    } catch (error) {
      setMessage('Error uploading poem. Please try again.');
      console.error('Upload error:', error);
    }
    
    setLoading(false);
  };

  if (!showForm) {
    return (
      <div className="upload-poetry">
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          📝 Upload Your Poetry
        </button>
        {message && <div className="success-message">{message}</div>}
      </div>
    );
  }

  return (
    <div className="upload-form">
      <div className="form-header">
        <h3>Share Your Poetry</h3>
        <button className="close-btn" onClick={() => setShowForm(false)}>×</button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter poem title"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="content">Poem Content:</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            placeholder="Write your poem here..."
            rows="10"
            style={{ fontFamily: 'serif', lineHeight: '1.6' }}
          />
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => setShowForm(false)}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Upload Poem'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadPoetry;
