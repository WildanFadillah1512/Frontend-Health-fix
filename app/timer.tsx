import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PRIMARY, BACKGROUND_DARK } from '@/constants/Colors';
import { useState, useEffect } from 'react';
import CircularProgress from '@/components/CircularProgress';

export default function RestTimerScreen() {
    const router = useRouter();
    const [timeLeft, setTimeLeft] = useState(60);

    useEffect(() => {
        if (timeLeft <= 0) {
            router.back();
            return;
        }
        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>REST</Text>

                <View style={styles.timerContainer}>
                    <CircularProgress
                        size={240}
                        strokeWidth={16}
                        progress={timeLeft / 60}
                        color={PRIMARY}
                    >
                        <Text style={styles.timerText}>{timeLeft}s</Text>
                    </CircularProgress>
                </View>

                <View style={styles.controls}>
                    <Pressable
                        style={styles.button}
                        onPress={() => setTimeLeft(prev => prev + 10)}
                    >
                        <Text style={styles.buttonText}>+10s</Text>
                    </Pressable>

                    <Pressable
                        style={[styles.button, styles.skipButton]}
                        onPress={() => router.back()}
                    >
                        <Text style={[styles.buttonText, styles.skipText]}>SKIP</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        width: '100%',
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 40,
        letterSpacing: 2,
    },
    timerContainer: {
        marginBottom: 60,
    },
    timerText: {
        fontSize: 64,
        fontWeight: '700',
        color: '#fff',
    },
    controls: {
        flexDirection: 'row',
        gap: 20,
    },
    button: {
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    },
    skipButton: {
        backgroundColor: PRIMARY,
    },
    skipText: {
        color: '#000',
    },
});
