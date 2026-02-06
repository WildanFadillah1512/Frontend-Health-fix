import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '@/firebaseConfig';
import { PRIMARY, BACKGROUND_DARK } from '@/constants/Colors';
import GlassPanel from '@/components/GlassPanel';

export default function VerifyEmailScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const email = params.email as string || auth.currentUser?.email || '';

    const [isChecking, setIsChecking] = useState(false);
    const [resendDisabled, setResendDisabled] = useState(false);
    const [countdown, setCountdown] = useState(0);

    // Auto-check verification status every 3 seconds
    useEffect(() => {
        const interval = setInterval(async () => {
            await checkVerificationStatus();
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const checkVerificationStatus = async () => {
        const user = auth.currentUser;
        if (!user) return;

        try {
            // Reload user to get latest emailVerified status
            // @ts-ignore - Firebase modular API exports exist at runtime
            const { reload } = await import('firebase/auth');
            await reload(user);

            if (user.emailVerified) {
                console.log('✅ Email verified!');
                // AuthContext will handle routing to onboarding
                router.replace('/(onboarding)/welcome');
            }
        } catch (error) {
            console.error('Error checking verification:', error);
        }
    };

    const handleManualCheck = async () => {
        setIsChecking(true);
        await checkVerificationStatus();

        const user = auth.currentUser;
        if (user && !user.emailVerified) {
            Alert.alert(
                'Not Verified Yet',
                'Please check your email and click the verification link. It may take a few moments to update.',
                [{ text: 'OK' }]
            );
        }
        setIsChecking(false);
    };

    const handleResendEmail = async () => {
        const user = auth.currentUser;
        if (!user) return;

        try {
            // @ts-ignore - Firebase modular API exports exist at runtime
            const { sendEmailVerification } = await import('firebase/auth');
            await sendEmailVerification(user);
            Alert.alert(
                'Email Sent!',
                'Verification email has been sent. Please check your inbox.',
                [{ text: 'OK' }]
            );

            // Disable resend button for 60 seconds
            setResendDisabled(true);
            setCountdown(60);

            const countdownInterval = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(countdownInterval);
                        setResendDisabled(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to send verification email');
        }
    };

    const handleLogout = () => {
        auth.signOut();
        router.replace('/auth/login');
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Ionicons name="mail-outline" size={80} color={PRIMARY} />
                </View>

                <Text style={styles.title}>Verify Your Email</Text>
                <Text style={styles.subtitle}>
                    We've sent a verification link to{'\n'}
                    <Text style={styles.email}>{email}</Text>
                </Text>

                <GlassPanel style={styles.infoPanel}>
                    <View style={styles.infoRow}>
                        <Ionicons name="checkmark-circle-outline" size={24} color={PRIMARY} />
                        <Text style={styles.infoText}>Check your inbox and spam folder</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Ionicons name="link-outline" size={24} color={PRIMARY} />
                        <Text style={styles.infoText}>Click the verification link</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Ionicons name="refresh-outline" size={24} color={PRIMARY} />
                        <Text style={styles.infoText}>Come back here - we'll detect it automatically</Text>
                    </View>
                </GlassPanel>

                <View style={styles.actions}>
                    <Pressable
                        style={[styles.button, styles.primaryButton]}
                        onPress={handleManualCheck}
                        disabled={isChecking}
                    >
                        <Text style={styles.primaryButtonText}>
                            {isChecking ? 'Checking...' : "I've Verified My Email"}
                        </Text>
                    </Pressable>

                    <Pressable
                        style={[styles.button, styles.secondaryButton, resendDisabled && styles.disabledButton]}
                        onPress={handleResendEmail}
                        disabled={resendDisabled}
                    >
                        <Text style={styles.secondaryButtonText}>
                            {resendDisabled ? `Resend in ${countdown}s` : 'Resend Verification Email'}
                        </Text>
                    </Pressable>

                    <Pressable style={styles.logoutButton} onPress={handleLogout}>
                        <Text style={styles.logoutText}>Use Different Email</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BACKGROUND_DARK,
        justifyContent: 'center',
        padding: 24,
    },
    content: {
        alignItems: 'center',
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(132, 204, 22, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.6)',
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 24,
    },
    email: {
        color: PRIMARY,
        fontWeight: '600',
    },
    infoPanel: {
        width: '100%',
        padding: 20,
        gap: 16,
        marginBottom: 32,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    infoText: {
        flex: 1,
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        lineHeight: 20,
    },
    actions: {
        width: '100%',
        gap: 12,
    },
    button: {
        padding: 18,
        borderRadius: 16,
        alignItems: 'center',
    },
    primaryButton: {
        backgroundColor: PRIMARY,
    },
    primaryButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
    },
    secondaryButton: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    disabledButton: {
        opacity: 0.5,
    },
    logoutButton: {
        padding: 12,
        alignItems: 'center',
        marginTop: 8,
    },
    logoutText: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.5)',
        fontWeight: '600',
    },
});
