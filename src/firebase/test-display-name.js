// Test Display Name Functionality
// This script tests if the display name is properly fetched and displayed

import { authService } from './auth.js';
import { realtimeService } from './realtime.js';

export const testDisplayName = async () => {
  console.log('🧪 Testing display name functionality...');
  
  try {
    // Test 1: Check current user from localStorage
    const currentUser = authService.getCurrentLoggedInUser();
    if (currentUser) {
      console.log('✅ Current user from localStorage:');
      console.log('👤 Name:', currentUser.name);
      console.log('📧 Email:', currentUser.email);
      console.log('👑 Role:', currentUser.role);
      console.log('🆔 UID:', currentUser.uid);
    } else {
      console.log('❌ No user found in localStorage');
    }
    
    // Test 2: Test admin user data
    console.log('\n🔍 Testing admin user data...');
    const adminResult = await authService.getUserData('renz42gal');
    if (adminResult.success) {
      console.log('✅ Admin user data:');
      console.log('👤 Name:', adminResult.data.name);
      console.log('📧 Email:', adminResult.data.email);
      console.log('👑 Role:', adminResult.data.role);
    } else {
      console.log('❌ Admin user not found:', adminResult.error);
    }
    
    // Test 3: Test updating user data
    if (currentUser && currentUser.uid !== 'renz42gal') {
      console.log('\n🔧 Testing user update...');
      const testUpdate = {
        name: currentUser.name + ' (Updated)',
        bio: 'Test bio update',
        location: 'Test Location'
      };
      
      const updateResult = await realtimeService.users.update(currentUser.uid, testUpdate);
      if (updateResult.success) {
        console.log('✅ User update successful');
        
        // Revert the test update
        const revertUpdate = {
          name: currentUser.name,
          bio: currentUser.bio || '',
          location: currentUser.location || ''
        };
        await realtimeService.users.update(currentUser.uid, revertUpdate);
        console.log('✅ Test update reverted');
      } else {
        console.log('❌ User update failed:', updateResult.error);
      }
    }
    
    // Test 4: Check localStorage data
    console.log('\n💾 Checking localStorage data...');
    const savedUser = localStorage.getItem('likhain_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      console.log('✅ localStorage user data:');
      console.log('👤 Name:', parsedUser.name);
      console.log('📧 Email:', parsedUser.email);
      console.log('👑 Role:', parsedUser.role);
    } else {
      console.log('❌ No user data in localStorage');
    }
    
    return {
      currentUser,
      adminResult,
      savedUser: savedUser ? JSON.parse(savedUser) : null
    };
  } catch (error) {
    console.error('❌ Error testing display name:', error);
    return { error: error.message };
  }
};

// Run the test if this file is executed directly
if (typeof window !== 'undefined') {
  // Browser environment - you can call this from console
  window.testDisplayName = testDisplayName;
  console.log('Display name test function available. Call testDisplayName() to test display name functionality.');
}





