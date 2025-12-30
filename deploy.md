# Firebase Deployment Guide

## Prerequisites
1. Install Firebase CLI globally:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase in your project:
```bash
firebase init
```

## Build and Deploy

1. Build your React app:
```bash
npm run build
```

2. Deploy to Firebase:
```bash
firebase deploy
```

## Firebase Configuration

Your Firebase project is already configured with:
- **Project ID**: likhain-a21f2
- **Authentication**: Email/Password enabled
- **Firestore**: Database with security rules
- **Hosting**: Static site hosting

## Security Rules

The Firestore security rules are configured to:
- Allow public read access to poems and stories
- Require authentication for creating/updating content
- Allow users to manage their own content
- Grant admin users full access to all collections

## Environment Variables

Make sure your Firebase configuration is properly set in `src/firebase/config.js` with your project credentials.

## Testing

After deployment, you can test the application at:
- **Production URL**: https://likhain-a21f2.web.app
- **Firebase Console**: https://console.firebase.google.com/project/likhain-a21f2

## Database Structure

The Firestore database includes these collections:
- `users` - User profiles and authentication data
- `poems` - Poetry content with likes and metadata
- `stories` - Story content (if implemented)
- `follows` - User follow relationships
- `messages` - Chat messages between users
- `contentFlags` - Content moderation flags
- `contentDeletions` - Deleted content logs

## Monitoring

Monitor your application using:
- Firebase Analytics (already configured)
- Firestore usage in Firebase Console
- Authentication metrics
- Hosting performance





