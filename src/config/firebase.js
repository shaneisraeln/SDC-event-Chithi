import {
    initializeApp
} from 'firebase/app'
import {
    getFirestore,
    connectFirestoreEmulator
} from 'firebase/firestore'
import {
    getAnalytics
} from 'firebase/analytics'

// Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "chitti-challenge.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "chitti-challenge",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "chitti-challenge.appspot.com",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef123456",
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-ABCDEF1234"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firestore
export const db = getFirestore(app)

// Initialize Analytics (optional)
let analytics = null
if (typeof window !== 'undefined') {
    try {
        analytics = getAnalytics(app)
    } catch (error) {
        console.log('Analytics not available:', error.message)
    }
}

export {
    analytics
}

// For development - connect to Firestore emulator if running locally
if (
    import.meta.env.DEV && !
    import.meta.env.VITE_FIREBASE_PROJECT_ID) {
    try {
        connectFirestoreEmulator(db, 'localhost', 8080)
        console.log('🔥 Connected to Firestore emulator')
    } catch (error) {
        console.log('Firestore emulator not available, using production')
    }
}

export default app