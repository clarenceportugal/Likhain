// Test Login Persistence
// This script tests if login persists after page refresh

import { authService } from './auth.js';

export const testPersistence = () => {
  console.log('🧪 Testing login persistence...');
  
  // Test 1: Check if user is logged in
  const isLoggedIn = authService.isLoggedIn();
  console.log('Is user logged in?', isLoggedIn);
  
  // Test 2: Get current user from localStorage
  const currentUser = authService.getCurrentLoggedInUser();
  if (currentUser) {
    console.log('✅ Current user from localStorage:', currentUser.name);
    console.log('👑 Role:', currentUser.role);
    console.log('📧 Email:', currentUser.email);
  } else {
    console.log('❌ No user found in localStorage');
  }
  
  // Test 3: Check localStorage directly
  const savedUser = localStorage.getItem('likhain_user');
  if (savedUser) {
    console.log('✅ User data found in localStorage');
    console.log('📄 Raw data:', savedUser);
  } else {
    console.log('❌ No user data in localStorage');
  }
  
  return {
    isLoggedIn,
    currentUser,
    savedUser: savedUser ? JSON.parse(savedUser) : null
  };
};

// Run the test if this file is executed directly
if (typeof window !== 'undefined') {
  // Browser environment - you can call this from console
  window.testPersistence = testPersistence;
  console.log('Persistence test function available. Call testPersistence() to test login persistence.');
}





