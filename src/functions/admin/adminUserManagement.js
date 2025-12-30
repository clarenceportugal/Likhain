// Admin User Management Functions
export const adminUserManagement = {
  // Get all users
  getAllUsers: async () => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      return { success: true, data: users };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get user by ID
  getUserById: async (userId) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.id === userId);
      return { success: true, data: user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update user role
  updateUserRole: async (userId, newRole) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex(u => u.id === userId);
      
      if (userIndex === -1) {
        return { success: false, error: 'User not found' };
      }

      users[userIndex].role = newRole;
      users[userIndex].updatedAt = new Date().toISOString();
      localStorage.setItem('users', JSON.stringify(users));

      return { success: true, user: users[userIndex] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Ban/unban user
  toggleUserBan: async (userId, reason = '') => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex(u => u.id === userId);
      
      if (userIndex === -1) {
        return { success: false, error: 'User not found' };
      }

      const user = users[userIndex];
      user.isBanned = !user.isBanned;
      user.banReason = user.isBanned ? reason : '';
      user.banDate = user.isBanned ? new Date().toISOString() : null;
      user.updatedAt = new Date().toISOString();

      users[userIndex] = user;
      localStorage.setItem('users', JSON.stringify(users));

      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Delete user
  deleteUser: async (userId) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const filteredUsers = users.filter(u => u.id !== userId);
      localStorage.setItem('users', JSON.stringify(filteredUsers));

      // Also remove user's poems
      const poems = JSON.parse(localStorage.getItem('poems') || '[]');
      const filteredPoems = poems.filter(poem => poem.authorId !== userId);
      localStorage.setItem('poems', JSON.stringify(filteredPoems));

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get user statistics
  getUserStats: async (userId) => {
    try {
      const poems = JSON.parse(localStorage.getItem('poems') || '[]');
      const follows = JSON.parse(localStorage.getItem('follows') || '[]');
      const messages = JSON.parse(localStorage.getItem('messages') || '[]');
      
      const userPoems = poems.filter(poem => poem.authorId === userId);
      const followers = follows.filter(follow => follow.followingId === userId);
      const following = follows.filter(follow => follow.followerId === userId);
      const userMessages = messages.filter(msg => msg.senderId === userId || msg.recipientId === userId);
      const totalLikes = userPoems.reduce((sum, poem) => sum + poem.likes, 0);

      return {
        success: true,
        data: {
          poemsCount: userPoems.length,
          followersCount: followers.length,
          followingCount: following.length,
          messagesCount: userMessages.length,
          totalLikes: totalLikes,
          joinDate: users.find(u => u.id === userId)?.joinDate
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

