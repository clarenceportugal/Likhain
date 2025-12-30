import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { firestoreService } from '../firebase/firestore.js';
import PoetryCard from '../components/PoetryCard';
import PoemReader from '../components/PoemReader';
import ShareModal from '../components/ShareModal';
import { Link } from 'react-router-dom';

const PoemsPage = () => {
  const { user, isGuest, canLike } = useAuth();
  const [poems, setPoems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');
  const [selectedPoem, setSelectedPoem] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [poemToShare, setPoemToShare] = useState(null);

  useEffect(() => {
    loadPoems();
  }, []);

  const loadPoems = async () => {
    try {
      const result = await firestoreService.poems.getAll();
      
      if (result.success && result.data && result.data.length > 0) {
        // Remove duplicates based on ID and content
        const uniquePoems = result.data.filter((poem, index, self) => 
          index === self.findIndex(p => 
            p.id === poem.id || 
            (p.title === poem.title && p.author === poem.author && p.content === poem.content)
          )
        );
        setPoems(uniquePoems);
      } else {
        // Only use mock data if no poems exist in database
        setPoems(getMockPoems());
      }
    } catch (error) {
      console.error('Error loading poems:', error);
      // Only use mock data if there's an error
      setPoems(getMockPoems());
    } finally {
      setLoading(false);
    }
  };

  const getMockPoems = () => [
    {
      id: 1,
      title: "Mga Tala ng Puso",
      content: "Sa bawat pagtibok ng puso,\nMay mga tala na sumisilip,\nMga pangarap na hindi pa natutupad,\nMga pag-asa na patuloy na lumalago.\n\nSa bawat paghinga,\nMay bagong pag-asa,\nSa bawat pagbangon,\nMay bagong lakas.",
      author: "Maria Santos",
      authorId: "sample_user_1",
      authorProfileImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM4QjQ1MTMiLz4KPHN2ZyB4PSIxMCIgeT0iMTAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDOC42ODYyOSAxNCA2IDE2LjY4NjMgNiAyMEgxOEMxOCAxNi42ODYzIDE1LjMxMzcgMTQgMTIgMTRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+",
      likes: 15,
      likedBy: ["sample_user_2", "sample_user_3"],
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
      tags: ["love", "hope", "filipino", "emotions"]
    },
    {
      id: 2,
      title: "Dahon sa Hangin",
      content: "Tulad ng dahon na sumasayaw sa hangin,\nAko'y naglalakbay sa buhay na walang tiyak na patutunguhan,\nNgunit sa bawat pag-ikot,\nMay bagong pag-asa na sumisilip.\n\nSa bawat pagbagsak,\nMay bagong pag-ahon,\nSa bawat pag-ikot,\nMay bagong direksyon.",
      author: "Juan Dela Cruz",
      authorId: "sample_user_2",
      authorProfileImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNBMDUyMkQiLz4KPHN2ZyB4PSIxMCIgeT0iMTAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDOC42ODYyOSAxNCA2IDE2LjY4NjMgNiAyMEgxOEMxOCAxNi42ODYzIDE1LjMxMzcgMTQgMTIgMTRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+",
      likes: 8,
      likedBy: ["sample_user_1"],
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-10'),
      tags: ["nature", "journey", "life", "filipino"]
    },
    {
      id: 3,
      title: "Mga Salita",
      content: "Ang mga salita ay tulad ng mga bituin,\nNagliliwanag sa kadiliman ng gabi,\nNagbibigay ng liwanag sa mga puso,\nNa puno ng lungkot at pighati.\n\nSa bawat salita,\nMay kapangyarihan,\nSa bawat tula,\nMay pag-asa.",
      author: "Ana Reyes",
      authorId: "sample_user_3",
      authorProfileImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM2NTQzMjEiLz4KPHN2ZyB4PSIxMCIgeT0iMTAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDOC42ODYyOSAxNCA2IDE2LjY4NjMgNiAyMEgxOEMxOCAxNi42ODYzIDE1LjMxMzcgMTQgMTIgMTRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+",
      likes: 23,
      likedBy: ["sample_user_1", "sample_user_2", "sample_user_4"],
      createdAt: new Date('2024-01-08'),
      updatedAt: new Date('2024-01-08'),
      tags: ["words", "light", "hope", "filipino"]
    },
    {
      id: 4,
      title: "Silent Whispers",
      content: "In the quiet of the night,\nWhispers dance in moonlight,\nSecrets shared with stars above,\nTales of hope and endless love.\n\nIn the silence,\nVoices speak,\nIn the darkness,\nLight we seek.",
      author: "Michael Johnson",
      authorId: "sample_user_4",
      authorProfileImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM4QjlEQzMiLz4KPHN2ZyB4PSIxMCIgeT0iMTAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDOC42ODYyOSAxNCA2IDE2LjY4NjMgNiAyMEgxOEMxOCAxNi42ODYzIDE1LjMxMzcgMTQgMTIgMTRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+",
      likes: 12,
      likedBy: ["sample_user_1", "sample_user_3"],
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-05'),
      tags: ["night", "whispers", "love", "english"]
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

  const handleShare = (poem) => {
    setPoemToShare(poem);
    setShowShareModal(true);
  };

  const filteredAndSortedPoems = poems
    .filter(poem => {
      const matchesSearch = poem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           poem.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           poem.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (poem.tags && poem.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
      
      const matchesFilter = filterBy === 'all' || 
                           (filterBy === 'filipino' && poem.tags && poem.tags.includes('filipino')) ||
                           (filterBy === 'english' && poem.tags && poem.tags.includes('english')) ||
                           (filterBy === 'popular' && poem.likes >= 10);
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'most_liked':
          return (b.likes || 0) - (a.likes || 0);
        case 'least_liked':
          return (a.likes || 0) - (b.likes || 0);
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'most_liked', label: 'Most Liked' },
    { value: 'least_liked', label: 'Least Liked' },
    { value: 'alphabetical', label: 'A-Z' }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Poems' },
    { value: 'filipino', label: 'Filipino' },
    { value: 'english', label: 'English' },
    { value: 'popular', label: 'Popular (10+ likes)' }
  ];

  if (loading) {
    return (
      <div className="poems-page">
        <div className="page-container">
          <div className="loading-container">
            <div className="loading-spinner">Loading poems...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="poems-page">
      <div className="page-container">
        {/* Header Section */}
        <div className="poems-header">
          <div className="header-content">
            <h1 className="page-title">Poetry Collection</h1>
            <p className="page-subtitle">
              Discover beautiful poetry from our talented community of writers
            </p>
          </div>
          
          {/* Search and Filter Controls */}
          <div className="poems-controls">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search poems, authors, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>
            
            <div className="filter-controls">
              <div className="filter-group">
                <label htmlFor="sort-select">Sort by:</label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="filter-select"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="filter-group">
                <label htmlFor="filter-select">Filter:</label>
                <select
                  id="filter-select"
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="filter-select"
                >
                  {filterOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>


        {/* Poems Grid */}
        {filteredAndSortedPoems.length > 0 ? (
          <div className="poems-grid">
            {filteredAndSortedPoems.map((poem, index) => (
              <PoetryCard
                key={poem.id}
                poem={poem}
                onLike={handleLike}
                canLike={canLike()}
                onClick={() => setSelectedPoem(poem)}
                onShare={handleShare}
                onEdit={() => loadPoems()}
                onDelete={() => loadPoems()}
                style={{ animationDelay: `${index * 0.1}s` }}
              />
            ))}
          </div>
        ) : (
          <div className="no-poems">
            <div className="no-poems-icon">📝</div>
            <h3>No poems found</h3>
            <p>Try adjusting your search or filter criteria</p>
            {isGuest() && (
              <Link to="/" className="btn btn-primary">
                Join to Share Poetry
              </Link>
            )}
          </div>
        )}

        {/* Call to Action */}
        {!isGuest() && (
          <section className="poems-cta">
            <div className="cta-content">
              <h3>Share Your Poetry</h3>
              <p>Have a poem you'd like to share with the community?</p>
              <Link to="/upload" className="btn btn-primary">
                Upload Your Poem
              </Link>
            </div>
          </section>
        )}
      </div>
      
      {/* Poem Reader Modal */}
      {selectedPoem && (
        <PoemReader 
          poem={selectedPoem} 
          onClose={() => setSelectedPoem(null)} 
        />
      )}
      
      {/* Share Modal */}
      {showShareModal && poemToShare && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => {
            setShowShareModal(false);
            setPoemToShare(null);
          }}
          content={poemToShare}
          type="poem"
        />
      )}
    </div>
  );
};

export default PoemsPage;
