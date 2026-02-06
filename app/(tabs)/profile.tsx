import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import GlassPanel from '@/components/GlassPanel';
import { PRIMARY, BACKGROUND_DARK } from '@/constants/Colors';
import { useUser } from '@/context/UserContext';
import { useAuth } from '@/context/AuthContext';
import PhotoUpload from '@/components/PhotoUpload';

export default function ProfileScreen() {
    const router = useRouter();
    const { userData, updateUserData } = useUser();
    const { signOut, user } = useAuth();

    // Calculate dynamic stats
    const totalCalories = userData.dailyStats.calories; // Or aggregate from history if available
    const workoutCount = userData.completedWorkouts.length;
    // Streak logic would go here, defaulting to mock for now or 0
    const streak = userData.currentStreak || 0;

    const stats = [
        { label: 'Workouts', value: workoutCount.toString(), icon: 'barbell' },
        { label: 'Streak', value: `${streak} days`, icon: 'flame' },
        { label: 'Calories', value: totalCalories.toString(), icon: 'restaurant' },
    ];

    const menuItems = [
        { title: 'Edit Profile', icon: 'person-outline', route: '/profile/edit' as const },
        { title: 'Edit Goals', icon: 'flag-outline', route: '/profile/goals' as const }, // Fixed route
        { title: 'Statistics', icon: 'stats-chart-outline', route: '/profile/statistics' as const },
        { title: 'Log Measurements', icon: 'body-outline', route: '/profile/measurements' as const },
        { title: 'Privacy & Security', icon: 'shield-checkmark-outline', route: '/profile/privacy' as const },
        { title: 'Help & Support', icon: 'help-circle-outline', route: '/profile/help' as const },
    ];

    const handleSignOut = async () => {
        try {
            await signOut();
            // router.replace('/auth/login'); // handled in AuthContext
        } catch (error) {
            console.error('Sign out failed:', error);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Profile</Text>
                <Pressable style={styles.settingsButton} onPress={() => router.push('/profile/settings')}>
                    <Ionicons name="settings-outline" size={24} color="#fff" />
                </Pressable>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Profile Card */}
                <GlassPanel style={styles.profileCard}>
                    <View style={styles.profileHeader}>

                        <View style={styles.avatarContainer}>
                            <PhotoUpload
                                currentImage={userData.avatar}
                                endpoint="/upload/profile" // Correct endpoint for profile photos
                                onUploadComplete={(url) => {
                                    console.log('Avatar updated:', url);
                                    updateUserData({ avatar: url });
                                }}
                                size={80}
                            />
                        </View>
                        <View style={styles.profileInfo}>
                            <Text style={styles.profileName}>{userData.name || 'User'}</Text>
                            <Text style={styles.profileEmail}>{user?.email || 'No Email'}</Text>
                            <View style={styles.goalBadge}>
                                <Ionicons name="trending-down" size={14} color={PRIMARY} />
                                <Text style={styles.goalText}>{userData.goal ? userData.goal.replace('_', ' ').toUpperCase() : 'GOAL'}</Text>
                            </View>
                        </View>
                    </View>
                </GlassPanel>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    {stats.map((stat, index) => (
                        <GlassPanel key={index} style={styles.statCard}>
                            <Ionicons name={stat.icon as any} size={24} color={PRIMARY} />
                            <Text style={styles.statValue}>{stat.value}</Text>
                            <Text style={styles.statLabel}>{stat.label}</Text>
                        </GlassPanel>
                    ))}
                </View>

                {/* Progress Summary */}
                <GlassPanel style={styles.progressCard}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>Current Progress</Text>
                        <Pressable onPress={() => router.push('/profile/statistics')}>
                            <Text style={styles.seeDetails}>Details</Text>
                        </Pressable>
                    </View>
                    <View style={styles.progressRow}>
                        <View style={styles.progressItem}>
                            <Text style={styles.progressLabel}>Current Weight</Text>
                            <Text style={styles.progressValue}>{userData.weight} kg</Text>
                        </View>
                        <View style={styles.progressDivider} />
                        <View style={styles.progressItem}>
                            <Text style={styles.progressLabel}>Target</Text>
                            <Text style={styles.progressValue}>{userData.targetWeight} kg</Text>
                        </View>
                    </View>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, {
                            width: userData.initialWeight && userData.targetWeight
                                ? `${Math.min(100, Math.max(0, ((userData.initialWeight - userData.weight) / (userData.initialWeight - userData.targetWeight)) * 100))}%`
                                : '0%'
                        }]} />
                    </View>
                    <Text style={styles.progressFooter}>
                        {Math.abs(userData.weight - userData.targetWeight).toFixed(1)} kg to go
                    </Text>
                </GlassPanel>

                {/* Menu Items */}
                <View style={styles.menuSection}>
                    {menuItems.map((item, index) => (
                        <Pressable
                            key={index}
                            style={styles.menuItem}
                            onPress={() => router.push(item.route)}
                        >
                            <View style={styles.menuIconContainer}>
                                <Ionicons name={item.icon as any} size={22} color={PRIMARY} />
                            </View>
                            <Text style={styles.menuTitle}>{item.title}</Text>
                            <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.3)" />
                        </Pressable>
                    ))}
                </View>

                {/* Logout Button */}
                <Pressable style={styles.logoutButton} onPress={handleSignOut}>
                    <Ionicons name="log-out-outline" size={20} color="#ef4444" />
                    <Text style={styles.logoutText}>Sign Out</Text>
                </Pressable>

                <View style={{ height: 80 }} />
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
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    settingsButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    profileCard: {
        marginBottom: 20,
        padding: 20,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: PRIMARY,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 32,
        fontWeight: '700',
        color: '#000',
    },
    levelBadge: {
        position: 'absolute',
        bottom: 0,
        right: -4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        backgroundColor: BACKGROUND_DARK,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 9999,
        borderWidth: 2,
        borderColor: PRIMARY,
    },
    levelText: {
        fontSize: 12,
        fontWeight: '700',
        color: PRIMARY,
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontSize: 22,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    profileEmail: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.5)',
        marginBottom: 8,
    },
    goalBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 9999,
        backgroundColor: 'rgba(13, 242, 108, 0.15)',
        borderWidth: 1,
        borderColor: 'rgba(13, 242, 108, 0.3)',
    },
    goalText: {
        fontSize: 12,
        fontWeight: '600',
        color: PRIMARY,
    },
    statsGrid: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
        padding: 16,
        gap: 8,
    },
    statValue: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    statLabel: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.5)',
    },
    progressCard: {
        marginBottom: 24,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    seeDetails: {
        fontSize: 14,
        color: PRIMARY,
        fontWeight: '600',
    },
    progressRow: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    progressItem: {
        flex: 1,
    },
    progressLabel: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.5)',
        marginBottom: 4,
    },
    progressValue: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    progressDivider: {
        width: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginHorizontal: 16,
    },
    progressBar: {
        height: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 12,
    },
    progressFill: {
        height: '100%',
        backgroundColor: PRIMARY,
        borderRadius: 4,
    },
    progressFooter: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.6)',
        textAlign: 'center',
    },
    menuSection: {
        gap: 8,
        marginBottom: 24,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        padding: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    menuIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(13, 242, 108, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuTitle: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.3)',
        backgroundColor: 'rgba(239, 68, 68, 0.05)',
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ef4444',
    },
});
