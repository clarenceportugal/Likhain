import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { firestoreService } from '../firebase/firestore.js';
import PoetryCard from './PoetryCard';

const PoetryList = () => {
  const [poems, setPoems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { canLike, user } = useAuth();

  useEffect(() => {
    loadPoems();
  }, []);

  const loadPoems = async () => {
    try {
      const result = await firestoreService.poems.getAll();
      if (result.success) {
        setPoems(result.data);
      } else {
        console.error('Error loading poems:', result.error);
        // Fallback to mock data if Firebase fails
        setPoems(getMockPoems());
      }
    } catch (error) {
      console.error('Error loading poems:', error);
      setPoems(getMockPoems());
    } finally {
      setLoading(false);
    }
  };

  const getMockPoems = () => [
    {
      id: 1,
      title: "Mga Tala ng Puso",
      content: "Sa bawat pagtibok ng puso,\nMay mga tala na sumisilip,\nMga pangarap na hindi pa natutupad,\nMga pag-asa na patuloy na lumalago.",
      author: "Maria Santos",
      likes: 15,
      createdAt: new Date('2024-01-15'),
      isLiked: false
    },
    {
      id: 2,
      title: "Dahon sa Hangin",
      content: "Tulad ng dahon na sumasayaw sa hangin,\nAko'y naglalakbay sa buhay na walang tiyak na patutunguhan,\nNgunit sa bawat pag-ikot,\nMay bagong pag-asa na sumisilip.",
      author: "Juan Dela Cruz",
      likes: 8,
      createdAt: new Date('2024-01-10'),
      isLiked: true
    },
    {
      id: 3,
      title: "Mga Salita",
      content: "Ang mga salita ay tulad ng mga bituin,\nNagliliwanag sa kadiliman ng gabi,\nNagbibigay ng liwanag sa mga puso,\nNa puno ng lungkot at pighati.",
      author: "Ana Reyes",
      likes: 23,
      createdAt: new Date('2024-01-08'),
      isLiked: false
    }
  ];

  const handleLike = async (poemId) => {
    if (!canLike()) {
      alert('Please login to like poems');
      return;
    }

    try {
      const result = await firestoreService.poems.toggleLike(poemId, user.uid);
      if (result.success) {
        setPoems(prevPoems =>
          prevPoems.map(poem =>
            poem.id === poemId
              ? {
                  ...poem,
                  isLiked: result.isLiked,
                  likes: result.likes
                }
              : poem
          )
        );
      }
    } catch (error) {
      console.error('Error liking poem:', error);
    }
  };

  if (loading) {
    return (
      <div className="poetry-list loading">
        <div className="loading-spinner">Loading poems...</div>
      </div>
    );
  }

  return (
    <div className="poetry-list">
      <h2>Recent Poems</h2>
      <div className="poems-grid">
        {poems.map(poem => (
          <PoetryCard
            key={poem.id}
            poem={poem}
            onLike={handleLike}
            canLike={canLike()}
          />
        ))}
      </div>
    </div>
  );
};

export default PoetryList;
