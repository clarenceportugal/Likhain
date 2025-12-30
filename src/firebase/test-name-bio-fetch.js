// Test Name and Bio Fetching from Database
// This script tests if the name and bio are properly fetched from the database

import { authService } from './auth.js';
import { realtimeService } from './realtime.js';

export const testNameBioFetch = async () => {
  console.log('🧪 Testing name and bio fetching from database...');
  
  try {
    // Test 1: Check current user from localStorage
    const currentUser = authService.getCurrentLoggedInUser();
    if (currentUser) {
      console.log('✅ Current user from localStorage:');
      console.log('👤 Name:', currentUser.name);
      console.log('📝 Bio:', currentUser.bio);
      console.log('📧 Email:', currentUser.email);
      console.log('👑 Role:', currentUser.role);
      console.log('🆔 UID:', currentUser.uid);
    } else {
      console.log('❌ No user found in localStorage');
    }
    
    // Test 2: Fetch user data directly from database
    if (currentUser) {
      console.log('\n🔍 Fetching user data from database...');
      const dbResult = await realtimeService.users.getById(currentUser.uid);
      if (dbResult.success) {
        console.log('✅ User data from database:');
        console.log('👤 Name:', dbResult.data.name);
        console.log('📝 Bio:', dbResult.data.bio);
        console.log('📧 Email:', dbResult.data.email);
        console.log('👑 Role:', dbResult.data.role);
        console.log('📍 Location:', dbResult.data.location);
        console.log('🌐 Website:', dbResult.data.website);
        
        // Compare with localStorage data
        if (currentUser.name !== dbResult.data.name) {
          console.log('⚠️ Name mismatch!');
          console.log('localStorage name:', currentUser.name);
          console.log('Database name:', dbResult.data.name);
        } else {
          console.log('✅ Name matches between localStorage and database');
        }
        
        if (currentUser.bio !== dbResult.data.bio) {
          console.log('⚠️ Bio mismatch!');
          console.log('localStorage bio:', currentUser.bio);
          console.log('Database bio:', dbResult.data.bio);
        } else {
          console.log('✅ Bio matches between localStorage and database');
        }
      } else {
        console.log('❌ Failed to fetch user data from database:', dbResult.error);
      }
    }
    
    // Test 3: Test admin user data
    console.log('\n🔍 Testing admin user data...');
    const adminResult = await authService.getUserData('renz42gal');
    if (adminResult.success) {
      console.log('✅ Admin user data:');
      console.log('👤 Name:', adminResult.data.name);
      console.log('📝 Bio:', adminResult.data.bio);
      console.log('📧 Email:', adminResult.data.email);
      console.log('👑 Role:', adminResult.data.role);
    } else {
      console.log('❌ Admin user not found:', adminResult.error);
    }
    
    // Test 4: Test updating name and bio
    if (currentUser && currentUser.uid !== 'renz42gal') {
      console.log('\n🔧 Testing name and bio update...');
      const testUpdate = {
        name: 'Test Name Update',
        bio: 'This is a test bio update from the database test function.',
        location: 'Test Location'
      };
      
      const updateResult = await realtimeService.users.update(currentUser.uid, testUpdate);
      if (updateResult.success) {
        console.log('✅ Name and bio update successful');
        
        // Fetch updated data
        const updatedResult = await realtimeService.users.getById(currentUser.uid);
        if (updatedResult.success) {
          console.log('✅ Updated data from database:');
          console.log('👤 Name:', updatedResult.data.name);
          console.log('📝 Bio:', updatedResult.data.bio);
        }
        
        // Revert the test update
        const revertUpdate = {
          name: currentUser.name,
          bio: currentUser.bio || '',
          location: currentUser.location || ''
        };
        await realtimeService.users.update(currentUser.uid, revertUpdate);
        console.log('✅ Test update reverted');
      } else {
        console.log('❌ Name and bio update failed:', updateResult.error);
      }
    }
    
    // Test 5: Check all users in database
    console.log('\n👥 Checking all users in database...');
    const allUsersResult = await realtimeService.users.getAll();
    if (allUsersResult.success) {
      console.log(`✅ Found ${allUsersResult.data.length} users in database:`);
      allUsersResult.data.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name} (${user.email}) - ${user.role}`);
        console.log(`   Bio: ${user.bio || 'No bio'}`);
      });
    } else {
      console.log('❌ Failed to fetch all users:', allUsersResult.error);
    }
    
    return {
      currentUser,
      dbResult: currentUser ? await realtimeService.users.getById(currentUser.uid) : null,
      adminResult,
      allUsers: allUsersResult.success ? allUsersResult.data : []
    };
  } catch (error) {
    console.error('❌ Error testing name and bio fetch:', error);
    return { error: error.message };
  }
};

// Run the test if this file is executed directly
if (typeof window !== 'undefined') {
  // Browser environment - you can call this from console
  window.testNameBioFetch = testNameBioFetch;
  console.log('Name and bio fetch test function available. Call testNameBioFetch() to test name and bio fetching.');
}





