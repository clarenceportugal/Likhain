import React, { useState, useEffect } from 'react';
import CommentsSection from './CommentsSection';
import { firestoreService } from '../firebase/firestore.js';
import { useAuth } from '../context/AuthContext';

const PoetryCard = ({ poem, onLike, canLike, onClick, onShare, onEdit, onDelete }) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: poem.title,
    content: poem.content,
    tags: poem.tags?.join(', ') || ''
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    loadCommentCount();
  }, [poem.id]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMenu && !event.target.closest('.poetry-menu')) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showMenu]);

  const loadCommentCount = async () => {
    try {
      const result = await firestoreService.comments.getByPoemId(poem.id);
      if (result.success) {
        setCommentCount(result.data.length);
      }
    } catch (error) {
      console.error('Error loading comment count:', error);
    }
  };

  const handleEdit = async (e) => {
    e.stopPropagation();
    if (!editData.title.trim() || !editData.content.trim()) return;

    try {
      const result = await firestoreService.poems.update(poem.id, {
        title: editData.title.trim(),
        content: editData.content.trim(),
        tags: editData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        updatedAt: new Date().toISOString()
      });

      if (result.success) {
        setIsEditing(false);
        if (onEdit) onEdit();
      }
    } catch (error) {
      console.error('Error updating poem:', error);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this poem?')) return;

    setIsDeleting(true);
    try {
      const result = await firestoreService.poems.delete(poem.id);
      if (result.success && onDelete) {
        onDelete();
      }
    } catch (error) {
      console.error('Error deleting poem:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Check if user can edit/delete this poem
  const canEdit = user && (user.uid === poem.authorId || user.role === 'admin');
  const canDelete = user && (user.uid === poem.authorId || user.role === 'admin');

  // Check if poem content is long enough to need "See more"
  const isLongContent = poem.content && poem.content.length > 200;
  const maxPreviewLength = 200;
  
  const getDisplayContent = () => {
    if (!poem.content) return '';
    if (!isLongContent || isExpanded) return poem.content;
    return poem.content.substring(0, maxPreviewLength) + '...';
  };

  const formatRelativeTime = (date) => {
    const now = new Date();
    const uploadDate = new Date(date);
    const diffInSeconds = Math.floor((now - uploadDate) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      return uploadDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: uploadDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };


  return (
    <div className="poetry-card" onClick={onClick}>
      <div className="poetry-header">
        <div className="poetry-header-top">
          <h3 className="poetry-title">{poem.title}</h3>
          
          {/* Three-dot menu */}
          {canEdit && (
            <div className="poetry-menu">
              <button 
                className="menu-trigger"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                title="More options"
              >
                ⋯
              </button>
              
              {showMenu && (
                <div className="menu-dropdown">
                  <button 
                    className="menu-item edit-item"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditing(true);
                      setShowMenu(false);
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    className="menu-item delete-item"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(e);
                      setShowMenu(false);
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="poetry-author-meta">
          <span className="poetry-author">
            by 
            <div className="poetry-author-avatar">
              {poem.authorProfileImage ? (
                <img 
                  src={poem.authorProfileImage} 
                  alt={poem.author}
                  className="author-profile-img"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'inline';
                  }}
                />
              ) : null}
              <span 
                className="author-initials" 
                style={{ display: poem.authorProfileImage ? 'none' : 'inline' }}
              >
                {poem.author.charAt(0)}
              </span>
            </div>
            {poem.author}
          </span>
          <span className="poetry-time">{formatRelativeTime(poem.createdAt)}</span>
        </div>
      </div>
      
      <div className="poetry-content">
        {isEditing ? (
          <div className="edit-form">
            <input
              type="text"
              value={editData.title}
              onChange={(e) => setEditData({...editData, title: e.target.value})}
              className="edit-title-input"
              placeholder="Poem title"
              onClick={(e) => e.stopPropagation()}
            />
            <textarea
              value={editData.content}
              onChange={(e) => setEditData({...editData, content: e.target.value})}
              className="edit-content-input"
              placeholder="Poem content"
              rows="8"
              onClick={(e) => e.stopPropagation()}
            />
            <input
              type="text"
              value={editData.tags}
              onChange={(e) => setEditData({...editData, tags: e.target.value})}
              className="edit-tags-input"
              placeholder="Tags (comma separated)"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="edit-actions">
              <button 
                type="button" 
                className="btn btn-primary btn-sm"
                onClick={handleEdit}
                disabled={!editData.title.trim() || !editData.content.trim()}
              >
                Save
              </button>
              <button 
                type="button" 
                className="btn btn-outline btn-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(false);
                  setEditData({
                    title: poem.title,
                    content: poem.content,
                    tags: poem.tags?.join(', ') || ''
                  });
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="poetry-text-container">
            <pre className="poetry-text">{getDisplayContent()}</pre>
            {isLongContent && (
              <button 
                className="see-more-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
              >
                {isExpanded ? 'See less' : 'See more'}
              </button>
            )}
          </div>
        )}
      </div>
      
      <div className="poetry-footer">
        <div className="poetry-actions">
                  <button
                    className={`action-btn like-btn ${poem.isLiked ? 'liked' : ''} ${!canLike ? 'disabled' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onLike(poem.id);
                    }}
                    disabled={!canLike}
                    title={!canLike ? 'Login to like poems' : ''}
                  >
            <span className="action-icon">❤️</span>
            <span className="action-text">Like</span>
            {poem.likes > 0 && <span className="action-count">{poem.likes}</span>}
          </button>
          
                  <button
                    className="action-btn comments-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowComments(!showComments);
                    }}
                    title="View comments"
                  >
            <span className="action-icon">💬</span>
            <span className="action-text">Comment</span>
            {commentCount > 0 && <span className="action-count">{commentCount}</span>}
          </button>
          
                  <button
                    className="action-btn share-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onShare(poem);
                    }}
                    title="Share this poem"
                  >
            <span className="action-icon">📤</span>
            <span className="action-text">Share</span>
          </button>
        </div>
      </div>
      
      
      {showComments && (
        <div className="comments-modal-overlay" onClick={() => setShowComments(false)}>
          <div className="comments-modal" onClick={(e) => e.stopPropagation()}>
            <div className="comments-modal-header">
              <div className="comments-header-left">
                <button 
                  className="comments-back-btn"
                  onClick={() => setShowComments(false)}
                  title="Go back"
                >
                  ←
                </button>
                <h3 className="comments-modal-title">
                  💬 Comments ({commentCount})
                </h3>
              </div>
              <button 
                className="comments-close-btn"
                onClick={() => setShowComments(false)}
                title="Close comments"
              >
                ✕
              </button>
            </div>
            <CommentsSection 
              poemId={poem.id} 
              onCommentAdded={loadCommentCount}
              isModal={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PoetryCard;
