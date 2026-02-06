declare module 'firebase/app' {
    export const initializeApp: any;
    export const getApp: any;
    export const getApps: any;
    export type FirebaseApp = any;
}

declare module 'firebase/auth' {
    export const getAuth: any;
    export const initializeAuth: any;
    export const getReactNativePersistence: any;
    export const onAuthStateChanged: any;
    export const signOut: any;
    export const signInWithEmailAndPassword: any;
    export const createUserWithEmailAndPassword: any;
    export type User = any;
    export type Auth = any;
}

declare module '@firebase/auth/dist/rn' {
    export const getReactNativePersistence: any;
}

declare module '@react-native-async-storage/async-storage' {
    const AsyncStorage: any;
    export default AsyncStorage;
}
