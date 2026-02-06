import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Button from '@/components/Button';
import { PRIMARY, BACKGROUND_DARK } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';

import { useLocalSearchParams } from 'expo-router';
import { useUser } from '@/context/UserContext';
import { useEffect } from 'react';

export default function WorkoutCompleteScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { completeWorkout } = useUser();

    // Parse params
    const duration = params.duration ? parseInt(params.duration as string) : 0;
    const calories = params.calories ? parseInt(params.calories as string) : 0;
    const exercises = params.exercises ? parseInt(params.exercises as string) : 0;
    const workoutId = params.id ? parseInt(params.id as string) : 1;

    useEffect(() => {
        // Save workout when screen mounts
        if (duration > 0) {
            completeWorkout(workoutId, duration, calories);
        }
    }, []);

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[BACKGROUND_DARK, '#0a160f']}
                style={styles.content}
            >
                <View style={styles.iconContainer}>
                    <Ionicons name="trophy" size={80} color={PRIMARY} />
                </View>

                <Text style={styles.title}>WORKOUT{"\n"}COMPLETE!</Text>
                <Text style={styles.subtitle}>You crushed it! Another step closer to your goal.</Text>

                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{Math.round(duration / 60)}</Text>
                        <Text style={styles.statLabel}>Minutes</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{calories}</Text>
                        <Text style={styles.statLabel}>Calories</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{exercises}</Text>
                        <Text style={styles.statLabel}>Exercises</Text>
                    </View>
                </View>

                <Button
                    title="Back to Home"
                    onPress={() => router.replace('/(tabs)/today')}
                    style={styles.button}
                />
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BACKGROUND_DARK,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
    },
    iconContainer: {
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: 'rgba(13, 242, 108, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
        borderWidth: 2,
        borderColor: 'rgba(13, 242, 108, 0.3)',
    },
    title: {
        fontSize: 40,
        fontWeight: '900',
        color: '#FFFFFF',
        marginBottom: 16,
        textAlign: 'center',
        letterSpacing: 1,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.6)',
        textAlign: 'center',
        marginBottom: 48,
        lineHeight: 24,
    },
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginBottom: 64,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        fontSize: 32,
        fontWeight: '700',
        color: PRIMARY,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.5)',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    divider: {
        width: 1,
        height: 40,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    button: {
        width: '100%',
    },
});
