// User Authentication Functions
export const userAuth = {
  // Check if user is logged in
  isUser: () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    return user && user.role === 'user';
  },

  // Get user permissions
  getUserPermissions: () => {
    return {
      canView: true,
      canLike: true,
      canUpload: true,
      canComment: true,
      canChat: true,
      canManage: false
    };
  },

  // Login user
  login: async (email, password) => {
    try {
      // Mock login - in real app, this would be an API call
      if (email === 'user@example.com' && password === 'password') {
        const user = {
          id: 1,
          name: 'John Doe',
          email: 'user@example.com',
          role: 'user',
          joinDate: '2024-01-01'
        };
        localStorage.setItem('user', JSON.stringify(user));
        return { success: true, user };
      }
      return { success: false, error: 'Invalid credentials' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Register new user
  register: async (userData) => {
    try {
      // Mock registration - in real app, this would be an API call
      const newUser = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        role: 'user',
        joinDate: new Date().toISOString()
      };
      localStorage.setItem('user', JSON.stringify(newUser));
      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('user');
    return { success: true };
  },

  // Get current user
  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user') || 'null');
  }
};

