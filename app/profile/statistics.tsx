import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PRIMARY, BACKGROUND_DARK, SURFACE_DARK } from '@/constants/Colors';
import { useUser } from '@/context/UserContext';
import GlassPanel from '@/components/GlassPanel';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { useEffect, useState } from 'react';
import client from '@/api/client';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function StatisticsScreen() {
    const router = useRouter();
    const { userData } = useUser();
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await client.get('/user/stats/history?days=7');
                // If backend returns empty, we might want to fill with zeros or just show empty state
                setHistory(res.data || []);
            } catch (error) {
                console.error('Failed to fetch history:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    // Process data for charts
    const chartData = {
        labels: history.length > 0 ? history.map(d => new Date(d.date).toLocaleDateString(undefined, { weekday: 'short' })) : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                data: history.length > 0 ? history.map(d => d.caloriesBurned) : [0, 0, 0, 0, 0, 0, 0],
                color: (opacity = 1) => `rgba(13, 242, 108, ${opacity})`, // PRIMARY color
                strokeWidth: 2
            }
        ]
    };

    // Calculate Total Stats (All Time) based on UserData (which is source of truth for totals)
    // OR we could aggregate from history if we want a specific range. 
    // Let's stick to existing userData for "All Time" totals
    const totalCalories = userData.completedWorkouts.reduce((sum, w) => sum + w.calories, 0);
    const totalMinutes = userData.completedWorkouts.reduce((sum, w) => sum + Math.round(w.duration / 60), 0);
    const totalWorkouts = userData.completedWorkouts.length;

    const chartConfig = {
        backgroundGradientFrom: SURFACE_DARK,
        backgroundGradientTo: SURFACE_DARK,
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        style: {
            borderRadius: 16
        },
        propsForDots: {
            r: "4",
            strokeWidth: "2",
            stroke: PRIMARY
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </Pressable>
                <Text style={styles.title}>Statistics</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 40, flexGrow: 1 }} showsVerticalScrollIndicator={false}>
                <GlassPanel style={styles.chartCard}>
                    <Text style={styles.cardTitle}>Calories Burned (Last 7 Days)</Text>
                    {loading ? (
                        <View style={{ height: 220, justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator color={PRIMARY} />
                        </View>
                    ) : (
                        <LineChart
                            data={chartData}
                            width={SCREEN_WIDTH - 48} // Window width - padding
                            height={220}
                            chartConfig={chartConfig}
                            bezier
                            style={{
                                marginVertical: 8,
                                borderRadius: 16
                            }}
                        />
                    )}
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
                    userData.completedWorkouts.slice().reverse().map((workout, index) => ( // Reverse to show latest first
                        <View key={index} style={styles.historyItem}>
                            <View style={styles.historyIcon}>
                                <Ionicons name="checkmark" size={20} color="#000" />
                            </View>
                            <View style={styles.historyInfo}>
                                <Text style={styles.historyTitle}>Workout #{workout.id.substring(0, 8)}</Text>
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
        padding: 0, // Padding handled by chart wrapper or internal padding if needed, ChartKit handles padding
        paddingVertical: 10,
        alignItems: 'center', // Center chart
        overflow: 'hidden'
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 10,
        paddingHorizontal: 20,
        alignSelf: 'flex-start'
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
