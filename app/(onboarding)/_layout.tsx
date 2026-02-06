import { Stack } from 'expo-router';

export default function OnboardingLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: 'fade',
                contentStyle: { backgroundColor: '#102217' },
            }}
        >
            <Stack.Screen name="welcome" />
            <Stack.Screen name="physical-data" />
            <Stack.Screen name="goals" />
            <Stack.Screen name="activity-level" />
            <Stack.Screen name="promise" />
        </Stack>
    );
}
