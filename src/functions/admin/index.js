// Admin Functions Index
export { adminAuth } from './adminAuth.js';
export { adminUserManagement } from './adminUserManagement.js';
export { adminContentManagement } from './adminContentManagement.js';
export { adminAnalytics } from './adminAnalytics.js';

// Admin utility functions
export const adminUtils = {
  // Get admin dashboard data
  getDashboardData: async () => {
    try {
      const [platformStats, contentStats, moderationStats] = await Promise.all([
        adminAnalytics.getPlatformStats(),
        adminAnalytics.getContentStats(),
        adminAnalytics.getModerationStats()
      ]);

      return {
        success: true,
        data: {
          platform: platformStats.data,
          content: contentStats.data,
          moderation: moderationStats.data
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Export data
  exportData: async (dataType) => {
    try {
      let data;
      switch (dataType) {
        case 'users':
          data = JSON.parse(localStorage.getItem('users') || '[]');
          break;
        case 'poems':
          data = JSON.parse(localStorage.getItem('poems') || '[]');
          break;
        case 'stories':
          data = JSON.parse(localStorage.getItem('stories') || '[]');
          break;
        case 'analytics':
          const dashboardData = await adminUtils.getDashboardData();
          data = dashboardData.data;
          break;
        default:
          return { success: false, error: 'Invalid data type' };
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${dataType}_export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // System maintenance
  performMaintenance: async (action) => {
    try {
      switch (action) {
        case 'clearCache':
          // Clear temporary data
          localStorage.removeItem('tempData');
          break;
        case 'backupData':
          // Create backup of all data
          const backup = {
            users: JSON.parse(localStorage.getItem('users') || '[]'),
            poems: JSON.parse(localStorage.getItem('poems') || '[]'),
            stories: JSON.parse(localStorage.getItem('stories') || '[]'),
            follows: JSON.parse(localStorage.getItem('follows') || '[]'),
            messages: JSON.parse(localStorage.getItem('messages') || '[]'),
            backupDate: new Date().toISOString()
          };
          localStorage.setItem('backup', JSON.stringify(backup));
          break;
        case 'restoreData':
          // Restore from backup
          const backupData = JSON.parse(localStorage.getItem('backup') || '{}');
          if (backupData.backupDate) {
            Object.keys(backupData).forEach(key => {
              if (key !== 'backupDate') {
                localStorage.setItem(key, JSON.stringify(backupData[key]));
              }
            });
          }
          break;
        default:
          return { success: false, error: 'Invalid maintenance action' };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

