import React, { useState, useEffect, useRef } from 'react';
import { firestoreService } from '../firebase/firestore.js';

const StoryReader = ({ story, onClose }) => {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const contentRef = useRef(null);

  useEffect(() => {
    loadStoryChapters();
  }, [story]);

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

  const loadStoryChapters = async () => {
    try {
      setLoading(true);
      if (story.chapters && story.chapters.length > 0) {
        setChapters(story.chapters);
      } else {
        // If no chapters, create a single chapter from the story content
        setChapters([{
          chapterNumber: 1,
          title: story.title || 'Chapter 1',
          content: story.content || '',
          createdAt: story.createdAt || new Date().toISOString()
        }]);
      }
    } catch (error) {
      console.error('Error loading story chapters:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

  if (loading) {
    return (
      <div className="story-reader-overlay">
        <div className="story-reader">
          <div className="loading-container">
            <div className="loading-spinner">Loading story...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="story-reader-overlay" onClick={onClose}>
      <div className="story-reader" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={`story-reader-header ${!isHeaderVisible ? 'header-hidden' : ''}`}>
          <div className="story-reader-header-left">
            <button 
              className="story-reader-back-btn"
              onClick={onClose}
              title="Go back"
            >
              ←
            </button>
            <div className="story-reader-title">
              <h2>{story.title || 'Untitled Story'}</h2>
              <div className="story-reader-meta">
                <span className="story-author">
                  by {story.author || 'Unknown Author'}
                </span>
                <span className="story-date">
                  {formatRelativeTime(story.createdAt)}
                </span>
              </div>
            </div>
          </div>
          <button 
            className="story-reader-close-btn"
            onClick={onClose}
            title="Close story"
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

        {/* Story Content */}
        <div className="story-reader-content" ref={contentRef}>
          <div className="story-reader-chapter">
            <h3 className="chapter-title">
              {chapters.length > 1 ? (chapters[currentChapter]?.title || `Chapter ${currentChapter + 1}`) : ''}
            </h3>
            <div className="chapter-content">
              <pre className="chapter-text">
                {chapters[currentChapter]?.content || 'No content available'}
              </pre>
            </div>
            
            {/* Chapter Navigation at Bottom */}
            {chapters.length > 1 && (
              <div className="chapter-nav-bottom">
                <div className="chapter-nav">
                  <button
                    className="chapter-nav-btn"
                    onClick={() => setCurrentChapter(Math.max(0, currentChapter - 1))}
                    disabled={currentChapter === 0}
                  >
                    ← Previous Chapter
                  </button>
                  <span className="chapter-indicator">
                    Chapter {currentChapter + 1} of {chapters.length}
                  </span>
                  <button
                    className="chapter-nav-btn"
                    onClick={() => setCurrentChapter(Math.min(chapters.length - 1, currentChapter + 1))}
                    disabled={currentChapter === chapters.length - 1}
                  >
                    Next Chapter →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="story-reader-footer">
          <div className="story-reader-stats">
            <span className="story-views">👁️ {story.views || 0} views</span>
            <span className="story-likes">❤️ {story.likes || 0} likes</span>
            {chapters.length > 1 && (
              <span className="story-chapters">📚 {chapters.length} chapters</span>
            )}
          </div>
          <div className="story-reader-tags">
            {(story.tags || []).map(tag => (
              <span key={tag} className="story-tag">#{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryReader;
