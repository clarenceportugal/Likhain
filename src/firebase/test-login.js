// Test Login Functionality
// This script tests the login functionality with the hardcoded admin user

import { authService } from './auth.js';

export const testLogin = async () => {
  console.log('🧪 Testing login functionality...');
  
  try {
    // Test admin login
    console.log('Testing admin login...');
    const adminResult = await authService.signIn('renz42gal@likhain.com', '1493512');
    
    if (adminResult.success) {
      console.log('✅ Admin login successful!');
      console.log('👤 User:', adminResult.user.name);
      console.log('👑 Role:', adminResult.user.role);
      console.log('📧 Email:', adminResult.user.email);
    } else {
      console.log('❌ Admin login failed:', adminResult.error);
    }
    
    return adminResult;
  } catch (error) {
    console.error('❌ Error testing login:', error);
    return { success: false, error: error.message };
  }
};

// Run the test if this file is executed directly
if (typeof window !== 'undefined') {
  // Browser environment - you can call this from console
  window.testLogin = testLogin;
  console.log('Login test function available. Call testLogin() to test admin login.');
}





