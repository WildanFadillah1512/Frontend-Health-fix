import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useRouter, useSegments } from 'expo-router';
import client from '../api/client';
import { DatabaseService } from '../services/DatabaseService';

type AuthContextType = {
    user: User | null;
    isLoading: boolean;
    hasOnboarded: boolean;
    setHasOnboarded: (value: boolean) => void;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasOnboarded, setHasOnboarded] = useState(false);
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser: User | null) => {
            setUser(currentUser);

            if (currentUser) {
                // Check onboarding status from SQLite
                try {
                    const localUser = DatabaseService.getUser(currentUser.uid);
                    if (localUser) {
                        setHasOnboarded(localUser.hasOnboarded === 1);
                        console.log('🔍 Onboarding status:', localUser.hasOnboarded === 1);
                    } else {
                        setHasOnboarded(false);
                    }
                } catch (error) {
                    console.log('Could not load onboarding status from SQLite');
                    setHasOnboarded(false);
                }

                // Attempt to sync/fetch profile from backend
                try {
                    await client.get('/user/profile');
                } catch (error) {
                    console.log('Profile sync error (might be first login):', error);
                }
            } else {
                setHasOnboarded(false);
            }

            setIsLoading(false);
        });

        return unsubscribe;
    }, []);

    // Protected Route Logic with Onboarding Flow + Email Verification
    useEffect(() => {
        if (isLoading) return;

        const inAuthGroup = segments[0] === 'auth';
        const inOnboarding = segments[0] === '(onboarding)';
        const inTabs = segments[0] === '(tabs)';

        console.log('🔀 Route Check:', {
            hasUser: !!user,
            emailVerified: user?.emailVerified,
            hasOnboarded,
            segment: segments[0]
        });

        if (!user && !inAuthGroup) {
            // Not logged in -> Redirect to login
            console.log('→ Redirecting to /auth/login (no user)');
            router.replace('/auth/login');
        } else if (user && !user.emailVerified && segments[0] !== 'auth') {
            // User logged in but email not verified -> Redirect to verify email
            console.log('→ Redirecting to /auth/verify-email (email not verified)');
            router.replace('/auth/verify-email');
        } else if (user && user.emailVerified && !hasOnboarded && !inOnboarding && !inAuthGroup) {
            // Logged in, verified, but not onboarded -> Redirect to onboarding
            console.log('→ Redirecting to /(onboarding)/welcome (user not onboarded)');
            router.replace('/(onboarding)/welcome');
        } else if (user && user.emailVerified && hasOnboarded && (inAuthGroup || inOnboarding)) {
            // Logged in, verified, and onboarded but still on auth/onboarding -> Redirect to main app
            console.log('→ Redirecting to /(tabs)/today (user already onboarded)');
            router.replace('/(tabs)/today');
        }
    }, [user, user?.emailVerified, hasOnboarded, segments, isLoading]);

    const signOut = async () => {
        await firebaseSignOut(auth);
        setHasOnboarded(false);
        router.replace('/auth/login');
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, hasOnboarded, setHasOnboarded, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
