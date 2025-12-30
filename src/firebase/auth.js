// Firebase Authentication Service
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  updatePassword,
  deleteUser
} from 'firebase/auth';
import { auth, rtdb } from './config.js';
import { realtimeService } from './realtime.js';

export const authService = {
  // Sign in with email and password
  signIn: async (email, password) => {
    try {
      // Firebase authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Get user data from Realtime Database
      const userResult = await realtimeService.users.getById(user.uid);
      const userData = userResult.success ? userResult.data : null;
      
      const fullUserData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        ...userData
      };
      
      // Save user to localStorage for persistence
      localStorage.setItem('likhain_user', JSON.stringify(fullUserData));
      
      return {
        success: true,
        user: fullUserData
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Create new user account
  signUp: async (email, password, userData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update user profile
      await updateProfile(user, {
        displayName: userData.name
      });
      
      // Create user document in Realtime Database
      const userDoc = {
        uid: user.uid,
        email: user.email,
        name: userData.name,
        role: userData.role || 'user',
        bio: '',
        location: '',
        website: '',
        preferences: {
          language: 'filipino',
          notifications: true,
          publicProfile: true,
          emailUpdates: true
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const result = await realtimeService.users.create(userDoc);
      
      return {
        success: true,
        user: userDoc
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Sign out
  signOut: async () => {
    try {
      // Clear localStorage
      localStorage.removeItem('likhain_user');
      
      // Sign out from Firebase
      await signOut(auth);
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get current user
  getCurrentUser: () => {
    return auth.currentUser;
  },

  // Get user data from Realtime Database
  getUserData: async (uid) => {
    try {
      // Get from Realtime Database (including admin user)
      return await realtimeService.users.getById(uid);
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Listen to auth state changes
  onAuthStateChanged: (callback) => {
    return onAuthStateChanged(auth, callback);
  },

  // Check if user is logged in from localStorage
  isLoggedIn: () => {
    const savedUser = localStorage.getItem('likhain_user');
    return savedUser !== null;
  },

  // Get current logged in user from localStorage
  getCurrentLoggedInUser: () => {
    const savedUser = localStorage.getItem('likhain_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('likhain_user');
        return null;
      }
    }
    return null;
  },

  // Update user profile
  updateUserProfile: async (uid, profileData) => {
    try {
      return await realtimeService.users.update(uid, profileData);
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Reset password
  resetPassword: async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Update password
  updatePassword: async (newPassword) => {
    try {
      const user = auth.currentUser;
      if (user) {
        await updatePassword(user, newPassword);
        return { success: true };
      }
      return {
        success: false,
        error: 'No user logged in'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Delete user account
  deleteAccount: async (uid) => {
    try {
      const user = auth.currentUser;
      if (user) {
        // Delete user document from Firestore
        await deleteDoc(doc(db, 'users', uid));
        
        // Delete user's poems
        const poemsQuery = query(collection(db, 'poems'), where('authorId', '==', uid));
        const poemsSnapshot = await getDocs(poemsQuery);
        const deletePromises = poemsSnapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises);
        
        // Delete user's messages
        const messagesQuery = query(collection(db, 'messages'), where('senderId', '==', uid));
        const messagesSnapshot = await getDocs(messagesQuery);
        const deleteMessagePromises = messagesSnapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deleteMessagePromises);
        
        // Delete user's follows
        const followsQuery = query(collection(db, 'follows'), where('followerId', '==', uid));
        const followsSnapshot = await getDocs(followsQuery);
        const deleteFollowPromises = followsSnapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deleteFollowPromises);
        
        // Delete the user account
        await deleteUser(user);
        
        return { success: true };
      }
      return {
        success: false,
        error: 'No user logged in'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
};
