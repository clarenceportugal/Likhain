// Admin User Setup Script
// This script creates the hardcoded admin user in Firebase Realtime Database

import { realtimeService } from './realtime.js';

export const setupAdminUser = async () => {
  try {
    console.log('Setting up admin user...');
    
    const adminUser = {
      uid: 'renz42gal',
      email: 'renz42gal@likhain.com',
      name: 'Renz Gal',
      role: 'admin',
      bio: 'Administrator of Likhain Poetry Platform',
      location: 'Philippines',
      website: '',
      preferences: {
        language: 'filipino',
        notifications: true,
        publicProfile: true,
        emailUpdates: true
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const result = await realtimeService.users.create(adminUser);
    
    if (result.success) {
      console.log('✅ Admin user created successfully!');
      console.log('📧 Email: renz42gal@likhain.com');
      console.log('🔑 Password: 1493512');
      console.log('👑 Role: admin');
    } else {
      console.log('❌ Error creating admin user:', result.error);
    }
    
    return result;
  } catch (error) {
    console.error('❌ Error setting up admin user:', error);
    return { success: false, error: error.message };
  }
};

// Run the setup if this file is executed directly
if (typeof window !== 'undefined') {
  // Browser environment - you can call this from console
  window.setupAdminUser = setupAdminUser;
  console.log('Admin setup function available. Call setupAdminUser() to create admin user.');
}





