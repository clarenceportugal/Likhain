import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { firestoreService } from '../firebase/firestore.js';
import PoemReader from '../components/PoemReader';

const PoemViewPage = () => {
  const { poemId } = useParams();
  const navigate = useNavigate();
  const { user, isGuest } = useAuth();
  const [poem, setPoem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPoem();
  }, [poemId]);

  const loadPoem = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('PoemViewPage - Loading poem with ID:', poemId);
      
      // Try to get the poem by ID
      const result = await firestoreService.poems.getById(poemId);
      console.log('PoemViewPage - getById result:', result);
      
      if (result.success && result.data) {
        setPoem(result.data);
      } else {
        // If not found, try to get all poems and find by ID
        console.log('PoemViewPage - getById failed, trying getAll');
        const allPoemsResult = await firestoreService.poems.getAll();
        console.log('PoemViewPage - getAll result:', allPoemsResult);
        if (allPoemsResult.success) {
          const foundPoem = allPoemsResult.data.find(p => p.id === poemId);
          console.log('PoemViewPage - Found poem:', foundPoem);
          if (foundPoem) {
            setPoem(foundPoem);
          } else {
            console.log('PoemViewPage - Poem not found in getAll results');
            setError('Poem not found');
          }
        } else {
          setError('Failed to load poem');
        }
      }
    } catch (error) {
      console.error('Error loading poem:', error);
      setError('Failed to load poem');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigate('/poems');
  };

  if (loading) {
    return (
      <div className="poem-view-page">
        <div className="loading-container">
          <div className="loading-spinner">Loading poem...</div>
        </div>
      </div>
    );
  }

  if (error || !poem) {
    return (
      <div className="poem-view-page">
        <div className="error-container">
          <div className="error-icon">📝</div>
          <h2>Poem Not Found</h2>
          <p>The poem you're looking for doesn't exist or has been removed.</p>
          <button className="btn btn-primary" onClick={() => navigate('/poems')}>
            Browse Poems
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="poem-view-page">
      <PoemReader poem={poem} onClose={handleClose} />
    </div>
  );
};

export default PoemViewPage;
