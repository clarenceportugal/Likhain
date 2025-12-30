// Test Profile Image Functionality
// This script tests if profile images are properly converted to base64 and stored

import { authService } from './auth.js';
import { realtimeService } from './realtime.js';

export const testProfileImage = async () => {
  console.log('🧪 Testing profile image functionality...');
  
  try {
    // Test 1: Check current user profile image
    const currentUser = authService.getCurrentLoggedInUser();
    if (currentUser) {
      console.log('✅ Current user profile image status:');
      console.log('👤 Name:', currentUser.name);
      console.log('🖼️ Has profile image:', !!currentUser.profileImage);
      if (currentUser.profileImage) {
        console.log('📏 Image size:', currentUser.profileImage.length, 'characters');
        console.log('🔍 Image type:', currentUser.profileImage.substring(0, 20) + '...');
      }
    } else {
      console.log('❌ No user found in localStorage');
    }
    
    // Test 2: Test base64 conversion
    console.log('\n🔧 Testing base64 conversion...');
    
    // Create a simple test image (1x1 pixel PNG)
    const testImageData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    
    // Test updating user profile with image
    if (currentUser && currentUser.uid !== 'renz42gal') {
      console.log('📝 Testing profile image update...');
      const updateResult = await realtimeService.users.update(currentUser.uid, {
        profileImage: testImageData
      });
      
      if (updateResult.success) {
        console.log('✅ Profile image update successful');
        
        // Verify the update
        const verifyResult = await realtimeService.users.getById(currentUser.uid);
        if (verifyResult.success && verifyResult.data.profileImage) {
          console.log('✅ Profile image verified in database');
          console.log('📏 Stored image size:', verifyResult.data.profileImage.length, 'characters');
          console.log('🔍 Stored image type:', verifyResult.data.profileImage.substring(0, 20) + '...');
        }
        
        // Revert the test update
        await realtimeService.users.update(currentUser.uid, {
          profileImage: currentUser.profileImage || ''
        });
        console.log('✅ Test profile image reverted');
      } else {
        console.log('❌ Profile image update failed:', updateResult.error);
      }
    }
    
    // Test 3: Test admin profile image
    console.log('\n👑 Testing admin profile image...');
    const adminResult = await realtimeService.users.getById('renz42gal');
    if (adminResult.success) {
      console.log('✅ Admin user profile image status:');
      console.log('🖼️ Has profile image:', !!adminResult.data.profileImage);
      if (adminResult.data.profileImage) {
        console.log('📏 Image size:', adminResult.data.profileImage.length, 'characters');
      }
    } else {
      console.log('❌ Admin user not found:', adminResult.error);
    }
    
    // Test 4: Test image validation
    console.log('\n🔍 Testing image validation...');
    
    // Test invalid base64
    const invalidBase64 = 'invalid-base64-string';
    console.log('❌ Invalid base64 test:', invalidBase64);
    
    // Test valid base64
    const validBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    console.log('✅ Valid base64 test:', validBase64.substring(0, 30) + '...');
    
    // Test 5: Check all users for profile images
    console.log('\n👥 Checking all users for profile images...');
    const allUsersResult = await realtimeService.users.getAll();
    if (allUsersResult.success) {
      console.log(`✅ Found ${allUsersResult.data.length} users:`);
      allUsersResult.data.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name} - Profile image: ${user.profileImage ? 'Yes' : 'No'}`);
        if (user.profileImage) {
          console.log(`   📏 Image size: ${user.profileImage.length} characters`);
        }
      });
    } else {
      console.log('❌ Failed to fetch all users:', allUsersResult.error);
    }
    
    return {
      currentUserHasImage: currentUser ? !!currentUser.profileImage : false,
      adminHasImage: adminResult.success ? !!adminResult.data.profileImage : false,
      totalUsers: allUsersResult.success ? allUsersResult.data.length : 0,
      usersWithImages: allUsersResult.success ? allUsersResult.data.filter(u => u.profileImage).length : 0
    };
  } catch (error) {
    console.error('❌ Error testing profile image:', error);
    return { error: error.message };
  }
};

// Helper function to create a test image
export const createTestImage = () => {
  // Create a simple 1x1 pixel PNG image
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(0, 0, 1, 1);
  return canvas.toDataURL('image/png');
};

// Run the test if this file is executed directly
if (typeof window !== 'undefined') {
  // Browser environment - you can call this from console
  window.testProfileImage = testProfileImage;
  window.createTestImage = createTestImage;
  console.log('Profile image test functions available:');
  console.log('- testProfileImage() - Test profile image functionality');
  console.log('- createTestImage() - Create a test image for testing');
}





