import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import CircularProgress from '@/components/CircularProgress';
import GlassPanel from '@/components/GlassPanel';
import { PRIMARY, BACKGROUND_DARK } from '@/constants/Colors';
import { useUser } from '@/context/UserContext';
import client from '@/api/client';

export default function TodayScreen() {
    const router = useRouter();
    const { userData } = useUser();
    const [recommendedWorkout, setRecommendedWorkout] = useState<any>(null);
    const [isLoadingRecommendation, setIsLoadingRecommendation] = useState(true);

    useEffect(() => {
        const fetchRecommendation = async () => {
            try {
                const response = await client.get('/recommendations/workout');
                setRecommendedWorkout(response.data);
            } catch (error) {
                console.error('Failed to fetch recommendation:', error);
            } finally {
                setIsLoadingRecommendation(false);
            }
        };
        fetchRecommendation();
    }, []);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Hello, {userData.name}</Text>
                    <Text style={styles.date}>
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                    </Text>
                </View>
                <Pressable style={styles.notificationButton} onPress={() => router.push('/notifications')}>
                    <Ionicons name="notifications-outline" size={24} color="#fff" />
                    {userData.notifications?.filter(n => !n.read).length > 0 && (
                        <View style={styles.notificationBadge}>
                            {userData.notifications.filter(n => !n.read).length > 1 && (
                                <Text style={styles.badgeCount}>
                                    {userData.notifications.filter(n => !n.read).length}
                                </Text>
                            )}
                        </View>
                    )}
                </Pressable>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Activity Rings */}
                <GlassPanel style={styles.ringsCard}>
                    <Text style={styles.cardTitle}>Today's Activity</Text>
                    <View style={styles.ringsContainer}>
                        <View style={styles.ring}>
                            <CircularProgress
                                size={160}
                                strokeWidth={14}
                                progress={Math.min(userData.dailyStats.calories / 2400, 1)} // Assuming 2400 as default goal if not in user data
                                color={PRIMARY}
                            >
                                <CircularProgress
                                    size={120}
                                    strokeWidth={12}
                                    progress={Math.min(userData.dailyStats.workouts / 4, 1)} // Assuming 4 workouts/week goal
                                    color="#ec4899"
                                >
                                    <CircularProgress
                                        size={85}
                                        strokeWidth={10}
                                        progress={Math.min(userData.dailyStats.minutes / 60, 1)}
                                        color="#f59e0b"
                                    >
                                        <View style={styles.ringCenter}>
                                            <Ionicons name="flame" size={24} color={PRIMARY} />
                                            <Text style={styles.ringValue}>{userData.dailyStats.calories}</Text>
                                            <Text style={styles.ringUnit}>kcal</Text>
                                        </View>
                                    </CircularProgress>
                                </CircularProgress>
                            </CircularProgress>
                        </View>

                        <View style={styles.ringLegend}>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendDot, { backgroundColor: PRIMARY }]} />
                                <View>
                                    <Text style={styles.legendValue}>{userData.dailyStats.calories} / 2400</Text>
                                    <Text style={styles.legendLabel}>Calories</Text>
                                </View>
                            </View>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendDot, { backgroundColor: '#ec4899' }]} />
                                <View>
                                    <Text style={styles.legendValue}>{userData.dailyStats.workouts}</Text>
                                    <Text style={styles.legendLabel}>Workouts</Text>
                                </View>
                            </View>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendDot, { backgroundColor: '#f59e0b' }]} />
                                <View>
                                    <Text style={styles.legendValue}>{userData.dailyStats.minutes} / 60</Text>
                                    <Text style={styles.legendLabel}>Exercise (min)</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </GlassPanel>

                {/* Hydration & Recovery */}
                <View style={{ flexDirection: 'row', gap: 16, marginBottom: 20 }}>
                    <GlassPanel style={{ flex: 1, padding: 16 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                            <Ionicons name="water" size={20} color="#06b6d4" />
                            <Text style={{ color: '#fff', fontWeight: '700' }}>Water</Text>
                        </View>
                        <Text style={{ fontSize: 24, fontWeight: '700', color: '#fff' }}>
                            {userData.dailyStats.water} <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>ml</Text>
                        </Text>
                        <View style={{ height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3, marginTop: 8 }}>
                            <View style={{ width: `${Math.min((userData.dailyStats.water / 2500) * 100, 100)}%`, height: '100%', backgroundColor: '#06b6d4', borderRadius: 3 }} />
                        </View>
                    </GlassPanel>

                    <GlassPanel style={{ flex: 1, padding: 16 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                            <Ionicons name="bed" size={20} color="#8b5cf6" />
                            <Text style={{ color: '#fff', fontWeight: '700' }}>Sleep</Text>
                        </View>
                        <Text style={{ fontSize: 24, fontWeight: '700', color: '#fff' }}>
                            {userData.dailyStats.sleep} <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>h</Text>
                        </Text>
                        <View style={{ height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3, marginTop: 8 }}>
                            <View style={{ width: `${Math.min((userData.dailyStats.sleep / 8) * 100, 100)}%`, height: '100%', backgroundColor: '#8b5cf6', borderRadius: 3 }} />
                        </View>
                    </GlassPanel>
                </View>

                {/* Quick Actions Grid */}
                <View style={styles.quickActions}>
                    <Pressable style={styles.actionCard} onPress={() => router.push('/nutrition/log')}>
                        <Ionicons name="restaurant" size={24} color={PRIMARY} />
                        <Text style={styles.actionText}>Log Meal</Text>
                    </Pressable>
                    <Pressable style={styles.actionCard} onPress={() => router.push('/(tabs)/workout')}>
                        <Ionicons name="barbell" size={24} color={PRIMARY} />
                        <Text style={styles.actionText}>Workout</Text>
                    </Pressable>
                    <Pressable style={styles.actionCard} onPress={() => router.push('/water/log')}>
                        <Ionicons name="water" size={24} color={PRIMARY} />
                        <Text style={styles.actionText}>Water</Text>
                    </Pressable>
                    <Pressable style={styles.actionCard} onPress={() => router.push('/sleep/log')}>
                        <Ionicons name="bed" size={24} color={PRIMARY} />
                        <Text style={styles.actionText}>Sleep</Text>
                    </Pressable>
                </View>

                {/* Today's Workout */}
                <GlassPanel style={styles.workoutCard}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>Recommended Workout</Text>
                        <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.5)" />
                    </View>
                    {isLoadingRecommendation ? (
                        <View style={{ padding: 20, alignItems: 'center' }}>
                            <Text style={{ color: 'rgba(255,255,255,0.5)' }}>Loading recommendation...</Text>
                        </View>
                    ) : recommendedWorkout ? (
                        <View style={styles.workoutContent}>
                            <View style={styles.workoutIcon}>
                                <Ionicons name="fitness" size={32} color={PRIMARY} />
                            </View>
                            <View style={styles.workoutInfo}>
                                <Text style={styles.workoutTitle}>{recommendedWorkout.title}</Text>
                                <Text style={styles.workoutMeta}>
                                    {recommendedWorkout.duration} min • {recommendedWorkout.exercises?.length || 0} exercises
                                </Text>
                            </View>
                            <Pressable style={styles.startButton} onPress={() => router.push(`/workout/${recommendedWorkout.id}`)}>
                                <Text style={styles.startButtonText}>Start</Text>
                            </Pressable>
                        </View>
                    ) : (
                        <View style={{ padding: 20, alignItems: 'center' }}>
                            <Text style={{ color: 'rgba(255,255,255,0.5)' }}>No recommendation available</Text>
                        </View>
                    )}
                </GlassPanel>

                {/* Recent Meals */}
                <GlassPanel style={styles.mealsCard}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>Recent Meals</Text>
                        <Pressable onPress={() => router.push('/(tabs)/nutrition')}>
                            <Text style={styles.seeAll}>See all</Text>
                        </Pressable>
                    </View>

                    {userData.dailyStats.meals.length > 0 ? (
                        userData.dailyStats.meals.slice(0, 3).map((meal, index) => (
                            <View key={index} style={styles.mealItem}>
                                <View style={styles.mealIcon}>
                                    <Ionicons name="restaurant" size={20} color={PRIMARY} />
                                </View>
                                <View style={styles.mealInfo}>
                                    <Text style={styles.mealName}>{meal.name}</Text>
                                    <Text style={styles.mealDesc}>{meal.time}</Text>
                                </View>
                                <Text style={styles.mealCalories}>{meal.calories} kcal</Text>
                            </View>
                        ))
                    ) : (
                        <View style={{ padding: 20, alignItems: 'center' }}>
                            <Text style={{ color: 'rgba(255,255,255,0.5)' }}>No meals logged today</Text>
                        </View>
                    )}
                </GlassPanel>

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
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    greeting: {
        fontSize: 28,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    date: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.5)',
        marginTop: 4,
    },
    notificationButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        minWidth: 8,
        minHeight: 8,
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 8,
        backgroundColor: '#ef4444',
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeCount: {
        fontSize: 10,
        fontWeight: '700',
        color: '#fff',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    ringsCard: {
        marginBottom: 20,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 16,
    },
    ringsContainer: {
        flexDirection: 'row',
        gap: 24,
    },
    ring: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    ringCenter: {
        alignItems: 'center',
    },
    ringValue: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
        marginTop: 4,
    },
    ringUnit: {
        fontSize: 11,
        color: 'rgba(255, 255, 255, 0.5)',
    },
    ringLegend: {
        flex: 1,
        justifyContent: 'center',
        gap: 16,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    legendDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    legendValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    legendLabel: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.5)',
    },
    quickActions: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },
    actionCard: {
        flex: 1,
        aspectRatio: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    actionText: {
        fontSize: 12,
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
    },
    workoutCard: {
        marginBottom: 20,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    seeAll: {
        fontSize: 14,
        color: PRIMARY,
        fontWeight: '600',
    },
    workoutContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    workoutIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(13, 242, 108, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    workoutInfo: {
        flex: 1,
    },
    workoutTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    workoutMeta: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.5)',
    },
    startButton: {
        backgroundColor: PRIMARY,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 9999,
    },
    startButtonText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#000',
    },
    mealsCard: {
        marginBottom: 20,
    },
    mealItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    mealIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mealInfo: {
        flex: 1,
    },
    mealName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 2,
    },
    mealDesc: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.5)',
    },
    mealCalories: {
        fontSize: 14,
        fontWeight: '600',
        color: PRIMARY,
    },
});
