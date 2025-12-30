import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { firestoreService } from '../firebase/firestore.js';
import Comment from './Comment';

const CommentsSection = ({ poemId, onCommentAdded, isModal = false }) => {
  const { user, isGuest } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadComments();
  }, [poemId]);

  const loadComments = async () => {
    try {
      const result = await firestoreService.comments.getByPoemId(poemId);
      if (result.success) {
        setComments(result.data);
      }
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const result = await firestoreService.comments.create({
        poemId,
        content: newComment.trim(),
        author: user.name,
        authorId: user.uid
      });

      if (result.success) {
        setNewComment('');
        loadComments(); // Reload comments
        if (onCommentAdded) {
          onCommentAdded(); // Update comment count in parent
        }
      }
    } catch (error) {
      console.error('Error creating comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="comments-section">
        <div className="loading">Loading comments...</div>
      </div>
    );
  }

  return (
    <div className={`comments-section ${isModal ? 'comments-modal-content' : ''}`}>
      {!isModal && (
        <h3 className="comments-title">
          💬 Comments ({comments.length})
        </h3>
      )}

      {/* Comments List - Show First */}
      <div className="comments-list">
        {comments.length === 0 ? (
          <div className="no-comments">
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map(comment => (
            <Comment 
              key={comment.id} 
              comment={comment} 
              onUpdate={() => {
                loadComments();
                if (onCommentAdded) {
                  onCommentAdded();
                }
              }}
            />
          ))
        )}
      </div>

      {/* Comment Form - At the Bottom */}
      {!isGuest() && (
        <form className="comment-form" onSubmit={handleSubmitComment}>
          <div className="comment-input-group">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="comment-input"
              rows="3"
              required
            />
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting || !newComment.trim()}
            >
              {isSubmitting ? 'Posting...' : 'Comment'}
            </button>
          </div>
        </form>
      )}

      {/* Login Prompt for Guests */}
      {isGuest() && (
        <div className="login-prompt">
          <p>Please <a href="/login">login</a> to comment on poems.</p>
        </div>
      )}
    </div>
  );
};

export default CommentsSection;
