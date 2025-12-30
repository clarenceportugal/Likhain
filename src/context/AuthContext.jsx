import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../firebase/auth.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // User roles
  const USER_ROLES = {
    GUEST: 'guest',
    USER: 'user',
    ADMIN: 'admin'
  };

  useEffect(() => {
    // Always fetch fresh user data from database on app load
    const loadUserData = async () => {
      // Check localStorage first for quick loading
      const savedUser = localStorage.getItem('likhain_user');
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          setLoading(false);
          
          // Always fetch fresh data from database (including admin)
          const userDoc = await authService.getUserData(userData.uid);
          if (userDoc.success && userDoc.data) {
            const freshUserData = { ...userData, ...userDoc.data };
            setUser(freshUserData);
            localStorage.setItem('likhain_user', JSON.stringify(freshUserData));
            console.log('✅ User data refreshed from database:', freshUserData.name);
          }
          return;
        } catch (error) {
          console.error('Error parsing saved user:', error);
          localStorage.removeItem('likhain_user');
        }
      }

      // Listen to Firebase auth state changes
      const unsubscribe = authService.onAuthStateChanged(async (firebaseUser) => {
        if (firebaseUser) {
          // Get user data from Realtime Database
          const userDoc = await authService.getUserData(firebaseUser.uid);
          if (userDoc.success) {
            setUser(userDoc.data);
            // Save to localStorage for persistence
            localStorage.setItem('likhain_user', JSON.stringify(userDoc.data));
            console.log('✅ User data loaded from database:', userDoc.data.name);
          }
        } else {
          setUser(null);
          localStorage.removeItem('likhain_user');
        }
        setLoading(false);
      });

      return () => unsubscribe();
    };

    loadUserData();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const result = await authService.signIn(email, password);
      if (result.success) {
        // Always fetch fresh data from database after login
        const userDoc = await authService.getUserData(result.user.uid);
        if (userDoc.success && userDoc.data) {
          const freshUserData = { ...result.user, ...userDoc.data };
          setUser(freshUserData);
          localStorage.setItem('likhain_user', JSON.stringify(freshUserData));
          console.log('✅ Login: User data fetched from database:', freshUserData.name);
        } else {
          setUser(result.user);
          localStorage.setItem('likhain_user', JSON.stringify(result.user));
        }
      }
      setLoading(false);
      return result;
    } catch (error) {
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const result = await authService.signUp(email, password, { name, role: USER_ROLES.USER });
      if (result.success) {
        // Always fetch fresh data from database after registration
        const userDoc = await authService.getUserData(result.user.uid);
        if (userDoc.success && userDoc.data) {
          const freshUserData = { ...result.user, ...userDoc.data };
          setUser(freshUserData);
          localStorage.setItem('likhain_user', JSON.stringify(freshUserData));
          console.log('✅ Register: User data fetched from database:', freshUserData.name);
        } else {
          setUser(result.user);
          localStorage.setItem('likhain_user', JSON.stringify(result.user));
        }
      }
      setLoading(false);
      return result;
    } catch (error) {
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.signOut();
      setUser(null);
      // Remove from localStorage
      localStorage.removeItem('likhain_user');
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Logout error:', error);
    }
  };

  const isGuest = () => !user;
  const isUser = () => user && user.role === USER_ROLES.USER;
  const isAdmin = () => user && user.role === USER_ROLES.ADMIN;

  const canLike = () => isUser() || isAdmin();
  const canUpload = () => isUser() || isAdmin();
  const canManage = () => isAdmin();

  // Update user data
  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem('likhain_user', JSON.stringify(updatedUserData));
  };

  // Refresh user data from database
  const refreshUserData = async () => {
    if (user && user.uid) {
      try {
        const userDoc = await authService.getUserData(user.uid);
        if (userDoc.success && userDoc.data) {
          const freshUserData = { ...user, ...userDoc.data };
          setUser(freshUserData);
          localStorage.setItem('likhain_user', JSON.stringify(freshUserData));
          console.log('✅ User data refreshed from database:', freshUserData.name);
          return { success: true, data: freshUserData };
        }
        return { success: false, error: 'Failed to fetch user data' };
      } catch (error) {
        console.error('Error refreshing user data:', error);
        return { success: false, error: error.message };
      }
    }
    return { success: false, error: 'No user logged in' };
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    refreshUserData,
    isGuest,
    isUser,
    isAdmin,
    canLike,
    canUpload,
    canManage,
    USER_ROLES
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
