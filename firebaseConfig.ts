import { initializeApp, getApps, getApp } from 'firebase/app';
import type { FirebaseApp } from 'firebase/app';
import { getAuth, initializeAuth } from 'firebase/auth';
// @ts-ignore
import { getReactNativePersistence } from '@firebase/auth/dist/rn';
import type { Auth } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Firebase Configuration - Production Ready
const firebaseConfig = {
    apiKey: "AIzaSyDRKaEOezwQSQqwO8ddM9tsa5JYuVkuc70",
    authDomain: "todo-list-2274d.firebaseapp.com",
    projectId: "todo-list-2274d",
    storageBucket: "todo-list-2274d.firebasestorage.app",
    messagingSenderId: "880308315487",
    appId: "1:880308315487:web:1caf2ae4d418c72df282ea",
    measurementId: "G-HZFZ8N8NTE"
};

let app: FirebaseApp;
let auth: Auth;


if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    // Initialize Auth with AsyncStorage persistence for React Native
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage)
    });
} else {
    app = getApp();
    auth = getAuth(app);
}

export { auth };
