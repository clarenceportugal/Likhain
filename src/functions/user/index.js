// User Functions Index
export { userAuth } from './userAuth.js';
export { userPoetry } from './userPoetry.js';
export { userCommunity } from './userCommunity.js';

// User utility functions
export const userUtils = {
  // Get user profile
  getUserProfile: async (userId) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.id === userId);
      return { success: true, data: user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update user profile
  updateProfile: async (userId, profileData) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex(u => u.id === userId);
      
      if (userIndex === -1) {
        return { success: false, error: 'User not found' };
      }

      users[userIndex] = {
        ...users[userIndex],
        ...profileData,
        updatedAt: new Date().toISOString()
      };

      localStorage.setItem('users', JSON.stringify(users));
      return { success: true, user: users[userIndex] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get user statistics
  getUserStats: async (userId) => {
    try {
      const poems = JSON.parse(localStorage.getItem('poems') || '[]');
      const follows = JSON.parse(localStorage.getItem('follows') || '[]');
      
      const userPoems = poems.filter(poem => poem.authorId === userId);
      const followers = follows.filter(follow => follow.followingId === userId);
      const following = follows.filter(follow => follow.followerId === userId);
      const totalLikes = userPoems.reduce((sum, poem) => sum + poem.likes, 0);

      return {
        success: true,
        data: {
          poemsCount: userPoems.length,
          followersCount: followers.length,
          followingCount: following.length,
          totalLikes: totalLikes
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

