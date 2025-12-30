import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { firestoreService } from '../firebase/firestore.js';

const Comment = ({ comment, onUpdate, depth = 0, maxDepth = 10 }) => {
  const { user, canLike } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleLike = async () => {
    if (!canLike()) {
      alert('Please login to like comments');
      return;
    }

    try {
      const result = await firestoreService.comments.toggleLike(comment.id, user.uid);
      if (result.success) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setIsSubmitting(true);
    try {
      const result = await firestoreService.comments.createReply(comment.id, {
        poemId: comment.poemId,
        content: replyText.trim(),
        author: user.name,
        authorId: user.uid
      });

      if (result.success) {
        setReplyText('');
        setShowReplyForm(false);
        onUpdate();
      }
    } catch (error) {
      console.error('Error creating reply:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!editText.trim()) return;

    setIsSubmitting(true);
    try {
      const result = await firestoreService.comments.update(comment.id, {
        content: editText.trim(),
        updatedAt: new Date().toISOString()
      });

      if (result.success) {
        setIsEditing(false);
        onUpdate();
      }
    } catch (error) {
      console.error('Error updating comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    setIsDeleting(true);
    try {
      const result = await firestoreService.comments.delete(comment.id);
      if (result.success) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Check if user can edit/delete this comment
  const canEdit = user && (user.uid === comment.authorId || user.role === 'admin');
  const canDelete = user && (user.uid === comment.authorId || user.role === 'admin');

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMenu && !event.target.closest('.comment-menu')) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showMenu]);

  const isLiked = user && comment.likedBy && comment.likedBy[user.uid];

  return (
    <div className="comment">
      <div className="comment-header">
        <div className="comment-author">
          <span className="author-avatar">{comment.author.charAt(0)}</span>
          <div className="author-info">
            <span className="author-name">{comment.author}</span>
            <span className="comment-date">{formatDate(comment.createdAt)}</span>
          </div>
        </div>
        
        {/* Three-dot menu */}
        {(canEdit || canDelete) && (
          <div className="comment-menu">
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
                {canEdit && !isEditing && (
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
                )}
                {canDelete && (
                  <button 
                    className="menu-item delete-item"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete();
                      setShowMenu(false);
                    }}
                  >
                    🗑️ Delete
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="comment-content">
        {isEditing ? (
          <form onSubmit={handleEdit} className="edit-form">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="edit-input"
              rows="3"
              required
            />
            <div className="edit-actions">
              <button 
                type="submit" 
                className="btn btn-primary btn-sm"
                disabled={isSubmitting || !editText.trim()}
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </button>
              <button 
                type="button" 
                className="btn btn-outline btn-sm"
                onClick={() => {
                  setIsEditing(false);
                  setEditText(comment.content);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <p>{comment.content}</p>
        )}
      </div>
      
      <div className="comment-actions">
        <button 
          className={`like-btn ${isLiked ? 'liked' : ''}`}
          onClick={handleLike}
          disabled={!canLike()}
        >
          <span className="like-icon">{isLiked ? '❤️' : '🤍'}</span>
          <span className="like-count">{comment.likes || 0}</span>
        </button>
        
        {user && depth < maxDepth && (
          <button 
            className="reply-btn"
            onClick={() => setShowReplyForm(!showReplyForm)}
          >
            💬 Reply
          </button>
        )}
      </div>

      {/* Reply Form */}
      {showReplyForm && user && (
        <form className="reply-form" onSubmit={handleReply}>
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
            className="reply-input"
            rows="2"
            required
          />
          <div className="reply-actions">
            <button 
              type="submit" 
              className="btn btn-primary btn-sm"
              disabled={isSubmitting || !replyText.trim()}
            >
              {isSubmitting ? 'Posting...' : 'Post Reply'}
            </button>
            <button 
              type="button" 
              className="btn btn-outline btn-sm"
              onClick={() => {
                setShowReplyForm(false);
                setReplyText('');
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="replies">
          {comment.replies.map(reply => (
            <Comment 
              key={reply.id} 
              comment={reply} 
              onUpdate={onUpdate}
              depth={depth + 1}
              maxDepth={maxDepth}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;
