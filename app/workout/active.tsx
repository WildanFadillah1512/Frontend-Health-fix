import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PRIMARY, BACKGROUND_DARK } from '@/constants/Colors';
import { useState, useEffect, useRef } from 'react';
import { useWorkouts } from '@/hooks/useWorkouts';


export default function ActiveWorkoutScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const { workouts } = useWorkouts();

    const workout = workouts.find(w => w.id === id);

    // If no workout found, return (should handle error better)
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // Exercise State
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [currentSet, setCurrentSet] = useState(1);
    const [isResting, setIsResting] = useState(false);
    const [restTimer, setRestTimer] = useState(0);

    // If no workout found, return (should handle error better)
    // MOVED: The check used to be here, causing hook errors.

    // Safely access current exercise for hooks
    const currentExercise = workout?.exercises[currentExerciseIndex] || {
        name: 'Loading', sets: 0, reps: 0, duration: 0, rest: 0
    };

    // Main Workout Timer
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (!isPaused && workout) {
            interval = setInterval(() => {
                setElapsedTime(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPaused, workout]);

    // Rest Timer
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isResting && restTimer > 0 && !isPaused) {
            interval = setInterval(() => {
                setRestTimer(prev => prev - 1);
            }, 1000);
        } else if (isResting && restTimer === 0) {
            // Rest finished
            setIsResting(false);
            nextSetOrExercise();
        }
        return () => clearInterval(interval);
    }, [isResting, restTimer, isPaused]);

    // NOW we can safely return if no workout
    if (!workout) {
        router.back();
        return null;
    }

    const nextSetOrExercise = () => {
        // If has more sets
        if (currentSet < currentExercise.sets) {
            setCurrentSet(prev => prev + 1);
        } else {
            // Next exercise
            if (currentExerciseIndex < workout.exercises.length - 1) {
                setCurrentExerciseIndex(prev => prev + 1);
                setCurrentSet(1);
            } else {
                // Workout Finished
                finishWorkout();
            }
        }
    };

    const handleNext = () => {
        // If currently working out, go to rest (if rest > 0)
        // If currently resting, skip rest
        if (isResting) {
            setRestTimer(0); // Trigger effect to end rest
        } else {
            // Start rest
            if (currentExercise.rest > 0) {
                setIsResting(true);
                setRestTimer(currentExercise.rest);
            } else {
                nextSetOrExercise();
            }
        }
    };

    const handlePrevious = () => {
        if (currentSet > 1) {
            setCurrentSet(prev => prev - 1);
            setIsResting(false);
        } else if (currentExerciseIndex > 0) {
            setCurrentExerciseIndex(prev => prev - 1);
            // Go to last set of previous exercise
            const prevExercise = workout.exercises[currentExerciseIndex - 1];
            setCurrentSet(prevExercise.sets);
            setIsResting(false);
        }
    };

    const finishWorkout = () => {
        router.push({
            pathname: '/workout/complete',
            params: {
                id: workout.id,
                duration: elapsedTime,
                calories: workout.calories, // Could calculate based on time
                exercises: workout.exercises.length
            }
        });
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color="#fff" />
                </Pressable>
                <View style={styles.timerContainer}>
                    <Text style={styles.timerLabel}>ELAPSED</Text>
                    <Text style={styles.timer}>{formatTime(elapsedTime)}</Text>
                </View>
                <Pressable onPress={finishWorkout} style={styles.finishButton}>
                    <Text style={styles.finishText}>FINISH</Text>
                </Pressable>
            </View>

            {/* Main Content */}
            <View style={styles.content}>
                {isResting ? (
                    <View style={styles.restContainer}>
                        <Text style={styles.restLabel}>REST</Text>
                        <Text style={styles.restTimer}>{formatTime(restTimer)}</Text>

                        <View style={styles.upNext}>
                            <Text style={styles.upNextLabel}>UP NEXT</Text>
                            <Text style={styles.upNextTitle}>
                                {currentSet < currentExercise.sets
                                    ? `Set ${currentSet + 1} - ${currentExercise.name}`
                                    : (currentExerciseIndex < workout.exercises.length - 1
                                        ? workout.exercises[currentExerciseIndex + 1].name
                                        : 'Finish Workout')}
                            </Text>
                        </View>

                        <Pressable style={styles.skipButton} onPress={() => setRestTimer(0)}>
                            <Text style={styles.skipButtonText}>SKIP REST</Text>
                        </Pressable>
                    </View>
                ) : (
                    <View style={styles.activeContainer}>
                        <Text style={styles.exerciseTitle}>{currentExercise.name}</Text>

                        <View style={styles.setInfo}>
                            <Text style={styles.setCount}>Set {currentSet} of {currentExercise.sets}</Text>
                        </View>

                        <View style={styles.targetDisplay}>
                            {currentExercise.duration ? (
                                <View style={styles.targetItem}>
                                    <Ionicons name="time-outline" size={32} color={PRIMARY} />
                                    <Text style={styles.targetValue}>{currentExercise.duration}s</Text>
                                    <Text style={styles.targetLabel}>TARGET TIME</Text>
                                </View>
                            ) : (
                                <View style={styles.targetItem}>
                                    <Ionicons name="refresh-outline" size={32} color={PRIMARY} />
                                    <Text style={styles.targetValue}>{currentExercise.reps}</Text>
                                    <Text style={styles.targetLabel}>REPS</Text>
                                </View>
                            )}
                        </View>
                    </View>
                )}

                {/* Controls */}
                <View style={styles.controls}>
                    <Pressable style={styles.secondaryControl} onPress={handlePrevious}>
                        <Ionicons name="play-skip-back" size={28} color="#fff" />
                    </Pressable>

                    <Pressable
                        style={styles.mainControl}
                        onPress={() => setIsPaused(!isPaused)}
                    >
                        <Ionicons name={isPaused ? "play" : "pause"} size={40} color="#000" />
                    </Pressable>

                    <Pressable style={styles.secondaryControl} onPress={handleNext}>
                        <Ionicons name="checkmark" size={32} color={PRIMARY} />
                    </Pressable>
                </View>

                <Text style={styles.hintText}>
                    {isResting ? "Resting..." : "Tap checkmark when set is complete"}
                </Text>
            </View>
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
        paddingHorizontal: 24,
        marginBottom: 40,
    },
    closeButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 20,
    },
    timerContainer: {
        alignItems: 'center',
    },
    timerLabel: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.5)',
        fontWeight: '700',
        letterSpacing: 1,
    },
    timer: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
        fontVariant: ['tabular-nums'],
    },
    finishButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        borderRadius: 8,
    },
    finishText: {
        color: '#ef4444',
        fontWeight: '700',
        fontSize: 12,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 60,
        paddingHorizontal: 24,
    },
    restContainer: {
        alignItems: 'center',
        width: '100%',
        flex: 1,
        justifyContent: 'center',
    },
    restLabel: {
        fontSize: 16,
        color: PRIMARY,
        fontWeight: '700',
        letterSpacing: 2,
        marginBottom: 16,
    },
    restTimer: {
        fontSize: 80,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 40,
        fontVariant: ['tabular-nums'],
    },
    upNext: {
        alignItems: 'center',
        marginBottom: 40,
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 24,
        borderRadius: 20,
        width: '100%',
    },
    upNextLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.5)',
        fontWeight: '700',
        marginBottom: 8,
    },
    upNextTitle: {
        fontSize: 18,
        color: '#fff',
        fontWeight: '600',
        textAlign: 'center',
    },
    skipButton: {
        paddingHorizontal: 32,
        paddingVertical: 16,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 9999,
    },
    skipButtonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 14,
    },
    activeContainer: {
        alignItems: 'center',
        width: '100%',
        flex: 1,
        justifyContent: 'center',
    },
    exerciseTitle: {
        fontSize: 32,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 16,
    },
    setInfo: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 9999,
        marginBottom: 40,
    },
    setCount: {
        color: 'rgba(255,255,255,0.8)',
        fontWeight: '600',
        fontSize: 14,
    },
    targetDisplay: {
        flexDirection: 'row',
        gap: 40,
    },
    targetItem: {
        alignItems: 'center',
        gap: 12,
    },
    targetValue: {
        fontSize: 40,
        fontWeight: '700',
        color: '#fff',
    },
    targetLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.5)',
        fontWeight: '700',
        letterSpacing: 1,
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 40,
        marginBottom: 20,
    },
    secondaryControl: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainControl: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: PRIMARY,
        justifyContent: 'center',
        alignItems: 'center',
    },
    hintText: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.3)',
    }
});


