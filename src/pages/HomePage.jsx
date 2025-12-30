import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { firestoreService } from '../firebase/firestore.js';
import LikhainLogo from '../components/LikhainLogo';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const { user, isGuest } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [featuredPoems, setFeaturedPoems] = useState([]);
  const [stats, setStats] = useState({
    totalPoems: 0,
    totalUsers: 0,
    totalStories: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHomepageData();
  }, []);

  const loadHomepageData = async () => {
    try {
      // Load featured poems (most liked)
      const poemsResult = await firestoreService.poems.getAll();
      if (poemsResult.success) {
        const sortedPoems = poemsResult.data
          .sort((a, b) => (b.likes || 0) - (a.likes || 0))
          .slice(0, 3);
        setFeaturedPoems(sortedPoems);
      }

      // Load platform statistics
      const usersResult = await firestoreService.users.getAll();
      const storiesResult = await firestoreService.stories.getAll();
      
      if (usersResult.success && poemsResult.success && storiesResult.success) {
        const totalUsers = usersResult.data.length;
        const totalPoems = poemsResult.data.length;
        const totalStories = storiesResult.data.length;
        
        setStats({
          totalPoems,
          totalUsers,
          totalStories
        });
      }
    } catch (error) {
      console.error('Error loading homepage data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="floating-elements">
            <div className="floating-poem">📝</div>
            <div className="floating-heart">❤️</div>
            <div className="floating-star">⭐</div>
            <div className="floating-book">📖</div>
          </div>
        </div>
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="title-main">Likhain</span>
              <span className="title-sub">Where Poetry Comes to Life</span>
            </h1>
            <p className="hero-description">
              Discover beautiful poetry, share your creative expressions, and connect with fellow poetry lovers from around the world.
            </p>
            
            {/* Platform Stats */}
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">{stats.totalPoems}</span>
                <span className="stat-label">Poems</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{stats.totalUsers}</span>
                <span className="stat-label">Poets</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{stats.totalStories}</span>
                <span className="stat-label">Stories</span>
              </div>
            </div>

            <div className="hero-actions">
              {isGuest() ? (
                <>
                  <button 
                    className="btn btn-primary btn-large hero-btn"
                    onClick={() => setShowLogin(true)}
                  >
                    <span>Get Started</span>
                    <span className="btn-icon">→</span>
                  </button>
                  <button 
                    className="btn btn-outline btn-large hero-btn"
                    onClick={() => setShowRegister(true)}
                  >
                    <span>Join Community</span>
                    <span className="btn-icon">👥</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/poems" className="btn btn-primary btn-large hero-btn">
                    <span>Explore Poetry</span>
                    <span className="btn-icon">📚</span>
                  </Link>
                  <Link to="/upload" className="btn btn-outline btn-large hero-btn">
                    <span>Share Your Work</span>
                    <span className="btn-icon">✍️</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Poems Section */}
      {featuredPoems.length > 0 && (
        <section className="featured-section">
          <div className="featured-container">
            <div className="section-header">
              <h2 className="section-title">Featured Poetry</h2>
              <p className="section-subtitle">Most loved poems from our community</p>
            </div>
            <div className="featured-poems">
              {featuredPoems.map((poem, index) => (
                <div key={poem.id} className="featured-poem-card" style={{ animationDelay: `${index * 0.2}s` }}>
                  <div className="poem-header">
                    <h3 className="poem-title">{poem.title}</h3>
                    <div className="poem-meta">
                      <span className="poem-author">by {poem.author}</span>
                      <span className="poem-date">{formatDate(poem.createdAt)}</span>
                    </div>
                  </div>
                  <div className="poem-preview">
                    <p>{poem.content.substring(0, 150)}...</p>
                  </div>
                  <div className="poem-stats">
                    <span className="likes-count">❤️ {poem.likes || 0} likes</span>
                    <Link to="/poems" className="read-more">Read Full Poem →</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <div className="section-header">
            <h2 className="section-title">Why Choose Likhain?</h2>
            <p className="section-subtitle">Everything you need to express and discover poetry</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📝</div>
              <h3>Share Your Poetry</h3>
              <p>Express your thoughts and emotions through beautiful poetry and share them with the world. Your voice matters.</p>
              <div className="feature-highlight">Create & Share</div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">❤️</div>
              <h3>Connect & Engage</h3>
              <p>Like, comment, and connect with fellow poetry enthusiasts from around the globe. Build meaningful connections.</p>
              <div className="feature-highlight">Community First</div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌟</div>
              <h3>Discover New Voices</h3>
              <p>Explore diverse poetry styles and discover talented writers from different cultures and backgrounds.</p>
              <div className="feature-highlight">Endless Discovery</div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3>Real-time Chat</h3>
              <p>Connect directly with poets, share feedback, and engage in meaningful conversations about poetry.</p>
              <div className="feature-highlight">Direct Connection</div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Track Your Growth</h3>
              <p>Monitor your poetry's performance, see how your work resonates with readers, and grow as a writer.</p>
              <div className="feature-highlight">Growth Analytics</div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Safe & Secure</h3>
              <p>Your creative work is protected with enterprise-grade security. Share with confidence and peace of mind.</p>
              <div className="feature-highlight">Protected Content</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="testimonials-container">
          <div className="section-header">
            <h2 className="section-title">What Our Poets Say</h2>
            <p className="section-subtitle">Real stories from our community</p>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"Likhain has given me a platform to share my poetry with the world. The community is incredibly supportive and inspiring."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">M</div>
                <div className="author-info">
                  <span className="author-name">Maria Santos</span>
                  <span className="author-role">Poet & Writer</span>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"I've discovered so many amazing poets here. The diversity of voices and styles is truly remarkable."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">J</div>
                <div className="author-info">
                  <span className="author-name">Juan Dela Cruz</span>
                  <span className="author-role">Poetry Enthusiast</span>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"The real-time features and community engagement make this the best poetry platform I've ever used."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">A</div>
                <div className="author-info">
                  <span className="author-name">Ana Reyes</span>
                  <span className="author-role">Creative Writer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Share Your Poetry?</h2>
            <p className="cta-description">
              Join thousands of poets who are already sharing their stories, emotions, and creativity on Likhain.
            </p>
            <div className="cta-actions">
              {isGuest() ? (
                <>
                  <button 
                    className="btn btn-primary btn-large"
                    onClick={() => setShowRegister(true)}
                  >
                    Start Writing Today
                  </button>
                  <button 
                    className="btn btn-outline btn-large"
                    onClick={() => setShowLogin(true)}
                  >
                    Sign In
                  </button>
                </>
              ) : (
                <>
                  <Link to="/upload" className="btn btn-primary btn-large">
                    Upload Your Poetry
                  </Link>
                  <Link to="/community" className="btn btn-outline btn-large">
                    Connect with Poets
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      {showLogin && (
        <div className="modal-overlay" onClick={() => setShowLogin(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <LoginForm onClose={() => setShowLogin(false)} />
          </div>
        </div>
      )}

      {showRegister && (
        <div className="modal-overlay" onClick={() => setShowRegister(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <RegisterForm onClose={() => setShowRegister(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
