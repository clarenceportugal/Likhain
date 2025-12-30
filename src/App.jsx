import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import StoriesPage from './pages/StoriesPage';
import StoryViewPage from './pages/StoryViewPage';
import PoemsPage from './pages/PoemsPage';
import PoemViewPage from './pages/PoemViewPage';
import CommunityPage from './pages/CommunityPage';
import UploadPage from './pages/UploadPage';
import SettingsPage from './pages/SettingsPage';
import { initializeFirebase } from './firebase/init.js';
import './App.css';

function App() {
  useEffect(() => {
    // Initialize Firebase when app starts
    initializeFirebase();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navigation />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/stories" element={<StoriesPage />} />
              <Route path="/stories/:storyId" element={<StoryViewPage />} />
              <Route path="/poems" element={<PoemsPage />} />
              <Route path="/poems/:poemId" element={<PoemViewPage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
