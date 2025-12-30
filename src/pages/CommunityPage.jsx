import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { firestoreService } from '../firebase/firestore.js';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

const CommunityPage = () => {
  const { user, isGuest } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'chat'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const result = await firestoreService.users.getAll();
      if (result.success) {
        // Add mock online status and stats for demo
        const usersWithStats = result.data.map(user => ({
          ...user,
          online: Math.random() > 0.5, // Random online status for demo
          poemsCount: Math.floor(Math.random() * 20) + 1,
          likes: Math.floor(Math.random() * 100) + 10
        }));
        setUsers(usersWithStats);
      } else {
        // Fallback to mock data
        setUsers(getMockUsers());
      }
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers(getMockUsers());
    } finally {
      setLoading(false);
    }
  };

  const getMockUsers = () => [
    { id: 1, name: 'Maria Santos', email: 'maria@example.com', role: 'user', joinDate: '2024-01-15', poemsCount: 12, likes: 45, online: true },
    { id: 2, name: 'Juan Dela Cruz', email: 'juan@example.com', role: 'user', joinDate: '2024-02-20', poemsCount: 8, likes: 32, online: false },
    { id: 3, name: 'Ana Garcia', email: 'ana@example.com', role: 'user', joinDate: '2024-03-10', poemsCount: 15, likes: 67, online: true },
    { id: 4, name: 'Pedro Reyes', email: 'pedro@example.com', role: 'user', joinDate: '2024-01-30', poemsCount: 6, likes: 23, online: false },
    { id: 5, name: 'Sofia Martinez', email: 'sofia@example.com', role: 'user', joinDate: '2024-02-15', poemsCount: 20, likes: 89, online: true },
  ];

  // Mock chat data
  const chats = [
    {
      id: 1,
      user: { name: 'Maria Santos', avatar: 'M', online: true },
      lastMessage: 'Thank you for the feedback on my poem!',
      timestamp: '2 min ago',
      unread: 2
    },
    {
      id: 2,
      user: { name: 'Juan Dela Cruz', avatar: 'J', online: false },
      lastMessage: 'I love your latest poem about nature',
      timestamp: '1 hour ago',
      unread: 0
    },
    {
      id: 3,
      user: { name: 'Ana Garcia', avatar: 'A', online: true },
      lastMessage: 'Can you review my new poem?',
      timestamp: '3 hours ago',
      unread: 1
    }
  ];

  const messages = [
    { id: 1, sender: 'Maria Santos', content: 'Hi! I really enjoyed your latest poem about the sunset.', timestamp: '10:30 AM', isOwn: false },
    { id: 2, sender: user?.name || 'You', content: 'Thank you so much! I was inspired by the view from my window.', timestamp: '10:32 AM', isOwn: true },
    { id: 3, sender: 'Maria Santos', content: 'The imagery was so vivid. Do you have any tips for writing about nature?', timestamp: '10:35 AM', isOwn: false },
    { id: 4, sender: user?.name || 'You', content: 'I try to use all five senses when describing nature. It helps create a more immersive experience.', timestamp: '10:38 AM', isOwn: true },
    { id: 5, sender: 'Maria Santos', content: 'That\'s a great tip! I\'ll try that in my next poem.', timestamp: '10:40 AM', isOwn: false }
  ];

  const filteredUsers = users.filter(userItem => 
    userItem.uid !== user?.uid && // Exclude current user
    (userItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    userItem.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const handleStartChat = (user) => {
    setActiveTab('chat');
    // Find or create chat with this user
    const existingChat = chats.find(chat => chat.user.name === user.name);
    if (existingChat) {
      setSelectedChat(existingChat);
    } else {
      // Create new chat
      const newChat = {
        id: Date.now(),
        user: { name: user.name, avatar: user.name.charAt(0), online: user.online },
        lastMessage: 'Start a conversation...',
        timestamp: 'now',
        unread: 0
      };
      setSelectedChat(newChat);
    }
  };

  if (isGuest()) {
    return (
      <div className="community-page">
        <div className="page-container">
          <h1 className="page-title">Community</h1>
          <div className="login-required">
            <h2>Login Required</h2>
            <p>You need to be logged in to connect with other users and chat.</p>
            <div className="auth-buttons">
              <button 
                className="btn btn-primary"
                onClick={() => setShowLogin(true)}
              >
                Login
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => setShowRegister(true)}
              >
                Register
              </button>
            </div>
          </div>
        </div>

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
  }

  return (
    <div className="community-page">
      <div className="page-container">
        <h1 className="page-title">Community</h1>
        <p className="page-subtitle">Connect with fellow poetry enthusiasts and start conversations</p>
        
        <div className="community-container">
          {/* Tab Navigation */}
          <div className="community-tabs">
            <button 
              className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <span className="tab-icon">👥</span>
              Find Users
            </button>
            <button 
              className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              <span className="tab-icon">💬</span>
              Chat
              {chats.some(chat => chat.unread > 0) && (
                <span className="unread-badge">
                  {chats.reduce((total, chat) => total + chat.unread, 0)}
                </span>
              )}
            </button>
          </div>

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="users-section">
              <div className="users-header">
                <div className="search-section">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>
                
                <div className="users-stats">
                  <div className="stat-card">
                    <h3>Total Users</h3>
                    <span className="stat-number">{users.length}</span>
                  </div>
                  <div className="stat-card">
                    <h3>Online Now</h3>
                    <span className="stat-number">{users.filter(u => u.online).length}</span>
                  </div>
                </div>
              </div>

              <div className="users-grid">
                {filteredUsers.map(user => (
                  <div key={user.id} className="user-card">
                    <div className="user-avatar">
                      <span>{user.name.charAt(0)}</span>
                      {user.online && <div className="online-indicator"></div>}
                    </div>
                    <div className="user-info">
                      <h3>{user.name}</h3>
                      <p className="user-email">{user.email}</p>
                      <div className="user-stats">
                        <span className="stat">
                          <strong>{user.poemsCount}</strong> poems
                        </span>
                        <span className="stat">
                          <strong>{user.likes}</strong> likes
                        </span>
                      </div>
                      <p className="join-date">Joined {new Date(user.joinDate).toLocaleDateString()}</p>
                    </div>
                    <div className="user-actions">
                      <button className="btn btn-primary btn-sm">
                        Follow
                      </button>
                      <button 
                        className="btn btn-outline btn-sm"
                        onClick={() => handleStartChat(user)}
                      >
                        Chat
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chat Tab */}
          {activeTab === 'chat' && (
            <div className="chat-section">
              <div className="chat-container">
                <div className="chat-sidebar">
                  <div className="chat-header">
                    <h3>Conversations</h3>
                    <div className="search-section">
                      <input
                        type="text"
                        placeholder="Search conversations..."
                        className="search-input"
                      />
                    </div>
                  </div>
                  
                  <div className="chat-list">
                    {chats.map(chat => (
                      <div 
                        key={chat.id} 
                        className={`chat-item ${selectedChat?.id === chat.id ? 'active' : ''}`}
                        onClick={() => setSelectedChat(chat)}
                      >
                        <div className="chat-avatar">
                          <span>{chat.user.avatar}</span>
                          {chat.user.online && <div className="online-indicator"></div>}
                        </div>
                        <div className="chat-info">
                          <div className="chat-name">
                            {chat.user.name}
                            {chat.unread > 0 && <span className="unread-badge">{chat.unread}</span>}
                          </div>
                          <div className="chat-preview">{chat.lastMessage}</div>
                          <div className="chat-time">{chat.timestamp}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="chat-main">
                  {selectedChat ? (
                    <>
                      <div className="chat-header">
                        <div className="chat-user-info">
                          <div className="chat-avatar">
                            <span>{selectedChat.user.avatar}</span>
                            {selectedChat.user.online && <div className="online-indicator"></div>}
                          </div>
                          <div>
                            <h3>{selectedChat.user.name}</h3>
                            <span className="status">
                              {selectedChat.user.online ? 'Online' : 'Offline'}
                            </span>
                          </div>
                        </div>
                        <div className="chat-actions">
                          <button className="btn btn-outline btn-sm">Share Poem</button>
                          <button className="btn btn-outline btn-sm">View Profile</button>
                        </div>
                      </div>

                      <div className="chat-messages">
                        {messages.map(message => (
                          <div key={message.id} className={`message ${message.isOwn ? 'own' : 'other'}`}>
                            <div className="message-content">
                              {!message.isOwn && <div className="message-sender">{message.sender}</div>}
                              <div className="message-text">{message.content}</div>
                              <div className="message-time">{message.timestamp}</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="chat-input">
                        <div className="input-group">
                          <input
                            type="text"
                            placeholder="Type your message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            className="message-input"
                          />
                          <button 
                            className="btn btn-primary"
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim()}
                          >
                            Send
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="chat-placeholder">
                      <div className="placeholder-content">
                        <h3>Select a conversation</h3>
                        <p>Choose a conversation from the sidebar to start chatting, or find users to start a new conversation.</p>
                        <button 
                          className="btn btn-primary"
                          onClick={() => setActiveTab('users')}
                        >
                          Find Users
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
