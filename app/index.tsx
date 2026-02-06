import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { PRIMARY } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';

export default function SplashScreen() {
    const router = useRouter();
    const { user, isLoading, hasOnboarded } = useAuth();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Logo animation
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 4,
                useNativeDriver: true,
            }),
        ]).start();

        // Progress bar animation
        Animated.timing(progressAnim, {
            toValue: 1,
            duration: 2000,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
            useNativeDriver: false,
        }).start();
    }, []);

    // Navigate based on auth state (after minimum animation time)
    useEffect(() => {
        if (isLoading) return;

        const minDelay = 2500; // Ensure splash animation completes
        const timer = setTimeout(() => {
            if (!user) {
                router.replace('/auth/login');
            } else if (!hasOnboarded) {
                router.replace('/(onboarding)/welcome');
            } else {
                router.replace('/(tabs)/today');
            }
        }, minDelay);

        return () => clearTimeout(timer);
    }, [user, hasOnboarded, isLoading]);

    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '75%'],
    });

    return (
        <LinearGradient
            colors={['#1a2c3d', '#0f1923', '#1d1439']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            {/* Background glow effects */}
            <View style={styles.glowTop} />
            <View style={styles.glowBottom} />

            <Animated.View
                style={[
                    styles.logoContainer,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }],
                    },
                ]}
            >
                {/* Logo Circle */}
                <View style={styles.logoCircle}>
                    <View style={styles.logoInner}>
                        {/* Heartbeat icon simulation */}
                        <View style={styles.heartbeatContainer}>
                            <View style={styles.heartbeatLine} />
                            <View style={[styles.heartbeatLine, styles.heartbeatPeak]} />
                        </View>
                    </View>
                </View>

                {/* App Name */}
                <Text style={styles.appName}>HealthFit</Text>
                <Text style={styles.tagline}>TRANSFORM YOURSELF</Text>
            </Animated.View>

            {/* Loading Bar */}
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>LOADING...</Text>
                <View style={styles.progressBarContainer}>
                    <Animated.View
                        style={[
                            styles.progressBar,
                            { width: progressWidth },
                        ]}
                    />
                </View>
                <Text style={styles.version}>v1.0.2</Text>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#102217',
    },
    glowTop: {
        position: 'absolute',
        top: '-10%',
        right: '-10%',
        width: '50%',
        height: '30%',
        backgroundColor: PRIMARY,
        opacity: 0.1,
        borderRadius: 9999,
    },
    glowBottom: {
        position: 'absolute',
        bottom: '-10%',
        left: '-10%',
        width: '40%',
        height: '40%',
        backgroundColor: PRIMARY,
        opacity: 0.05,
        borderRadius: 9999,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 200,
    },
    logoCircle: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: 'rgba(28, 46, 36, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
        shadowColor: PRIMARY,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    logoInner: {
        width: 80,
        height: 80,
        borderRadius: 16,
        backgroundColor: PRIMARY,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heartbeatContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    heartbeatLine: {
        width: 20,
        height: 3,
        backgroundColor: '#102217',
        borderRadius: 2,
    },
    heartbeatPeak: {
        height: 16,
        width: 3,
    },
    appName: {
        fontSize: 48,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: -1,
        marginBottom: 8,
    },
    tagline: {
        fontSize: 14,
        fontWeight: '400',
        color: 'rgba(255, 255, 255, 0.5)',
        letterSpacing: 3,
    },
    loadingContainer: {
        position: 'absolute',
        bottom: 80,
        alignItems: 'center',
        width: '80%',
    },
    loadingText: {
        fontSize: 12,
        fontWeight: '600',
        color: PRIMARY,
        letterSpacing: 2,
        marginBottom: 16,
    },
    progressBarContainer: {
        width: '100%',
        height: 4,
        backgroundColor: 'rgba(13, 242, 108, 0.1)',
        borderRadius: 2,
        overflow: 'hidden',
        marginBottom: 24,
    },
    progressBar: {
        height: '100%',
        backgroundColor: PRIMARY,
        borderRadius: 2,
        shadowColor: PRIMARY,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
    },
    version: {
        fontSize: 11,
        color: 'rgba(255, 255, 255, 0.3)',
        letterSpacing: 1,
    },
});
