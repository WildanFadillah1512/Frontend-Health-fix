import { View, Text, StyleSheet, ScrollView, Pressable, Switch } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import GlassPanel from '@/components/GlassPanel';
import { PRIMARY, BACKGROUND_DARK } from '@/constants/Colors';

export default function PrivacyScreen() {
    const router = useRouter();
    const [settings, setSettings] = useState({
        profileVisibility: true,
        activitySharing: false,
        dataTracking: true,
        notifications: true,
        biometricLogin: false,
    });

    const toggleSetting = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </Pressable>
                <Text style={styles.headerTitle}>Privacy & Security</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                {/* Privacy Settings */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Privacy</Text>

                    <GlassPanel style={styles.settingCard}>
                        <View style={styles.settingRow}>
                            <View style={styles.settingIcon}>
                                <Ionicons name="eye-outline" size={20} color={PRIMARY} />
                            </View>
                            <View style={styles.settingInfo}>
                                <Text style={styles.settingTitle}>Profile Visibility</Text>
                                <Text style={styles.settingDesc}>Allow others to see your profile</Text>
                            </View>
                            <Switch
                                value={settings.profileVisibility}
                                onValueChange={() => toggleSetting('profileVisibility')}
                                trackColor={{ false: 'rgba(255,255,255,0.1)', true: PRIMARY }}
                                thumbColor="#fff"
                            />
                        </View>
                    </GlassPanel>

                    <GlassPanel style={styles.settingCard}>
                        <View style={styles.settingRow}>
                            <View style={styles.settingIcon}>
                                <Ionicons name="share-social-outline" size={20} color={PRIMARY} />
                            </View>
                            <View style={styles.settingInfo}>
                                <Text style={styles.settingTitle}>Activity Sharing</Text>
                                <Text style={styles.settingDesc}>Share workouts with friends</Text>
                            </View>
                            <Switch
                                value={settings.activitySharing}
                                onValueChange={() => toggleSetting('activitySharing')}
                                trackColor={{ false: 'rgba(255,255,255,0.1)', true: PRIMARY }}
                                thumbColor="#fff"
                            />
                        </View>
                    </GlassPanel>

                    <GlassPanel style={styles.settingCard}>
                        <View style={styles.settingRow}>
                            <View style={styles.settingIcon}>
                                <Ionicons name="analytics-outline" size={20} color={PRIMARY} />
                            </View>
                            <View style={styles.settingInfo}>
                                <Text style={styles.settingTitle}>Data Tracking</Text>
                                <Text style={styles.settingDesc}>Improve recommendations</Text>
                            </View>
                            <Switch
                                value={settings.dataTracking}
                                onValueChange={() => toggleSetting('dataTracking')}
                                trackColor={{ false: 'rgba(255,255,255,0.1)', true: PRIMARY }}
                                thumbColor="#fff"
                            />
                        </View>
                    </GlassPanel>
                </View>

                {/* Security Settings */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Security</Text>

                    <GlassPanel style={styles.settingCard}>
                        <View style={styles.settingRow}>
                            <View style={styles.settingIcon}>
                                <Ionicons name="finger-print-outline" size={20} color={PRIMARY} />
                            </View>
                            <View style={styles.settingInfo}>
                                <Text style={styles.settingTitle}>Biometric Login</Text>
                                <Text style={styles.settingDesc}>Use fingerprint or face ID</Text>
                            </View>
                            <Switch
                                value={settings.biometricLogin}
                                onValueChange={() => toggleSetting('biometricLogin')}
                                trackColor={{ false: 'rgba(255,255,255,0.1)', true: PRIMARY }}
                                thumbColor="#fff"
                            />
                        </View>
                    </GlassPanel>

                    <Pressable style={styles.actionButton}>
                        <View style={styles.actionIcon}>
                            <Ionicons name="key-outline" size={20} color={PRIMARY} />
                        </View>
                        <View style={styles.actionInfo}>
                            <Text style={styles.actionTitle}>Change Password</Text>
                            <Text style={styles.actionDesc}>Update your password</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.3)" />
                    </Pressable>

                    <Pressable style={styles.actionButton}>
                        <View style={styles.actionIcon}>
                            <Ionicons name="phone-portrait-outline" size={20} color={PRIMARY} />
                        </View>
                        <View style={styles.actionInfo}>
                            <Text style={styles.actionTitle}>Manage Devices</Text>
                            <Text style={styles.actionDesc}>3 active devices</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.3)" />
                    </Pressable>
                </View>

                {/* Data Management */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Data Management</Text>

                    <Pressable style={styles.actionButton}>
                        <View style={styles.actionIcon}>
                            <Ionicons name="download-outline" size={20} color={PRIMARY} />
                        </View>
                        <View style={styles.actionInfo}>
                            <Text style={styles.actionTitle}>Download My Data</Text>
                            <Text style={styles.actionDesc}>Export all your information</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.3)" />
                    </Pressable>

                    <Pressable style={[styles.actionButton, styles.dangerButton]}>
                        <View style={[styles.actionIcon, styles.dangerIcon]}>
                            <Ionicons name="trash-outline" size={20} color="#ef4444" />
                        </View>
                        <View style={styles.actionInfo}>
                            <Text style={[styles.actionTitle, styles.dangerText]}>Delete Account</Text>
                            <Text style={styles.actionDesc}>Permanently remove your account</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="rgba(239,68,68,0.3)" />
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
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 48,
        paddingBottom: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: 20,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: 'rgba(255, 255, 255, 0.5)',
        marginBottom: 12,
        letterSpacing: 1,
    },
    settingCard: {
        padding: 16,
        marginBottom: 12,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    settingIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(13, 242, 108, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    settingInfo: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 2,
    },
    settingDesc: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.5)',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        marginBottom: 12,
    },
    actionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(13, 242, 108, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionInfo: {
        flex: 1,
    },
    actionTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 2,
    },
    actionDesc: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.5)',
    },
    dangerButton: {
        borderColor: 'rgba(239, 68, 68, 0.2)',
    },
    dangerIcon: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
    },
    dangerText: {
        color: '#ef4444',
    },
});
