import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { firestoreService } from '../firebase/firestore.js';
import StoryReader from '../components/StoryReader';

const StoryViewPage = () => {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const { user, isGuest } = useAuth();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStory();
  }, [storyId]);

  const loadStory = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('StoryViewPage - Loading story with ID:', storyId);
      
      // Try to get the story by ID
      const result = await firestoreService.stories.getById(storyId);
      console.log('StoryViewPage - getById result:', result);
      
      if (result.success && result.data) {
        setStory(result.data);
      } else {
        // If not found, try to get all stories and find by ID
        console.log('StoryViewPage - getById failed, trying getAll');
        const allStoriesResult = await firestoreService.stories.getAll();
        console.log('StoryViewPage - getAll result:', allStoriesResult);
        if (allStoriesResult.success) {
          const foundStory = allStoriesResult.data.find(s => s.id === storyId);
          console.log('StoryViewPage - Found story:', foundStory);
          if (foundStory) {
            setStory(foundStory);
          } else {
            console.log('StoryViewPage - Story not found in getAll results');
            setError('Story not found');
          }
        } else {
          setError('Failed to load story');
        }
      }
    } catch (error) {
      console.error('Error loading story:', error);
      setError('Failed to load story');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigate('/stories');
  };

  if (loading) {
    return (
      <div className="story-view-page">
        <div className="loading-container">
          <div className="loading-spinner">Loading story...</div>
        </div>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="story-view-page">
        <div className="error-container">
          <div className="error-icon">📚</div>
          <h2>Story Not Found</h2>
          <p>The story you're looking for doesn't exist or has been removed.</p>
          <button className="btn btn-primary" onClick={() => navigate('/stories')}>
            Browse Stories
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="story-view-page">
      <StoryReader story={story} onClose={handleClose} />
    </div>
  );
};

export default StoryViewPage;
