import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LikhainLogo from './LikhainLogo';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const Navigation = () => {
  const { user, isGuest, logout } = useAuth();
  const location = useLocation();
  const [showLogin, setShowLogin] = React.useState(false);
  const [showRegister, setShowRegister] = React.useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <header className="header">
        <div className="header-container">
          <div className="header-content">
            <Link to="/" className="logo-link">
              <LikhainLogo size={60} className="header-logo" />
              <span className="logo-text">Likhain</span>
            </Link>
            
            <nav className="main-nav">
              <Link 
                to="/" 
                className={`nav-link ${isActive('/') ? 'active' : ''}`}
              >
                Homepage
              </Link>
              <Link 
                to="/stories" 
                className={`nav-link ${isActive('/stories') ? 'active' : ''}`}
              >
                Stories
              </Link>
              <Link 
                to="/poems" 
                className={`nav-link ${isActive('/poems') ? 'active' : ''}`}
              >
                Poems
              </Link>
              <Link 
                to="/community" 
                className={`nav-link ${isActive('/community') ? 'active' : ''}`}
              >
                Community
              </Link>
              <Link 
                to="/upload" 
                className={`nav-link ${isActive('/upload') ? 'active' : ''}`}
              >
                Upload
              </Link>
              <Link 
                to="/settings" 
                className={`nav-link ${isActive('/settings') ? 'active' : ''}`}
              >
                Settings
              </Link>
            </nav>

            <div className="user-section">
              {isGuest() ? (
                <div className="auth-buttons">
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => setShowLogin(true)}
                  >
                    Login
                  </button>
                  <button 
                    className="btn btn-outline btn-sm"
                    onClick={() => setShowRegister(true)}
                  >
                    Register
                  </button>
                </div>
              ) : (
                <div className="user-menu">
                  <span className="user-name">Welcome, {user.name}!</span>
                  <button 
                    className="btn btn-outline btn-sm"
                    onClick={logout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

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
    </>
  );
};

export default Navigation;
