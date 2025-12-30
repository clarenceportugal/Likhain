import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { firestoreService } from '../firebase/firestore.js';
import { Link } from 'react-router-dom';
import StoryReader from '../components/StoryReader';
import ShareModal from '../components/ShareModal';

const StoriesPage = () => {
  const { user, isGuest } = useAuth();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'my-stories'
  const [selectedStory, setSelectedStory] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [storyToShare, setStoryToShare] = useState(null);
  const [showMenuForStory, setShowMenuForStory] = useState(null);

  useEffect(() => {
    loadStories();
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMenuForStory && !event.target.closest('.story-menu')) {
        setShowMenuForStory(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showMenuForStory]);

  const loadStories = async () => {
    try {
      console.log('Loading stories from database...');
      const result = await firestoreService.stories.getAll();
      console.log('Stories result:', result);
      
      if (result.success && result.data && result.data.length > 0) {
        console.log('Found stories in database:', result.data.length);
        setStories(result.data);
      } else {
        console.log('No stories found in database, using mock data');
        console.error('Error loading stories:', result.error);
        // Fallback to mock data
        setStories(getMockStories());
      }
    } catch (error) {
      console.error('Error loading stories:', error);
      console.log('Using mock data due to error');
      setStories(getMockStories());
    } finally {
      setLoading(false);
    }
  };

  const getMockStories = () => [
        {
          id: 1,
          title: "The Journey of a Poet",
          excerpt: "Discover how Maria Santos found her voice through poetry and became one of our most beloved writers. Her journey from a shy beginner to a confident poet is truly inspiring.",
          content: "Maria Santos never thought she would become a poet. Growing up in a small town in the Philippines, she was always quiet and reserved. But when she discovered poetry, everything changed...",
          author: "Likhain Team",
          authorId: "team_1",
          authorProfileImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM4QjQ1MTMiLz4KPHN2ZyB4PSIxMCIgeT0iMTAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDOC42ODYyOSAxNCA2IDE2LjY4NjMgNiAyMEgxOEMxOCAxNi42ODYzIDE1LjMxMzcgMTQgMTIgMTRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+",
          authorProfileImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM4QjQ1MTMiLz4KPHN2ZyB4PSIxMCIgeT0iMTAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDOC42ODYyOSAxNCA2IDE2LjY4NjMgNiAyMEgxOEMxOCAxNi42ODYzIDE1LjMxMzcgMTQgMTIgMTRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+",
          category: "inspiration",
          readTime: "5 min read",
          views: 1250,
          likes: 89,
          createdAt: new Date('2024-01-15'),
          featured: true,
          tags: ["poetry", "journey", "inspiration", "beginner"]
        },
        {
          id: 2,
          title: "Poetry Across Cultures",
          excerpt: "Explore how different cultures express emotions and stories through the beautiful art of poetry. From haikus to sonnets, discover the diversity of poetic expression.",
          content: "Poetry is a universal language that transcends borders and cultures. Each culture brings its own unique perspective and style to this beautiful art form...",
          author: "Likhain Team",
          authorId: "team_1",
          authorProfileImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM4QjQ1MTMiLz4KPHN2ZyB4PSIxMCIgeT0iMTAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDOC42ODYyOSAxNCA2IDE2LjY4NjMgNiAyMEgxOEMxOCAxNi42ODYzIDE1LjMxMzcgMTQgMTIgMTRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+",
          authorProfileImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM4QjQ1MTMiLz4KPHN2ZyB4PSIxMCIgeT0iMTAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDOC42ODYyOSAxNCA2IDE2LjY4NjMgNiAyMEgxOEMxOCAxNi42ODYzIDE1LjMxMzcgMTQgMTIgMTRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+",
          category: "culture",
          readTime: "7 min read",
          views: 980,
          likes: 67,
          createdAt: new Date('2024-01-10'),
          featured: false,
          tags: ["culture", "diversity", "global", "traditions"]
        },
        {
          id: 3,
          title: "Finding Inspiration in Everyday Moments",
          excerpt: "Learn how our community members find inspiration in everyday moments to create meaningful poetry. Sometimes the most profound poems come from the simplest experiences.",
          content: "Inspiration can strike at any moment. It might be in the way sunlight filters through leaves, or in the sound of rain on a window...",
          author: "Likhain Team",
          authorId: "team_1",
          authorProfileImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM4QjQ1MTMiLz4KPHN2ZyB4PSIxMCIgeT0iMTAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDOC42ODYyOSAxNCA2IDE2LjY4NjMgNiAyMEgxOEMxOCAxNi42ODYzIDE1LjMxMzcgMTQgMTIgMTRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+",
          category: "tips",
          readTime: "6 min read",
          views: 1450,
          likes: 112,
          createdAt: new Date('2024-01-08'),
          featured: true,
          tags: ["inspiration", "tips", "creativity", "mindfulness"]
        },
        {
          id: 4,
          title: "The Power of Community in Poetry",
          excerpt: "Discover how our poetry community supports and inspires each other. From feedback to collaboration, see how poets grow together.",
          content: "Poetry is often seen as a solitary art, but the truth is that poets thrive in community. Our platform brings together writers from all walks of life...",
          author: "Likhain Team",
          authorId: "team_1",
          authorProfileImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM4QjQ1MTMiLz4KPHN2ZyB4PSIxMCIgeT0iMTAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDOC42ODYyOSAxNCA2IDE2LjY4NjMgNiAyMEgxOEMxOCAxNi42ODYzIDE1LjMxMzcgMTQgMTIgMTRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+",
          category: "community",
          readTime: "8 min read",
          views: 890,
          likes: 76,
          createdAt: new Date('2024-01-05'),
          featured: false,
          tags: ["community", "support", "collaboration", "growth"]
        },
        {
          id: 5,
          title: "Digital Poetry: The Future of Verse",
          excerpt: "Explore how technology is changing the way we create, share, and experience poetry. From interactive poems to AI-assisted writing.",
          content: "The digital age has revolutionized many art forms, and poetry is no exception. New technologies are opening up exciting possibilities for poets...",
          author: "Likhain Team",
          authorId: "team_1",
          authorProfileImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM4QjQ1MTMiLz4KPHN2ZyB4PSIxMCIgeT0iMTAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDOC42ODYyOSAxNCA2IDE2LjY4NjMgNiAyMEgxOEMxOCAxNi42ODYzIDE1LjMxMzcgMTQgMTIgMTRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+",
          category: "technology",
          readTime: "9 min read",
          views: 720,
          likes: 54,
          createdAt: new Date('2024-01-03'),
          featured: false,
          tags: ["technology", "digital", "future", "innovation"]
        },
        {
          id: 6,
          title: "Mental Health and Poetry",
          excerpt: "Learn how poetry can be a powerful tool for mental health and emotional well-being. Many poets use their craft as a form of therapy.",
          content: "Poetry has long been recognized as a therapeutic tool. The act of writing and reading poetry can help process emotions and provide comfort...",
          author: "Likhain Team",
          authorId: "team_1",
          authorProfileImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM4QjQ1MTMiLz4KPHN2ZyB4PSIxMCIgeT0iMTAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDOC42ODYyOSAxNCA2IDE2LjY4NjMgNiAyMEgxOEMxOCAxNi42ODYzIDE1LjMxMzcgMTQgMTIgMTRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+",
          category: "wellness",
          readTime: "6 min read",
          views: 1100,
          likes: 95,
          createdAt: new Date('2024-01-01'),
          featured: true,
          tags: ["mental health", "therapy", "wellness", "healing"]
        }
      ];

  const categories = [
    { id: 'all', name: 'All Stories', icon: '📚' },
    { id: 'inspiration', name: 'Inspiration', icon: '✨' },
    { id: 'culture', name: 'Culture', icon: '🌍' },
    { id: 'tips', name: 'Tips & Advice', icon: '💡' },
    { id: 'community', name: 'Community', icon: '👥' },
    { id: 'technology', name: 'Technology', icon: '💻' },
    { id: 'wellness', name: 'Wellness', icon: '🧘' }
  ];

  const filteredStories = stories.filter(story => {
    // Safe access to story properties with fallbacks
    const title = story.title || '';
    const excerpt = story.excerpt || story.description || '';
    const tags = Array.isArray(story.tags) ? story.tags : [];
    const category = story.category || story.genre || 'general';
    
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || category === selectedCategory;
    
    // Filter by tab
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'my-stories' && user && story.authorId === user.uid);
    
    return matchesSearch && matchesCategory && matchesTab;
  });

  const featuredStories = stories.filter(story => story.featured || false);
  const regularStories = filteredStories.filter(story => !(story.featured || false));
  
  console.log('Total stories:', stories.length);
  console.log('Filtered stories:', filteredStories.length);
  console.log('Featured stories:', featuredStories.length);
  console.log('Regular stories:', regularStories.length);
  
  // Log sample story structure for debugging
  if (stories.length > 0) {
    console.log('Sample story structure:', stories[0]);
    console.log('Story keys:', Object.keys(stories[0]));
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleLike = async (storyId, event) => {
    event.stopPropagation(); // Prevent opening story reader
    if (isGuest()) {
      alert('Please login to like stories');
      return;
    }

    try {
      const result = await firestoreService.stories.toggleLike(storyId, user.uid);
      if (result.success) {
        // Update the story in the local state
        setStories(prevStories => 
          prevStories.map(story => 
            story.id === storyId 
              ? { 
                  ...story, 
                  likes: result.likes, 
                  isLiked: result.isLiked,
                  likedBy: result.likedBy 
                }
              : story
          )
        );
      }
    } catch (error) {
      console.error('Error liking story:', error);
    }
  };

  const handleShare = (story, event) => {
    event.stopPropagation(); // Prevent opening story reader
    console.log('StoriesPage - handleShare called with story:', story);
    console.log('StoriesPage - Story ID:', story?.id);
    console.log('StoriesPage - Story title:', story?.title);
    setStoryToShare(story);
    setShowShareModal(true);
  };

  const handleEditStory = async (storyId, updatedData) => {
    try {
      const result = await firestoreService.stories.update(storyId, {
        ...updatedData,
        updatedAt: new Date().toISOString()
      });
      
      if (result.success) {
        loadStories(); // Reload stories
      }
    } catch (error) {
      console.error('Error updating story:', error);
    }
  };

  const handleDeleteStory = async (storyId) => {
    if (!window.confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
      return;
    }

    try {
      const result = await firestoreService.stories.delete(storyId);
      if (result.success) {
        loadStories(); // Reload stories
      }
    } catch (error) {
      console.error('Error deleting story:', error);
    }
  };

  if (loading) {
    return (
      <div className="stories-page">
        <div className="page-container">
          <div className="loading-container">
            <div className="loading-spinner">Loading stories...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="stories-page">
      <div className="page-container">
        {/* Header Section */}
        <div className="stories-header">
          <div className="header-content">
            <h1 className="page-title">Community Stories</h1>
            <p className="page-subtitle">
              Discover inspiring stories, tips, and insights from our poetry community
            </p>
          </div>
          
          {/* Search and Filter */}
          <div className="stories-tabs">
            <button
              className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              📚 All Stories
            </button>
            {user && !isGuest() && (
              <button
                className={`tab-btn ${activeTab === 'my-stories' ? 'active' : ''}`}
                onClick={() => setActiveTab('my-stories')}
              >
                ✍️ My Stories
              </button>
            )}
          </div>

          <div className="stories-controls">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search stories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>
            
            <div className="category-filters">
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <span className="category-icon">{category.icon}</span>
                  <span className="category-name">{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Stories */}
        {featuredStories.length > 0 && (
          <section className="featured-stories-section">
            <h2 className="section-title">Featured Stories</h2>
            <div className="featured-stories-grid">
              {featuredStories.map((story, index) => (
                <div 
                  key={story.id} 
                  className="featured-story-card" 
                  style={{ animationDelay: `${index * 0.2}s` }}
                  onClick={() => {
                    console.log('Featured story clicked:', story);
                    setSelectedStory(story);
                  }}
                >
                  <div className="story-badge">Featured</div>
                  {story.coverImage && (
                    <div className="story-cover">
                      <img 
                        src={story.coverImage} 
                        alt={`${story.title} cover`}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                    <div className="story-content">
                      <div className="story-header-top">
                        <h3 className="story-title">{story.title || 'Untitled Story'}</h3>
                        
                        {/* Three-dot menu */}
                        {user && (user.uid === story.authorId || user.role === 'admin') && (
                          <div className="story-menu">
                            <button 
                              className="menu-trigger"
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowMenuForStory(showMenuForStory === story.id ? null : story.id);
                              }}
                              title="More options"
                            >
                              ⋯
                            </button>
                            
                            {showMenuForStory === story.id && (
                              <div className="menu-dropdown">
                                <button 
                                  className="menu-item edit-item"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // TODO: Implement story editing modal
                                    alert('Story editing will be implemented soon!');
                                    setShowMenuForStory(null);
                                  }}
                                >
                                  ✏️ Edit
                                </button>
                                <button 
                                  className="menu-item delete-item"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteStory(story.id);
                                    setShowMenuForStory(null);
                                  }}
                                >
                                  🗑️ Delete
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <p className="story-excerpt">{story.excerpt || story.description || 'No description available'}</p>
                    <div className="story-meta">
                      <div className="story-author">
                        <div className="author-avatar">
                          {story.authorProfileImage ? (
                            <img 
                              src={story.authorProfileImage} 
                              alt={story.author}
                              className="author-profile-img"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'inline';
                              }}
                            />
                          ) : null}
                          <span 
                            className="author-initials" 
                            style={{ display: story.authorProfileImage ? 'none' : 'inline' }}
                          >
                            {story.author.charAt(0)}
                          </span>
                        </div>
                        <span className="author-name">{story.author}</span>
                      </div>
                        <div className="story-stats">
                          <span className="read-time">{story.readTime || '5 min read'}</span>
                          <span className="views">👁️ {story.views || 0}</span>
                          <span className="likes">❤️ {story.likes || 0}</span>
                        </div>
                    </div>
                    <div className="story-tags">
                      {(story.tags || []).slice(0, 3).map(tag => (
                        <span key={tag} className="tag">#{tag}</span>
                      ))}
                    </div>
                    
                    {/* Story Actions */}
                    <div className="story-actions">
                      <button
                        className={`action-btn like-btn ${story.isLiked ? 'liked' : ''} ${isGuest() ? 'disabled' : ''}`}
                        onClick={(e) => handleLike(story.id, e)}
                        disabled={isGuest()}
                        title={isGuest() ? 'Login to like stories' : ''}
                      >
                        <span className="action-icon">❤️</span>
                        <span className="action-text">Like</span>
                        {story.likes > 0 && <span className="action-count">{story.likes}</span>}
                      </button>
                      
                      <button
                        className="action-btn share-btn"
                        onClick={(e) => handleShare(story, e)}
                        title="Share this story"
                      >
                        <span className="action-icon">📤</span>
                        <span className="action-text">Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* All Stories */}
        <section className="all-stories-section">
          <h2 className="section-title">
            {selectedCategory === 'all' ? 'All Stories' : categories.find(c => c.id === selectedCategory)?.name}
            <span className="story-count">({regularStories.length})</span>
          </h2>
          
          {stories.length === 0 ? (
            <div className="no-stories">
              <div className="no-stories-icon">📚</div>
              <h3>No stories available</h3>
              <p>Be the first to share a story with our community!</p>
              {!isGuest() && (
                <Link to="/upload" className="btn btn-primary">
                  📝 Create Your First Story
                </Link>
              )}
            </div>
          ) : regularStories.length > 0 ? (
            <div className="stories-grid">
              {regularStories.map((story, index) => (
                <div 
                  key={story.id} 
                  className="story-card" 
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => {
                    console.log('Regular story clicked:', story);
                    setSelectedStory(story);
                  }}
                >
                  {story.coverImage && (
                    <div className="story-cover">
                      <img 
                        src={story.coverImage} 
                        alt={`${story.title} cover`}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                    <div className="story-header">
                      <div className="story-header-top">
                        <h3 className="story-title">{story.title || 'Untitled Story'}</h3>
                        
                        {/* Three-dot menu */}
                        {user && (user.uid === story.authorId || user.role === 'admin') && (
                          <div className="story-menu">
                            <button 
                              className="menu-trigger"
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowMenuForStory(showMenuForStory === story.id ? null : story.id);
                              }}
                              title="More options"
                            >
                              ⋯
                            </button>
                            
                            {showMenuForStory === story.id && (
                              <div className="menu-dropdown">
                                <button 
                                  className="menu-item edit-item"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // TODO: Implement story editing modal
                                    alert('Story editing will be implemented soon!');
                                    setShowMenuForStory(null);
                                  }}
                                >
                                  ✏️ Edit
                                </button>
                                <button 
                                  className="menu-item delete-item"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteStory(story.id);
                                    setShowMenuForStory(null);
                                  }}
                                >
                                  🗑️ Delete
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <span className="story-date">{formatDate(story.createdAt)}</span>
                    </div>
                    
                    <p className="story-excerpt">{story.excerpt || story.description || 'No description available'}</p>
                  
                  <div className="story-footer">
                    <div className="story-author">
                      <div className="author-avatar">
                        {story.authorProfileImage ? (
                          <img 
                            src={story.authorProfileImage} 
                            alt={story.author}
                            className="author-profile-img"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'inline';
                            }}
                          />
                        ) : null}
                        <span 
                          className="author-initials" 
                          style={{ display: story.authorProfileImage ? 'none' : 'inline' }}
                        >
                          {story.author.charAt(0)}
                        </span>
                      </div>
                      <span className="author-name">{story.author}</span>
                    </div>
                    
                      <div className="story-stats">
                        <span className="read-time">{story.readTime || '5 min read'}</span>
                        <span className="views">👁️ {story.views || 0}</span>
                        <span className="likes">❤️ {story.likes || 0}</span>
                        {(story.totalChapters || 1) > 1 && (
                          <span className="chapters">📚 {story.totalChapters || 1} chapters</span>
                        )}
                      </div>
                  </div>
                  
                  <div className="story-tags">
                    {(story.tags || []).map(tag => (
                      <span key={tag} className="tag">#{tag}</span>
                    ))}
                  </div>
                  
                  {/* Story Actions */}
                  <div className="story-actions">
                    <button
                      className={`action-btn like-btn ${story.isLiked ? 'liked' : ''} ${isGuest() ? 'disabled' : ''}`}
                      onClick={(e) => handleLike(story.id, e)}
                      disabled={isGuest()}
                      title={isGuest() ? 'Login to like stories' : ''}
                    >
                      <span className="action-icon">❤️</span>
                      <span className="action-text">Like</span>
                      {story.likes > 0 && <span className="action-count">{story.likes}</span>}
                    </button>
                    
                    <button
                      className="action-btn share-btn"
                      onClick={(e) => handleShare(story, e)}
                      title="Share this story"
                    >
                      <span className="action-icon">📤</span>
                      <span className="action-text">Share</span>
                    </button>
                    
                    {/* Continue Story Button for Author */}
                    {user && user.uid === story.authorId && !story.isCompleted && (
                      <Link 
                        to={`/upload?continue=${story.id}`}
                        className="btn btn-primary btn-sm continue-btn"
                      >
                        ➕ Continue
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-stories">
              <div className="no-stories-icon">📚</div>
              <h3>No stories found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          )}
        </section>

        {/* Call to Action */}
        {isGuest() && (
          <section className="stories-cta">
            <div className="cta-content">
              <h3>Want to share your own story?</h3>
              <p>Join our community and share your poetry journey with others</p>
              <Link to="/" className="btn btn-primary">
                Join Likhain
              </Link>
            </div>
          </section>
        )}
      </div>
      
      {/* Story Reader Modal */}
      {selectedStory && (
        <StoryReader 
          story={selectedStory} 
          onClose={() => setSelectedStory(null)} 
        />
      )}
      
      {/* Share Modal */}
      {showShareModal && storyToShare && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => {
            setShowShareModal(false);
            setStoryToShare(null);
          }}
          content={storyToShare}
          type="story"
        />
      )}
    </div>
  );
};

export default StoriesPage;
