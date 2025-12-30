// Admin Analytics Functions
export const adminAnalytics = {
  // Get platform statistics
  getPlatformStats: async () => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const poems = JSON.parse(localStorage.getItem('poems') || '[]');
      const stories = JSON.parse(localStorage.getItem('stories') || '[]');
      const follows = JSON.parse(localStorage.getItem('follows') || '[]');
      const messages = JSON.parse(localStorage.getItem('messages') || '[]');

      const totalLikes = poems.reduce((sum, poem) => sum + poem.likes, 0);
      const activeUsers = users.filter(user => !user.isBanned).length;
      const bannedUsers = users.filter(user => user.isBanned).length;

      return {
        success: true,
        data: {
          totalUsers: users.length,
          activeUsers: activeUsers,
          bannedUsers: bannedUsers,
          totalPoems: poems.length,
          totalStories: stories.length,
          totalLikes: totalLikes,
          totalFollows: follows.length,
          totalMessages: messages.length
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get user growth over time
  getUserGrowth: async (period = '30d') => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const now = new Date();
      const periodDays = period === '7d' ? 7 : period === '30d' ? 30 : 90;
      const startDate = new Date(now.getTime() - (periodDays * 24 * 60 * 60 * 1000));

      const growthData = [];
      for (let i = 0; i < periodDays; i++) {
        const date = new Date(startDate.getTime() + (i * 24 * 60 * 60 * 1000));
        const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

        const usersOnDay = users.filter(user => {
          const joinDate = new Date(user.joinDate);
          return joinDate >= dayStart && joinDate < dayEnd;
        }).length;

        growthData.push({
          date: dayStart.toISOString().split('T')[0],
          newUsers: usersOnDay
        });
      }

      return { success: true, data: growthData };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get content statistics
  getContentStats: async () => {
    try {
      const poems = JSON.parse(localStorage.getItem('poems') || '[]');
      const stories = JSON.parse(localStorage.getItem('stories') || '[]');

      const poemStats = {
        total: poems.length,
        totalLikes: poems.reduce((sum, poem) => sum + poem.likes, 0),
        averageLikes: poems.length > 0 ? Math.round(poems.reduce((sum, poem) => sum + poem.likes, 0) / poems.length) : 0,
        mostLiked: poems.sort((a, b) => b.likes - a.likes).slice(0, 5)
      };

      const storyStats = {
        total: stories.length,
        totalViews: stories.reduce((sum, story) => sum + (story.views || 0), 0),
        averageViews: stories.length > 0 ? Math.round(stories.reduce((sum, story) => sum + (story.views || 0), 0) / stories.length) : 0,
        mostViewed: stories.sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5)
      };

      return {
        success: true,
        data: {
          poems: poemStats,
          stories: storyStats
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get moderation statistics
  getModerationStats: async () => {
    try {
      const flags = JSON.parse(localStorage.getItem('contentFlags') || '[]');
      const deletions = JSON.parse(localStorage.getItem('contentDeletions') || '[]');

      const flagStats = {
        total: flags.length,
        pending: flags.filter(flag => flag.status === 'pending').length,
        approved: flags.filter(flag => flag.status === 'approved').length,
        rejected: flags.filter(flag => flag.status === 'rejected').length,
        deleted: flags.filter(flag => flag.status === 'deleted').length
      };

      const deletionStats = {
        total: deletions.length,
        poems: deletions.filter(d => d.type === 'poem').length,
        stories: deletions.filter(d => d.type === 'story').length
      };

      return {
        success: true,
        data: {
          flags: flagStats,
          deletions: deletionStats
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

