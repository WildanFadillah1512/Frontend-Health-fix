import { View, Text, StyleSheet, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '@/firebaseConfig';
import { PRIMARY, BACKGROUND_DARK } from '@/constants/Colors';
import GlassPanel from '@/components/GlassPanel';

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleResetPassword = async () => {
        if (!email) {
            Alert.alert('Error', 'Please enter your email address');
            return;
        }

        setLoading(true);

        try {
            // @ts-ignore - Firebase modular API exports exist at runtime
            const { sendPasswordResetEmail } = await import('firebase/auth');
            await sendPasswordResetEmail(auth, email);
            setSent(true);
            Alert.alert(
                'Email Sent!',
                'Check your email for a link to reset your password. If it doesn\'t appear within a few minutes, check your spam folder.',
                [
                    {
                        text: 'OK',
                        onPress: () => router.back(),
                    },
                ]
            );
        } catch (error: any) {
            let errorMessage = 'Failed to send reset email';

            if (error.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address';
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = 'Too many requests. Please try again later';
            }

            Alert.alert('Error', errorMessage);
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </Pressable>
                    <View style={styles.iconContainer}>
                        <Ionicons name="lock-closed-outline" size={60} color={PRIMARY} />
                    </View>
                    <Text style={styles.title}>Forgot Password?</Text>
                    <Text style={styles.subtitle}>
                        No worries! Enter your email and we'll send you a link to reset your password
                    </Text>
                </View>

                <View style={styles.form}>
                    <GlassPanel style={styles.inputGroup}>
                        <View style={styles.inputContainer}>
                            <Ionicons name="mail-outline" size={20} color={PRIMARY} />
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                placeholderTextColor="rgba(255,255,255,0.3)"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                editable={!sent}
                            />
                        </View>
                    </GlassPanel>

                    <Pressable
                        style={[styles.resetButton, (loading || sent) && styles.resetButtonDisabled]}
                        onPress={handleResetPassword}
                        disabled={loading || sent}
                    >
                        {loading ? (
                            <Text style={styles.resetButtonText}>Sending...</Text>
                        ) : sent ? (
                            <>
                                <Ionicons name="checkmark-circle" size={20} color="#000" />
                                <Text style={styles.resetButtonText}>Email Sent!</Text>
                            </>
                        ) : (
                            <>
                                <Text style={styles.resetButtonText}>Send Reset Link</Text>
                                <Ionicons name="arrow-forward" size={20} color="#000" />
                            </>
                        )}
                    </Pressable>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Remember your password? </Text>
                        <Pressable onPress={() => router.back()}>
                            <Text style={styles.backText}>Back to Login</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BACKGROUND_DARK,
    },
    scrollContent: {
        flexGrow: 1,
        padding: 24,
        justifyContent: 'center',
    },
    header: {
        marginBottom: 40,
        alignItems: 'center',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-start',
        marginBottom: 24,
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(132, 204, 22, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.6)',
        textAlign: 'center',
        lineHeight: 22,
    },
    form: {
        gap: 16,
    },
    inputGroup: {
        padding: 0,
        overflow: 'hidden',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 16,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#fff',
    },
    resetButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: PRIMARY,
        padding: 18,
        borderRadius: 16,
        marginTop: 8,
    },
    resetButtonDisabled: {
        opacity: 0.7,
    },
    resetButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    footerText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 14,
    },
    backText: {
        color: PRIMARY,
        fontSize: 14,
        fontWeight: '700',
    },
});
