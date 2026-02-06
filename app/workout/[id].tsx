import { View, Text, StyleSheet, ScrollView, Pressable, ImageBackground } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Button from '@/components/Button';
import GlassPanel from '@/components/GlassPanel';
import { PRIMARY, BACKGROUND_DARK } from '@/constants/Colors';
import { useWorkouts } from '@/hooks/useWorkouts';

export default function WorkoutDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { workouts } = useWorkouts();

    const workout = workouts.find(w => w.id === id);

    if (!workout) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: '#fff' }}>Workout not found</Text>
                <Button title="Go Back" onPress={() => router.back()} style={{ marginTop: 20, width: 200 }} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Hero Section */}
                <View style={styles.hero}>
                    <LinearGradient
                        colors={['rgba(13, 242, 108, 0.2)', BACKGROUND_DARK]}
                        style={styles.heroGradient}
                    />
                    <Pressable onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </Pressable>

                    <View style={styles.heroContent}>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{workout.difficulty}</Text>
                        </View>
                        <Text style={styles.title}>{workout.title}</Text>
                        <View style={styles.metaRow}>
                            <View style={styles.metaItem}>
                                <Ionicons name="time-outline" size={16} color="rgba(255,255,255,0.7)" />
                                <Text style={styles.metaText}>{workout.duration} min</Text>
                            </View>
                            <View style={styles.metaDivider} />
                            <View style={styles.metaItem}>
                                <Ionicons name="flame-outline" size={16} color="rgba(255,255,255,0.7)" />
                                <Text style={styles.metaText}>{workout.calories} kcal</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.content}>
                    {/* Description */}
                    <Text style={styles.sectionTitle}>About</Text>
                    <Text style={styles.description}>{workout.description}</Text>

                    {/* Exercises List */}
                    <View style={styles.exercisesHeader}>
                        <Text style={styles.sectionTitle}>Exercises ({workout.exercises.length})</Text>
                    </View>

                    {workout.exercises.map((exercise, index) => (
                        <GlassPanel key={index} style={styles.exerciseCard}>
                            <View style={styles.exerciseNumber}>
                                <Text style={styles.numberText}>{index + 1}</Text>
                            </View>
                            <View style={styles.exerciseInfo}>
                                <Text style={styles.exerciseName}>{exercise.name}</Text>
                                <Text style={styles.exerciseDetails}>
                                    {exercise.sets} sets • {exercise.reps ? `${exercise.reps} reps` : `${exercise.duration}s`}
                                </Text>
                            </View>
                            <View style={styles.exerciseRest}>
                                <Ionicons name="timer-outline" size={16} color={PRIMARY} />
                                <Text style={styles.restText}>{exercise.rest}s rest</Text>
                            </View>
                        </GlassPanel>
                    ))}
                </View>
            </ScrollView>

            {/* Floating Footer */}
            <View style={styles.footer}>
                <GlassPanel style={styles.footerPanel}>
                    <Button
                        title="Start Workout"
                        onPress={() => router.push({
                            pathname: '/workout/active',
                            params: {
                                id: workout.id,
                                // Pass other serializable params if needed, but ID is enough to efficient lookup
                            }
                        })}
                        icon={<Ionicons name="play" size={20} color="#000" />}
                    />
                </GlassPanel>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BACKGROUND_DARK,
    },
    hero: {
        height: 300,
        justifyContent: 'flex-end',
        padding: 24,
        position: 'relative',
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    heroGradient: {
        ...StyleSheet.absoluteFillObject,
    },
    backButton: {
        position: 'absolute',
        top: 60,
        left: 24,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    heroContent: {
        gap: 12,
    },
    badge: {
        alignSelf: 'flex-start',
        backgroundColor: PRIMARY,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#000',
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    metaText: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        fontWeight: '500',
    },
    metaDivider: {
        width: 1,
        height: 16,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    content: {
        padding: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 12,
    },
    description: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.6)',
        lineHeight: 24,
        marginBottom: 32,
    },
    exercisesHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    exerciseCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginBottom: 12,
        gap: 16,
    },
    exerciseNumber: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    numberText: {
        fontSize: 14,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.5)',
    },
    exerciseInfo: {
        flex: 1,
    },
    exerciseName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    exerciseDetails: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.5)',
    },
    exerciseRest: {
        alignItems: 'center',
        gap: 4,
    },
    restText: {
        fontSize: 12,
        fontWeight: '600',
        color: PRIMARY,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 24,
    },
    footerPanel: {
        padding: 16,
        borderWidth: 0,
        backgroundColor: 'rgba(16, 34, 23, 0.95)',
    },
});
