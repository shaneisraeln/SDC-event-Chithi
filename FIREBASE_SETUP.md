# Firebase Setup Guide for Admin Dashboard

The admin dashboard now supports real-time multi-device tracking using Firebase Firestore. Here's how to set it up:

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `chitti-challenge` (or your preferred name)
4. Enable Google Analytics (optional)
5. Create project

## 2. Enable Firestore Database

1. In your Firebase project, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location (choose closest to your users)

## 3. Get Firebase Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps" section
3. Click "Web" icon (</>) to add a web app
4. Register app with name: `chitti-challenge-web`
5. Copy the Firebase configuration object

## 4. Add Environment Variables

Create or update your `.env.local` file with your Firebase config:

```env
# Groq AI API Key
GROQ_API_KEY=your_groq_api_key_here

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## 5. Firestore Security Rules (Optional)

For production, update Firestore rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write to submissions and users collections
    match /submissions/{document} {
      allow read, write: if true;
    }
    match /users/{document} {
      allow read, write: if true;
    }
    match /pageViews/{document} {
      allow read, write: if true;
    }
  }
}
```

## 6. Test the Setup

1. Start your development server: `npm run dev`
2. Navigate to a challenge and submit some code
3. Go to `/admin-dashboard` and login with password: `chitti-admin-2024`
4. You should see "🔥 Firebase Real-time" in the header if connected
5. Open another browser/device and submit code - it should appear in real-time

## Features

✅ **Real-time tracking** - See submissions as they happen  
✅ **Multi-device support** - Track users across different devices  
✅ **Automatic fallback** - Uses localStorage if Firebase fails  
✅ **User sessions** - Persistent user tracking with device info  
✅ **Live analytics** - Real-time success rates and statistics  
✅ **Code viewing** - See actual submitted code in admin panel  

## Troubleshooting

- **"💾 localStorage Fallback"** - Firebase connection failed, check your config
- **No real-time updates** - Verify Firestore rules allow read/write access
- **CORS errors** - Make sure your domain is authorized in Firebase settings

## Data Structure

The system creates these Firestore collections:

- `submissions` - All code submissions with results
- `users` - User activity and session tracking  
- `pageViews` - Page navigation tracking

Each document includes timestamps, user info, and device details for comprehensive analytics.