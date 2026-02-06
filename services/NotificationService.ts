import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import client from '@/api/client';

// Configure how notifications are presented when app is in foreground
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export const NotificationService = {
    registerForPushNotificationsAsync: async () => {
        let token: string | null = null;

        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                console.warn('⚠️ Push notification permission denied');
                return null;
            }

            try {
                // Get the Expo push token
                token = (await Notifications.getExpoPushTokenAsync({
                    projectId: 'your-project-id' // TODO: Replace with actual project ID from app.json
                })).data;

                console.log('✅ Expo Push Token:', token);
            } catch (error) {
                console.error('❌ Failed to get push token:', error);
                return null;
            }
        } else {
            console.warn('⚠️ Must use physical device for Push Notifications');
        }

        // Send token to backend
        if (token) {
            try {
                await client.post('/notifications/push-token', { token });
                console.log('✅ Push token sent to backend');
            } catch (error) {
                console.error('❌ Failed to send token to backend:', error);
            }
        }

        return token;
    },

    scheduleLocalNotification: async (title: string, body: string, trigger?: Notifications.NotificationTriggerInput) => {
        try {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title,
                    body,
                    data: { timestamp: Date.now() },
                },
                trigger: trigger || null, // null = immediate
            });
            console.log('✅ Local notification scheduled');
        } catch (error) {
            console.error('❌ Failed to schedule notification:', error);
        }
    }
};
