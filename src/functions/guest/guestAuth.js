// Guest Authentication Functions
export const guestAuth = {
  // Check if user is guest
  isGuest: () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    return !user || user.role === 'guest';
  },

  // Get guest permissions
  getGuestPermissions: () => {
    return {
      canView: true,
      canLike: false,
      canUpload: false,
      canComment: false,
      canChat: false,
      canManage: false
    };
  },

  // Show guest notice
  showGuestNotice: (message = 'You need to login to access this feature.') => {
    return {
      type: 'guest_notice',
      message,
      actions: ['login', 'register']
    };
  },

  // Redirect to login
  redirectToLogin: () => {
    // This would typically trigger a login modal or redirect
    return { action: 'show_login_modal' };
  }
};

