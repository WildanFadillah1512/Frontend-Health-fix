import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PRIMARY } from '@/constants/Colors';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: PRIMARY,
                tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.4)',
                tabBarStyle: {
                    backgroundColor: '#0f1d15',
                    borderTopWidth: 1,
                    borderTopColor: 'rgba(13, 242, 108, 0.1)',
                    height: 72,
                    paddingBottom: 12,
                    paddingTop: 8,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                },
            }}
        >
            <Tabs.Screen
                name="today"
                options={{
                    title: 'Today',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="nutrition"
                options={{
                    title: 'Nutrition',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="restaurant" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="workout"
                options={{
                    title: 'Workout',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="barbell" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="ai"
                options={{
                    title: 'AI Coach',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="flash" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
