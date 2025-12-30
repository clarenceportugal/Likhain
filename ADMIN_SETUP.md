# 🔐 Admin User Setup Guide

## Admin User Credentials

**Email:** `renz42gal@likhain.com`  
**Password:** `1493512`  
**Role:** `admin`

## 🚀 Quick Setup

### Option 1: Automatic Setup (Recommended)
The admin user is automatically created when the app initializes. Just run the app and the admin user will be available.

### Option 2: Manual Setup
If you need to manually create the admin user, you can run this in the browser console:

```javascript
// Import and run the admin setup
import { setupAdminUser } from './src/firebase/admin-setup.js';
setupAdminUser();
```

### Option 3: Test Login
To test if the admin login works:

```javascript
// Import and run the login test
import { testLogin } from './src/firebase/test-login.js';
testLogin();
```

## 🔧 Firebase Configuration

The app is now configured to use **Firebase Realtime Database** with the following setup:

### Database Structure
```
likhain-a21f2-default-rtdb/
├── users/
│   ├── renz42gal/          # Admin user (hardcoded)
│   ├── sample_user_1/      # Sample users
│   ├── sample_user_2/
│   └── ...
├── poems/
│   ├── poem_1/             # Sample poems
│   ├── poem_2/
│   └── ...
├── stories/
│   ├── story_1/            # Sample stories
│   └── ...
└── messages/
    ├── message_1/          # Chat messages
    └── ...
```

### Admin User Data Structure
```json
{
  "uid": "renz42gal",
  "email": "renz42gal@likhain.com",
  "name": "Renz Gal",
  "role": "admin",
  "bio": "Administrator of Likhain Poetry Platform",
  "location": "Philippines",
  "website": "",
  "preferences": {
    "language": "filipino",
    "notifications": true,
    "publicProfile": true,
    "emailUpdates": true
  },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## 🛡️ Security Features

### Hardcoded Admin Protection
- Admin user credentials are hardcoded in the authentication service
- Admin user data cannot be modified through the UI
- Admin user is always available even if database is empty

### Authentication Flow
1. **Admin Login**: Checks hardcoded credentials first
2. **Regular Users**: Uses Firebase Authentication + Realtime Database
3. **Fallback**: If Firebase fails, uses mock data

## 📱 How to Login as Admin

1. **Open the app** in your browser
2. **Click "Login"** button
3. **Enter credentials:**
   - Email: `renz42gal@likhain.com`
   - Password: `1493512`
4. **Click "Sign In"**
5. **You're now logged in as admin!** 🎉

## 🔍 Admin Features

Once logged in as admin, you'll have access to:

- ✅ **Full Admin Panel** in Settings
- ✅ **User Management** - View, edit, delete users
- ✅ **Content Management** - Manage poems and stories
- ✅ **Analytics Dashboard** - View platform statistics
- ✅ **All User Features** - Upload, like, comment, chat

## 🚨 Troubleshooting

### Login Not Working?
1. Check if Firebase is properly initialized
2. Verify the credentials are exactly as shown above
3. Check browser console for any errors
4. Try refreshing the page

### Database Connection Issues?
1. Check Firebase project configuration
2. Verify Realtime Database is enabled
3. Check database rules allow read/write access

### Admin Panel Not Showing?
1. Make sure you're logged in with admin credentials
2. Check if `user.role === 'admin'` in the console
3. Verify the Settings page is loading correctly

## 📞 Support

If you encounter any issues:
1. Check the browser console for error messages
2. Verify Firebase project settings
3. Ensure all dependencies are installed
4. Try clearing browser cache and cookies

---

**Note:** The admin user is hardcoded for security and will always be available regardless of database state.





