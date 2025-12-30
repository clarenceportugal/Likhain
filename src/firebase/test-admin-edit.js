// Test Admin Profile Editing
// This script tests if the admin profile can be edited

import { authService } from './auth.js';
import { realtimeService } from './realtime.js';

export const testAdminEdit = async () => {
  console.log('🧪 Testing admin profile editing...');
  
  try {
    // Test 1: Check if admin user exists in database
    console.log('🔍 Checking admin user in database...');
    const adminResult = await realtimeService.users.getById('renz42gal');
    if (adminResult.success) {
      console.log('✅ Admin user found in database:');
      console.log('👤 Name:', adminResult.data.name);
      console.log('📝 Bio:', adminResult.data.bio);
      console.log('📧 Email:', adminResult.data.email);
      console.log('👑 Role:', adminResult.data.role);
    } else {
      console.log('❌ Admin user not found in database:', adminResult.error);
      return { error: 'Admin user not found' };
    }
    
    // Test 2: Test admin login
    console.log('\n🔐 Testing admin login...');
    const loginResult = await authService.signIn('renz42gal@likhain.com', '1493512');
    if (loginResult.success) {
      console.log('✅ Admin login successful:');
      console.log('👤 Name:', loginResult.user.name);
      console.log('📝 Bio:', loginResult.user.bio);
    } else {
      console.log('❌ Admin login failed:', loginResult.error);
    }
    
    // Test 3: Test updating admin profile
    console.log('\n✏️ Testing admin profile update...');
    const testUpdate = {
      name: 'Renz Gal (Updated)',
      bio: 'Updated bio for admin user - this should work now!',
      location: 'Philippines (Updated)',
      website: 'https://likhain.com'
    };
    
    const updateResult = await realtimeService.users.update('renz42gal', testUpdate);
    if (updateResult.success) {
      console.log('✅ Admin profile update successful!');
      console.log('👤 Updated name:', testUpdate.name);
      console.log('📝 Updated bio:', testUpdate.bio);
      
      // Verify the update
      const verifyResult = await realtimeService.users.getById('renz42gal');
      if (verifyResult.success) {
        console.log('✅ Update verified in database:');
        console.log('👤 Name:', verifyResult.data.name);
        console.log('📝 Bio:', verifyResult.data.bio);
        console.log('📍 Location:', verifyResult.data.location);
        console.log('🌐 Website:', verifyResult.data.website);
      }
      
      // Revert the test update
      const revertUpdate = {
        name: 'Renz Gal',
        bio: 'Administrator of Likhain Poetry Platform',
        location: 'Philippines',
        website: ''
      };
      await realtimeService.users.update('renz42gal', revertUpdate);
      console.log('✅ Test update reverted');
    } else {
      console.log('❌ Admin profile update failed:', updateResult.error);
    }
    
    // Test 4: Test auth service update
    console.log('\n🔧 Testing auth service update...');
    const authUpdateResult = await authService.updateUserProfile('renz42gal', {
      name: 'Renz Gal (Auth Test)',
      bio: 'Testing auth service update'
    });
    if (authUpdateResult.success) {
      console.log('✅ Auth service update successful');
      
      // Revert
      await authService.updateUserProfile('renz42gal', {
        name: 'Renz Gal',
        bio: 'Administrator of Likhain Poetry Platform'
      });
      console.log('✅ Auth service test reverted');
    } else {
      console.log('❌ Auth service update failed:', authUpdateResult.error);
    }
    
    return {
      adminExists: adminResult.success,
      loginSuccess: loginResult.success,
      updateSuccess: updateResult.success,
      authUpdateSuccess: authUpdateResult.success
    };
  } catch (error) {
    console.error('❌ Error testing admin edit:', error);
    return { error: error.message };
  }
};

// Run the test if this file is executed directly
if (typeof window !== 'undefined') {
  // Browser environment - you can call this from console
  window.testAdminEdit = testAdminEdit;
  console.log('Admin edit test function available. Call testAdminEdit() to test admin profile editing.');
}





