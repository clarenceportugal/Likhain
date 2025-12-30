import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import CommentsSection from './CommentsSection';

const PoemReader = ({ poem, onClose }) => {
  const { user, isGuest } = useAuth();
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const contentRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = contentRef.current?.scrollTop || 0;
      
      // Hide header when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsHeaderVisible(false);
      } else if (currentScrollY < lastScrollY || currentScrollY <= 50) {
        setIsHeaderVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll, { passive: true });
      return () => contentElement.removeEventListener('scroll', handleScroll);
    }
  }, [lastScrollY]);

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
    <div className="poem-reader-overlay" onClick={onClose}>
      <div className="poem-reader" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={`poem-reader-header ${!isHeaderVisible ? 'header-hidden' : ''}`}>
          <div className="poem-reader-header-left">
            <button 
              className="poem-reader-back-btn"
              onClick={onClose}
              title="Go back"
            >
              ←
            </button>
            <div className="poem-reader-title">
              <h2>{poem.title || 'Untitled Poem'}</h2>
              <div className="poem-reader-meta">
                <span className="poem-author">
                  by 
                  <div className="poem-author-avatar">
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
                      {(poem.author || 'U').charAt(0)}
                    </span>
                  </div>
                  {poem.author || 'Unknown Author'}
                </span>
                <span className="poem-date">{poem.createdAt ? formatRelativeTime(poem.createdAt) : 'Unknown date'}</span>
              </div>
            </div>
          </div>
          <button 
            className="poem-reader-close-btn"
            onClick={onClose}
            title="Close poem"
          >
            ✕
          </button>
        </div>

        {/* Scroll Indicator */}
        {!isHeaderVisible && (
          <div className="scroll-indicator">
            <div className="scroll-indicator-content">
              <span>↑ Scroll up to show header</span>
            </div>
          </div>
        )}

        {/* Poem Content */}
        <div className="poem-reader-content" ref={contentRef}>
          <div className="poem-reader-poem">
            <div className="poem-content">
              <div className="poem-text">
                {(poem.content || 'No content available').split('\n').map((line, index) => (
                  <div key={index} className="poem-line">
                    {line || '\u00A0'}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Poem Stats */}
            <div className="poem-reader-stats">
              <span>❤️ {poem.likes || 0} likes</span>
              <span>💬 Comments</span>
              {(poem.tags || []).map(tag => (
                <span key={tag} className="poem-tag">#{tag}</span>
              ))}
            </div>
          </div>

          {/* Comments Section */}
          <div className="poem-reader-comments">
            <CommentsSection 
              poemId={poem.id} 
              isModal={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoemReader;
