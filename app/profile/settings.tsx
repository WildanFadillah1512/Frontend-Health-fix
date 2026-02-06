import { View, Text, StyleSheet, Pressable, Switch, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PRIMARY, BACKGROUND_DARK } from '@/constants/Colors';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useUser } from '@/context/UserContext';

export default function SettingsScreen() {
    const router = useRouter();
    const { signOut } = useAuth();
    const { userData, updatePreferences } = useUser();
    const prefs = userData.preferences;

    const handleSignOut = async () => {
        await signOut();
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </Pressable>
                <Text style={styles.title}>Settings</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.scroll} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Preferences</Text>

                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Ionicons name="notifications-outline" size={22} color="#fff" />
                            <Text style={styles.settingLabel}>Workout Reminders</Text>
                        </View>
                        <Switch
                            value={prefs.workoutReminder}
                            onValueChange={(val) => updatePreferences({ workoutReminder: val })}
                            trackColor={{ false: '#333', true: PRIMARY }}
                            thumbColor={prefs.workoutReminder ? '#000' : '#f4f3f4'}
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Ionicons name="moon-outline" size={22} color="#fff" />
                            <Text style={styles.settingLabel}>Dark Mode</Text>
                        </View>
                        <Switch
                            value={prefs.theme === 'dark'}
                            onValueChange={(val) => updatePreferences({ theme: val ? 'dark' : 'light' })}
                            trackColor={{ false: '#333', true: PRIMARY }}
                            thumbColor={prefs.theme === 'dark' ? '#000' : '#f4f3f4'}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Goals</Text>

                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Ionicons name="trophy-outline" size={22} color="#fff" />
                            <Text style={styles.settingLabel}>Daily Goal Alerts</Text>
                        </View>
                        <Switch
                            value={prefs.dailyGoalAlert}
                            onValueChange={(val) => updatePreferences({ dailyGoalAlert: val })}
                            trackColor={{ false: '#333', true: PRIMARY }}
                            thumbColor={prefs.dailyGoalAlert ? '#000' : '#f4f3f4'}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>

                    <Pressable style={styles.linkItem} onPress={handleSignOut}>
                        <Text style={[styles.settingLabel, { color: '#ef4444' }]}>Sign Out</Text>
                        <Ionicons name="log-out-outline" size={20} color="#ef4444" />
                    </Pressable>

                    <Pressable style={styles.linkItem}>
                        <Text style={[styles.settingLabel, { color: '#ef4444' }]}>Delete Account</Text>
                        <Ionicons name="trash-outline" size={20} color="#ef4444" />
                    </Pressable>
                </View>
                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BACKGROUND_DARK,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
    },
    contentContainer: {
        padding: 24,
        gap: 32,
        paddingBottom: 40,
    },
    scroll: {
        flex: 1,
    },
    section: {
        gap: 16,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: PRIMARY,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 16,
        borderRadius: 12,
    },
    settingInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    settingLabel: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '500',
    },
    linkItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        padding: 16,
        borderRadius: 12,
    }
});
