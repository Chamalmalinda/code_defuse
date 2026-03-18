// Firebase configuration and initialization
// Used for Google OAuth authentication — Interoperability with Google's auth service
// Reference: Firebase docs - https://firebase.google.com/docs/web/setup
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

const firebaseConfig = {
    apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase app
const app      = initializeApp(firebaseConfig);
const auth     = getAuth(app);
const provider = new GoogleAuthProvider();

// Google Sign-in with popup
export const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, provider);
    return result.user;
};

// Sign out from Firebase
export const signOutFromGoogle = async () => {
    await signOut(auth);
};

export { auth };