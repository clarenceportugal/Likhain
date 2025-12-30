// Test Profile Image Fix
// This script tests if the profile image functionality is working correctly

import { authService } from './auth.js';
import { realtimeService } from './realtime.js';

export const testProfileImageFix = async () => {
  console.log('🧪 Testing profile image fix...');
  
  try {
    // Test 1: Check admin user profile image field
    console.log('🔍 Checking admin user profile image field...');
    const adminResult = await realtimeService.users.getById('renz42gal');
    if (adminResult.success) {
      console.log('✅ Admin user data:');
      console.log('👤 Name:', adminResult.data.name);
      console.log('🖼️ Profile image field exists:', 'profileImage' in adminResult.data);
      console.log('🖼️ Profile image value:', adminResult.data.profileImage || 'empty');
    } else {
      console.log('❌ Admin user not found:', adminResult.error);
    }
    
    // Test 2: Update admin user with a test profile image
    console.log('\n🔧 Testing admin profile image update...');
    const testImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    
    const updateResult = await realtimeService.users.update('renz42gal', {
      profileImage: testImage
    });
    
    if (updateResult.success) {
      console.log('✅ Admin profile image update successful');
      
      // Verify the update
      const verifyResult = await realtimeService.users.getById('renz42gal');
      if (verifyResult.success) {
        console.log('✅ Profile image verified in database');
        console.log('📏 Image size:', verifyResult.data.profileImage.length, 'characters');
      }
      
      // Revert the test update
      await realtimeService.users.update('renz42gal', {
        profileImage: ''
      });
      console.log('✅ Test profile image reverted');
    } else {
      console.log('❌ Admin profile image update failed:', updateResult.error);
    }
    
    // Test 3: Check all users for profile image field
    console.log('\n👥 Checking all users for profile image field...');
    const allUsersResult = await realtimeService.users.getAll();
    if (allUsersResult.success) {
      console.log(`✅ Found ${allUsersResult.data.length} users:`);
      allUsersResult.data.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name}`);
        console.log(`   🖼️ Profile image field: ${'profileImage' in user ? 'Yes' : 'No'}`);
        console.log(`   🖼️ Profile image value: ${user.profileImage || 'empty'}`);
      });
    } else {
      console.log('❌ Failed to fetch all users:', allUsersResult.error);
    }
    
    // Test 4: Test login with profile image
    console.log('\n🔐 Testing login with profile image...');
    const loginResult = await authService.signIn('renz42gal@likhain.com', '1493512');
    if (loginResult.success) {
      console.log('✅ Admin login successful');
      console.log('🖼️ Profile image in login result:', !!loginResult.user.profileImage);
      if (loginResult.user.profileImage) {
        console.log('📏 Image size:', loginResult.user.profileImage.length, 'characters');
      }
    } else {
      console.log('❌ Admin login failed:', loginResult.error);
    }
    
    return {
      adminHasProfileImageField: adminResult.success ? 'profileImage' in adminResult.data : false,
      updateSuccessful: updateResult.success,
      totalUsers: allUsersResult.success ? allUsersResult.data.length : 0,
      loginSuccessful: loginResult.success
    };
  } catch (error) {
    console.error('❌ Error testing profile image fix:', error);
    return { error: error.message };
  }
};

// Run the test if this file is executed directly
if (typeof window !== 'undefined') {
  // Browser environment - you can call this from console
  window.testProfileImageFix = testProfileImageFix;
  console.log('Profile image fix test function available. Call testProfileImageFix() to test the fix.');
}





