import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { UserProvider } from '@/context/UserContext';
import { AuthProvider } from '@/context/AuthContext';

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <AuthProvider>
                <UserProvider>
                    <Stack
                        screenOptions={{
                            headerShown: false,
                            contentStyle: { backgroundColor: '#102217' },
                            animation: 'fade',
                        }}
                    >
                        <Stack.Screen name="index" />
                        <Stack.Screen name="+not-found" />
                        <Stack.Screen name="auth" />
                        <Stack.Screen name="(onboarding)" />
                        <Stack.Screen name="(tabs)" />
                    </Stack>
                    <StatusBar style="light" />
                </UserProvider>
            </AuthProvider>
        </SafeAreaProvider>
    );
}
