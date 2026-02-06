import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PRIMARY, BACKGROUND_DARK } from '@/constants/Colors';
import { useUser } from '@/context/UserContext';
import GlassPanel from '@/components/GlassPanel';

export default function StatisticsScreen() {
    const router = useRouter();
    const { userData } = useUser();

    // Determine weekly activity from completedWorkouts
    // 0 = Sunday, 1 = Monday, ... 6 = Saturday
    // We want Mon(1) -> Sun(0) mapping for array index 0-6
    const weeklyWorkouts = [0, 0, 0, 0, 0, 0, 0];
    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    const now = new Date();
    // Start of the week (Monday)
    const startOfWeek = new Date(now);
    const day = startOfWeek.getDay() || 7; // Get current day number, converting Sun(0) to 7
    if (day !== 1) startOfWeek.setHours(-24 * (day - 1)); // Set to Monday

    userData?.completedWorkouts?.forEach(workout => {
        const wDate = new Date(workout.date);
        // Check if workout is within this week
        if (wDate >= startOfWeek) {
            let dayIndex = wDate.getDay(); // 0 (Sun) - 6 (Sat)
            // Convert to 0 (Mon) - 6 (Sun)
            dayIndex = dayIndex === 0 ? 6 : dayIndex - 1;
            weeklyWorkouts[dayIndex] += Math.round(workout.duration / 60); // Add minutes
        }
    });

    const maxMins = Math.max(...weeklyWorkouts, 60); // Default max 60 to avoid div/0

    // Calculate Total Stats (All Time)
    const totalCalories = userData.completedWorkouts.reduce((sum, w) => sum + w.calories, 0);
    const totalMinutes = userData.completedWorkouts.reduce((sum, w) => sum + Math.round(w.duration / 60), 0);
    const totalWorkouts = userData.completedWorkouts.length;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </Pressable>
                <Text style={styles.title}>Statistics</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 40, flexGrow: 1 }}>
                <GlassPanel style={styles.chartCard}>
                    <Text style={styles.cardTitle}>This Week's Activity (min)</Text>
                    <View style={styles.chart}>
                        {weeklyWorkouts.map((mins, index) => (
                            <View key={index} style={styles.barContainer}>
                                <View style={[
                                    styles.bar,
                                    { height: mins === 0 ? 4 : (mins / maxMins) * 150 },
                                    mins > 0 && { backgroundColor: PRIMARY }
                                ]} />
                                <Text style={styles.dayLabel}>{days[index]}</Text>
                            </View>
                        ))}
                    </View>
                </GlassPanel>

                <View style={styles.statsGrid}>
                    <GlassPanel style={styles.statCard}>
                        <Ionicons name="flame" size={28} color="#ec4899" />
                        <Text style={styles.statValue}>{totalCalories.toLocaleString()}</Text>
                        <Text style={styles.statLabel}>Total Calories</Text>
                    </GlassPanel>

                    <GlassPanel style={styles.statCard}>
                        <Ionicons name="barbell" size={28} color="#06b6d4" />
                        <Text style={styles.statValue}>{totalWorkouts}</Text>
                        <Text style={styles.statLabel}>Workouts</Text>
                    </GlassPanel>

                    <GlassPanel style={styles.statCard}>
                        <Ionicons name="time" size={28} color="#f59e0b" />
                        <Text style={styles.statValue}>{totalMinutes}</Text>
                        <Text style={styles.statLabel}>Total Minutes</Text>
                    </GlassPanel>

                    <GlassPanel style={styles.statCard}>
                        <Ionicons name="trophy" size={28} color={PRIMARY} />
                        <Text style={styles.statValue}>{userData.achievements?.length || 0}</Text>
                        <Text style={styles.statLabel}>Badges</Text>
                    </GlassPanel>
                </View>

                <Text style={styles.sectionTitle}>History</Text>
                {userData.completedWorkouts.length > 0 ? (
                    userData.completedWorkouts.map((workout, index) => (
                        <View key={index} style={styles.historyItem}>
                            <View style={styles.historyIcon}>
                                <Ionicons name="checkmark" size={20} color="#000" />
                            </View>
                            <View style={styles.historyInfo}>
                                <Text style={styles.historyTitle}>Workout #{workout.id}</Text>
                                <Text style={styles.historyDate}>{new Date(workout.date).toLocaleDateString()}</Text>
                            </View>
                            <Text style={styles.historyValue}>{workout.calories} kcal</Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.emptyText}>No workout history yet.</Text>
                )}
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
    content: {
        padding: 24,
    },
    chartCard: {
        marginBottom: 24,
        padding: 20,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 24,
    },
    chart: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 180,
    },
    barContainer: {
        alignItems: 'center',
        gap: 8,
    },
    bar: {
        width: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    dayLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.5)',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 32,
    },
    statCard: {
        width: '47%',
        padding: 16,
        gap: 12,
    },
    statValue: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
    },
    statLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.5)',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 16,
    },
    historyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
        gap: 16,
    },
    historyIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: PRIMARY,
        justifyContent: 'center',
        alignItems: 'center',
    },
    historyInfo: {
        flex: 1,
    },
    historyTitle: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
    historyDate: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.5)',
    },
    historyValue: {
        fontSize: 16,
        fontWeight: '700',
        color: PRIMARY,
    },
    emptyText: {
        color: 'rgba(255,255,255,0.3)',
        textAlign: 'center',
        marginTop: 20,
    }
});
