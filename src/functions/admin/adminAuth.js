// Admin Authentication Functions
export const adminAuth = {
  // Check if user is admin
  isAdmin: () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    return user && user.role === 'admin';
  },

  // Get admin permissions
  getAdminPermissions: () => {
    return {
      canView: true,
      canLike: true,
      canUpload: true,
      canComment: true,
      canChat: true,
      canManage: true,
      canDelete: true,
      canModerate: true,
      canViewAnalytics: true
    };
  },

  // Admin login
  adminLogin: async (email, password) => {
    try {
      // Mock admin login - in real app, this would be an API call
      if (email === 'admin@likhain.com' && password === 'admin123') {
        const admin = {
          id: 999,
          name: 'Admin User',
          email: 'admin@likhain.com',
          role: 'admin',
          joinDate: '2024-01-01',
          permissions: ['all']
        };
        localStorage.setItem('user', JSON.stringify(admin));
        return { success: true, user: admin };
      }
      return { success: false, error: 'Invalid admin credentials' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Verify admin access
  verifyAdminAccess: (requiredPermission = null) => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user || user.role !== 'admin') {
      return { success: false, error: 'Admin access required' };
    }
    
    if (requiredPermission && !user.permissions.includes('all') && !user.permissions.includes(requiredPermission)) {
      return { success: false, error: 'Insufficient permissions' };
    }
    
    return { success: true };
  }
};

