import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { firestoreService } from '../firebase/firestore.js';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import { Link, useSearchParams } from 'react-router-dom';

const UploadPage = () => {
  const { user, isGuest } = useAuth();
  const [searchParams] = useSearchParams();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [formData, setFormData] = useState({
    contentType: 'poem', // 'poem' or 'story'
    title: '',
    content: '',
    tags: '',
    language: 'filipino',
    genre: 'general',
    // Story-specific fields
    description: '',
    status: 'ongoing', // ongoing, completed, on-hold
    targetAudience: 'general', // general, teen, mature
    coverImage: '',
    isPublic: true
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [isAddingChapter, setIsAddingChapter] = useState(false);
  const [existingStoryId, setExistingStoryId] = useState('');
  const [userStories, setUserStories] = useState([]);
  const [coverImagePreview, setCoverImagePreview] = useState('');

  // Load user stories for continuation
  useEffect(() => {
    if (user && !isGuest()) {
      loadUserStories();
    }
  }, [user]);

  // Handle continue story URL parameter
  useEffect(() => {
    const continueStoryId = searchParams.get('continue');
    if (continueStoryId) {
      setFormData(prev => ({ ...prev, contentType: 'story' }));
      setIsAddingChapter(true);
      setExistingStoryId(continueStoryId);
    }
  }, [searchParams]);

  const loadUserStories = async () => {
    try {
      const result = await firestoreService.stories.getAll();
      if (result.success) {
        // Filter stories by current user and incomplete stories
        const userStoriesList = result.data.filter(story => 
          story.authorId === user.uid && !story.isCompleted
        );
        setUserStories(userStoriesList);
      }
    } catch (error) {
      console.error('Error loading user stories:', error);
    }
  };

  // Convert file to base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  // Handle cover image upload
  const handleCoverImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

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
      const base64 = await convertToBase64(file);
      setFormData(prev => ({ ...prev, coverImage: base64 }));
      setCoverImagePreview(base64);
      setMessage('');
    } catch (error) {
      setMessage('Error uploading image. Please try again.');
    }
  };

  // Handle cover image removal
  const handleRemoveCoverImage = () => {
    setFormData(prev => ({ ...prev, coverImage: '' }));
    setCoverImagePreview('');
    setMessage('');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    let processedValue = value;
    let newFormData = { ...formData };
    
    // Handle different input types
    if (type === 'checkbox') {
      newFormData[name] = checked;
    } else if (name === 'isPublic') {
      newFormData[name] = value === 'true';
    } else {
      newFormData[name] = value;
    }
    
    // Auto-detect genre based on content (but don't auto-format on every keystroke)
    if (name === 'content') {
      processedValue = value; // Keep original content without auto-formatting
      
      // Auto-detect genre based on content
      const detectedGenre = autoDetectGenre(processedValue, formData.contentType);
      newFormData.genre = detectedGenre;
    }
    
    setFormData(newFormData);

    // Update word and character count for content
    if (name === 'content') {
      const words = processedValue.trim().split(/\s+/).filter(word => word.length > 0);
      setWordCount(words.length);
      setCharCount(processedValue.length);
    }
  };

  // Auto-format content based on type
  const autoFormatContent = (content, contentType) => {
    if (!content) return content;
    
    if (contentType === 'poem') {
      return autoFormatPoem(content);
    } else if (contentType === 'story') {
      return autoFormatStory(content);
    }
    
    return content;
  };

  // Auto-detect genre based on content
  const autoDetectGenre = (content, contentType) => {
    if (!content || content.length < 10) return 'general';
    
    const text = content.toLowerCase();
    
    // Love and romance keywords
    const loveKeywords = ['love', 'heart', 'kiss', 'romance', 'beloved', 'darling', 'sweetheart', 'passion', 'affection', 'mahal', 'pag-ibig', 'sinta', 'irog', 'giliw'];
    const loveScore = loveKeywords.filter(keyword => text.includes(keyword)).length;
    
    // Nature keywords
    const natureKeywords = ['tree', 'flower', 'mountain', 'river', 'ocean', 'sky', 'sun', 'moon', 'star', 'wind', 'rain', 'forest', 'puno', 'bulaklak', 'bundok', 'ilog', 'dagat', 'langit', 'araw', 'buwan', 'bituin', 'hangin', 'ulan', 'gubat'];
    const natureScore = natureKeywords.filter(keyword => text.includes(keyword)).length;
    
    // Life and philosophy keywords
    const lifeKeywords = ['life', 'death', 'time', 'dream', 'hope', 'future', 'past', 'memory', 'soul', 'spirit', 'wisdom', 'truth', 'buhay', 'kamatayan', 'panahon', 'pangarap', 'pag-asa', 'hinaharap', 'nakaraan', 'alaala', 'kaluluwa', 'karunungan', 'katotohanan'];
    const lifeScore = lifeKeywords.filter(keyword => text.includes(keyword)).length;
    
    // Family and friends keywords
    const familyKeywords = ['mother', 'father', 'family', 'friend', 'brother', 'sister', 'parent', 'child', 'home', 'nanay', 'tatay', 'pamilya', 'kaibigan', 'kapatid', 'magulang', 'anak', 'bahay', 'ina', 'ama'];
    const familyScore = familyKeywords.filter(keyword => text.includes(keyword)).length;
    
    // Dreams and aspirations keywords
    const dreamKeywords = ['dream', 'aspiration', 'goal', 'ambition', 'success', 'achieve', 'future', 'wish', 'desire', 'pangarap', 'hangarin', 'layunin', 'tagumpay', 'hinaharap', 'nais', 'gusto'];
    const dreamScore = dreamKeywords.filter(keyword => text.includes(keyword)).length;
    
    // Find the genre with the highest score
    const scores = {
      romance: loveScore,
      nature: natureScore,
      life: lifeScore,
      family: familyScore,
      dreams: dreamScore
    };
    
    const maxScore = Math.max(...Object.values(scores));
    
    // If no clear genre detected, return general
    if (maxScore === 0) return 'general';
    
    // Return the genre with the highest score
    return Object.keys(scores).find(genre => scores[genre] === maxScore);
  };

  // Auto-format poem content
  const autoFormatPoem = (content) => {
    if (!content) return content;
    
    // Preserve the original line breaks and just clean up extra whitespace
    let lines = content.split('\n');
    
    // Clean up each line (remove extra spaces but preserve line breaks)
    const cleanedLines = lines.map(line => {
      // Remove leading/trailing whitespace but preserve the line
      return line.trim();
    });
    
    // Remove excessive empty lines (more than 2 consecutive empty lines)
    const formattedLines = [];
    let emptyLineCount = 0;
    
    cleanedLines.forEach(line => {
      if (line === '') {
        emptyLineCount++;
        if (emptyLineCount <= 2) { // Allow up to 2 consecutive empty lines
          formattedLines.push(line);
        }
      } else {
        emptyLineCount = 0;
        formattedLines.push(line);
      }
    });
    
    return formattedLines.join('\n');
  };

  // Auto-format story content
  const autoFormatStory = (content) => {
    if (!content) return content;
    
    // Preserve the original line breaks and just clean up extra whitespace
    let lines = content.split('\n');
    
    // Clean up each line (remove extra spaces but preserve line breaks)
    const cleanedLines = lines.map(line => {
      // Remove leading/trailing whitespace but preserve the line
      return line.trim();
    });
    
    // Remove excessive empty lines (more than 2 consecutive empty lines)
    const formattedLines = [];
    let emptyLineCount = 0;
    
    cleanedLines.forEach(line => {
      if (line === '') {
        emptyLineCount++;
        if (emptyLineCount <= 2) { // Allow up to 2 consecutive empty lines
          formattedLines.push(line);
        }
      } else {
        emptyLineCount = 0;
        formattedLines.push(line);
      }
    });
    
    return formattedLines.join('\n');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const contentData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        author: user.name,
        authorId: user.uid,
        authorProfileImage: user.profileImage || '', // Include user's profile image
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        language: formData.language,
        genre: formData.genre,
        // Story-specific fields
        ...(formData.contentType === 'story' && {
          description: formData.description.trim(),
          status: formData.status,
          targetAudience: formData.targetAudience,
          coverImage: formData.coverImage.trim(),
          isPublic: formData.isPublic
        })
      };

      let result;
      if (formData.contentType === 'poem') {
        result = await firestoreService.poems.create(contentData);
      } else {
        if (isAddingChapter && existingStoryId) {
          // Adding a new chapter to existing story
          result = await firestoreService.stories.addChapter(existingStoryId, {
            title: formData.title.trim(),
            content: formData.content.trim(),
            author: user.name,
            authorId: user.uid,
            authorProfileImage: user.profileImage || ''
          });
        } else {
          // Creating a new story
          result = await firestoreService.stories.create(contentData);
        }
      }
      
      if (result.success) {
        let successMessage;
        if (formData.contentType === 'poem') {
          successMessage = 'Poem uploaded successfully!';
        } else if (isAddingChapter) {
          successMessage = 'Chapter added successfully!';
        } else {
          successMessage = 'Story uploaded successfully!';
        }
        
        setMessage(successMessage);
        setFormData({
          contentType: 'poem',
          title: '',
          content: '',
          tags: '',
          language: 'filipino',
          genre: 'general',
          // Story-specific fields
          description: '',
          status: 'ongoing',
          targetAudience: 'general',
          coverImage: '',
          isPublic: true
        });
        setWordCount(0);
        setCharCount(0);
        setIsAddingChapter(false);
        setExistingStoryId('');
        setCoverImagePreview('');
        
        // Redirect to appropriate page after 2 seconds
        setTimeout(() => {
          const redirectPath = formData.contentType === 'poem' ? '/poems' : '/stories';
          window.location.href = redirectPath;
        }, 2000);
      } else {
        const contentType = formData.contentType === 'poem' ? 'poem' : 'story';
        setMessage(`Error uploading ${contentType}: ` + result.error);
      }
      
    } catch (error) {
      const contentType = formData.contentType === 'poem' ? 'poem' : 'story';
      setMessage(`Error uploading ${contentType}. Please try again.`);
      console.error('Upload error:', error);
    }
    
    setLoading(false);
  };

  const languages = [
    { value: 'filipino', label: 'Filipino' },
    { value: 'english', label: 'English' },
    { value: 'mixed', label: 'Mixed (Filipino & English)' }
  ];

  // Genre options for both poems and stories
  const genres = [
    { value: 'general', label: '📚 General' },
    { value: 'romance', label: '💕 Romance' },
    { value: 'nature', label: '🌿 Nature' },
    { value: 'life', label: '🧠 Life & Philosophy' },
    { value: 'family', label: '👨‍👩‍👧‍👦 Family & Friends' },
    { value: 'dreams', label: '🌟 Dreams & Aspirations' },
    { value: 'fantasy', label: '🧙‍♀️ Fantasy' },
    { value: 'mystery', label: '🔍 Mystery' },
    { value: 'thriller', label: '😱 Thriller' },
    { value: 'sci-fi', label: '🚀 Science Fiction' },
    { value: 'horror', label: '👻 Horror' },
    { value: 'drama', label: '🎭 Drama' },
    { value: 'comedy', label: '😂 Comedy' },
    { value: 'adventure', label: '🗺️ Adventure' },
    { value: 'slice-of-life', label: '🏠 Slice of Life' }
  ];

  const statuses = [
    { value: 'ongoing', label: '📖 Ongoing' },
    { value: 'completed', label: '✅ Completed' },
    { value: 'on-hold', label: '⏸️ On Hold' }
  ];

  const audiences = [
    { value: 'general', label: '👥 General (All Ages)' },
    { value: 'teen', label: '👦👧 Teen (13+)' },
    { value: 'mature', label: '🔞 Mature (18+)' }
  ];

  if (isGuest()) {
    return (
      <div className="upload-page">
        <div className="page-container">
          <div className="upload-header">
            <h1 className="page-title">Share Your Poetry</h1>
            <p className="page-subtitle">Join our community to share your creative expressions</p>
          </div>
          
          <div className="login-required">
            <div className="login-card">
              <div className="login-icon">📝</div>
              <h2>Login Required</h2>
              <p>You need to be logged in to upload your poetry. Join our community to share your creative work!</p>
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
    <div className="upload-page">
      <div className="page-container">
        <div className="upload-header">
          <h1 className="page-title">Share Your Poetry</h1>
          <p className="page-subtitle">Share your creative expressions with our community</p>
        </div>

        <div className="upload-container">
          <div className="upload-form-container">
            <form onSubmit={handleSubmit} className="upload-form">
              <div className="form-section">
                <h3 className="section-title">Content Details</h3>
                
                <div className="form-group">
                  <label>Content Type *</label>
                  <div className="content-type-buttons">
                    <button
                      type="button"
                      className={`content-type-btn ${formData.contentType === 'poem' ? 'active' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, contentType: 'poem' }))}
                    >
                      📝 Poem
                    </button>
                    <button
                      type="button"
                      className={`content-type-btn ${formData.contentType === 'story' ? 'active' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, contentType: 'story' }))}
                    >
                      📖 Story
                    </button>
                  </div>
                </div>

                {/* Chapter Management for Stories */}
                {formData.contentType === 'story' && (
                  <div className="form-group">
                    <label>Story Action</label>
                    <div className="story-action-buttons">
                      <button
                        type="button"
                        className={`story-action-btn ${!isAddingChapter ? 'active' : ''}`}
                        onClick={() => {
                          setIsAddingChapter(false);
                          setExistingStoryId('');
                        }}
                      >
                        📖 New Story
                      </button>
                      <button
                        type="button"
                        className={`story-action-btn ${isAddingChapter ? 'active' : ''}`}
                        onClick={() => setIsAddingChapter(true)}
                      >
                        ➕ Add Chapter
                      </button>
                    </div>
                    
              {isAddingChapter && (
                <div className="chapter-input">
                  <div className="form-group">
                    <label htmlFor="storySelect">Select Story to Continue *</label>
                    <select
                      id="storySelect"
                      value={existingStoryId}
                      onChange={(e) => setExistingStoryId(e.target.value)}
                      className="form-select"
                      style={{ marginTop: '0.5rem' }}
                      required
                    >
                      <option value="">Choose a story to continue...</option>
                      {userStories.map(story => (
                        <option key={story.id} value={story.id}>
                          📖 {story.title} ({story.totalChapters || 1} chapters)
                        </option>
                      ))}
                    </select>
                    <div className="input-hint">
                      {userStories.length === 0 
                        ? "You don't have any incomplete stories to continue. Create a new story first!"
                        : "Select which story you want to add a new chapter to"
                      }
                    </div>
                  </div>
                  
                  {existingStoryId && (
                    <div className="selected-story-info">
                      {(() => {
                        const selectedStory = userStories.find(s => s.id === existingStoryId);
                        return selectedStory ? (
                          <div className="story-preview">
                            <h4>📖 {selectedStory.title}</h4>
                            <p><strong>Genre:</strong> {selectedStory.genre || 'General'}</p>
                            <p><strong>Status:</strong> {selectedStory.status || 'Ongoing'}</p>
                            <p><strong>Current Chapters:</strong> {selectedStory.totalChapters || 1}</p>
                            <p><strong>Description:</strong> {selectedStory.description || 'No description available'}</p>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  )}
                </div>
              )}
                  </div>
                )}
                
                <div className="form-group">
                  <label htmlFor="title">Title *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder={`Enter your ${formData.contentType} title`}
                    className="form-input"
                    maxLength={100}
                  />
                  <div className="input-hint">Maximum 100 characters</div>
                </div>

                {/* Story-specific fields */}
                {formData.contentType === 'story' && !isAddingChapter && (
                  <div className="story-setup-section">
                    <div className="story-setup-header">
                      <h3>📖 Story Setup</h3>
                    </div>

                    <div className="form-group story-description-field">
                      <label htmlFor="description">Story Description *</label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        placeholder="Write a compelling description of your story that will hook readers..."
                        className="form-textarea"
                        rows="4"
                        maxLength={500}
                      />
                      <div className="input-hint">Maximum 500 characters. This will be shown on your story's cover page.</div>
                    </div>

                    <div className="story-meta-grid">
                      <div className="form-group">
                        <label htmlFor="status">Status *</label>
                        <select
                          id="status"
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                          required
                          className="form-select"
                        >
                          {statuses.map(status => (
                            <option key={status.value} value={status.value}>
                              {status.label}
                            </option>
                          ))}
                        </select>
                        <div className={`story-status-indicator ${formData.status}`}>
                          {formData.status === 'ongoing' && '📖 Ongoing'}
                          {formData.status === 'completed' && '✅ Completed'}
                          {formData.status === 'on-hold' && '⏸️ On Hold'}
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="targetAudience">Target Audience *</label>
                        <select
                          id="targetAudience"
                          name="targetAudience"
                          value={formData.targetAudience}
                          onChange={handleChange}
                          required
                          className="form-select"
                        >
                          {audiences.map(audience => (
                            <option key={audience.value} value={audience.value}>
                              {audience.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="story-visibility-section">
                      <div className="form-group">
                        <label htmlFor="isPublic">Visibility</label>
                        <select
                          id="isPublic"
                          name="isPublic"
                          value={formData.isPublic}
                          onChange={handleChange}
                          className="form-select"
                        >
                          <option value={true}>🌍 Public (Everyone can read)</option>
                          <option value={false}>🔒 Private (Only you can see)</option>
                        </select>
                        <div className="input-hint">
                          {formData.isPublic 
                            ? "Your story will be visible to all readers" 
                            : "Your story will be private and only visible to you"
                          }
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Cover Image (Optional)</label>
                      <div className="cover-image-section">
                        {coverImagePreview ? (
                          <div className="cover-image-preview">
                            <img 
                              src={coverImagePreview} 
                              alt="Story cover preview"
                            />
                            <div className="image-actions">
                              <button
                                type="button"
                                className="btn btn-outline btn-sm"
                                onClick={() => document.getElementById('coverImageInput').click()}
                              >
                                📝 Change Image
                              </button>
                              <button
                                type="button"
                                className="btn btn-danger btn-sm"
                                onClick={handleRemoveCoverImage}
                              >
                                🗑️ Remove
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="cover-image-upload">
                            <div className="upload-placeholder">
                              <div className="upload-icon">📖</div>
                              <p>Upload a cover image for your story</p>
                              <button
                                type="button"
                                className="btn btn-primary btn-sm"
                                onClick={() => document.getElementById('coverImageInput').click()}
                              >
                                📁 Choose Image
                              </button>
                            </div>
                          </div>
                        )}
                        <input
                          type="file"
                          id="coverImageInput"
                          accept="image/*"
                          onChange={handleCoverImageUpload}
                          style={{ display: 'none' }}
                        />
                        <div className="input-hint">
                          Recommended size: 400x600px. Maximum file size: 5MB. Supported formats: JPG, PNG, GIF
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="language">Language *</label>
                    <select
                      id="language"
                      name="language"
                      value={formData.language}
                      onChange={handleChange}
                      required
                      className="form-select"
                    >
                      {languages.map(lang => (
                        <option key={lang.value} value={lang.value}>
                          {lang.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <div className="category-header">
                      <label htmlFor="genre">Genre</label>
                      <span className="auto-detect-badge">🤖 Auto-detected</span>
                    </div>
                    <select
                      id="genre"
                      name="genre"
                      value={formData.genre}
                      onChange={handleChange}
                      className="form-select"
                    >
                      {genres.map(genre => (
                        <option key={genre.value} value={genre.value}>
                          {genre.label}
                        </option>
                      ))}
                    </select>
                    <div className="input-hint">Genre is automatically detected from your content</div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="tags">Tags</label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="love, nature, hope (separate with commas)"
                    className="form-input"
                  />
                  <div className="input-hint">Add tags to help others discover your {formData.contentType}</div>
                </div>
              </div>

              <div className="form-section">
                <h3 className="section-title">Your {formData.contentType === 'poem' ? 'Poem' : 'Story'}</h3>
                
                <div className="form-group">
                  <div className="content-header">
                    <label htmlFor="content">{formData.contentType === 'poem' ? 'Poem' : 'Story'} Content *</label>
                    <button
                      type="button"
                      className="format-btn"
                      onClick={() => {
                        const formatted = autoFormatContent(formData.content, formData.contentType);
                        const detectedGenre = autoDetectGenre(formatted, formData.contentType);
                        setFormData(prev => ({ 
                          ...prev, 
                          content: formatted,
                          genre: detectedGenre
                        }));
                        const words = formatted.trim().split(/\s+/).filter(word => word.length > 0);
                        setWordCount(words.length);
                        setCharCount(formatted.length);
                      }}
                      disabled={!formData.content.trim()}
                    >
                      ✨ Auto Format & Genre
                    </button>
                  </div>
                  <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    required
                    placeholder={`Write your ${formData.contentType} here...`}
                    className="form-textarea"
                    rows="15"
                    style={{ fontFamily: 'serif', lineHeight: '1.8' }}
                  />
                  <div className="text-stats">
                    <span className="word-count">{wordCount} words</span>
                    <span className="char-count">{charCount} characters</span>
                    <span className="format-hint">💡 Content is automatically formatted and genre-detected as you type</span>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <Link to="/poems" className="btn btn-outline">
                  Cancel
                </Link>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading || !formData.title.trim() || !formData.content.trim()}
                >
                  {loading ? 'Uploading...' : 'Upload Poem'}
                </button>
              </div>

              {message && (
                <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
                  {message}
                </div>
              )}
            </form>
          </div>

          <div className="upload-tips">
            <h3>Writing Tips</h3>
            <div className="tips-list">
              <div className="tip-item">
                <span className="tip-icon">💡</span>
                <div className="tip-content">
                  <h4>Be Authentic</h4>
                  <p>Write from your heart and share your genuine emotions and experiences.</p>
                </div>
              </div>
              <div className="tip-item">
                <span className="tip-icon">🎨</span>
                <div className="tip-content">
                  <h4>Use Imagery</h4>
                  <p>Paint pictures with words using vivid descriptions and metaphors.</p>
                </div>
              </div>
              <div className="tip-item">
                <span className="tip-icon">📝</span>
                <div className="tip-content">
                  <h4>Edit Carefully</h4>
                  <p>Read your poem aloud and revise for rhythm, flow, and clarity.</p>
                </div>
              </div>
              <div className="tip-item">
                <span className="tip-icon">🏷️</span>
                <div className="tip-content">
                  <h4>Add Tags</h4>
                  <p>Use relevant tags to help readers find your poem easily.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
