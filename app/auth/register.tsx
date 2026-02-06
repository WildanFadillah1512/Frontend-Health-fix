import { View, Text, StyleSheet, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebaseConfig';
import { PRIMARY, BACKGROUND_DARK } from '@/constants/Colors';
import GlassPanel from '@/components/GlassPanel';
import client from '@/api/client';

export default function RegisterScreen() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleRegister = async () => {
        if (!name || !email || !password) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // 1. Create Firebase Auth User
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Set Display Name & Send Verification
            // @ts-ignore
            const { sendEmailVerification, updateProfile } = await import('firebase/auth');

            await updateProfile(user, {
                displayName: name
            });

            await sendEmailVerification(user);

            // 3. Redirect to Verify Email Screen
            // UserContext will pick up the displayName later
            router.push({
                pathname: '/auth/verify-email',
                params: { email }
            });

        } catch (err: any) {
            let errorMessage = 'Failed to register';

            if (err.code === 'auth/email-already-in-use') {
                errorMessage = 'Email already in use';
            } else if (err.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address';
            } else if (err.code === 'auth/weak-password') {
                errorMessage = 'Password should be at least 6 characters';
            } else if (err.message) {
                errorMessage = err.message;
            }

            setError(errorMessage);
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
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Start your transformation today</Text>
                </View>

                <View style={styles.form}>
                    <GlassPanel style={styles.inputGroup}>
                        <View style={styles.inputContainer}>
                            <Ionicons name="person-outline" size={20} color={PRIMARY} />
                            <TextInput
                                style={styles.input}
                                placeholder="Full Name"
                                placeholderTextColor="rgba(255,255,255,0.3)"
                                value={name}
                                onChangeText={setName}
                            />
                        </View>
                        <View style={styles.divider} />
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
                            />
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.inputContainer}>
                            <Ionicons name="lock-closed-outline" size={20} color={PRIMARY} />
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                placeholderTextColor="rgba(255,255,255,0.3)"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>
                    </GlassPanel>

                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    <Pressable
                        style={[styles.registerButton, loading && styles.registerButtonDisabled]}
                        onPress={handleRegister}
                        disabled={loading}
                    >
                        <Text style={styles.registerButtonText}>{loading ? 'Creating Account...' : 'Sign Up'}</Text>
                        {!loading && <Ionicons name="arrow-forward" size={20} color="#000" />}
                    </Pressable>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <Pressable onPress={() => router.push('/auth/login')}>
                            <Text style={styles.loginText}>Sign In</Text>
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
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.6)',
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
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginLeft: 44,
    },
    errorText: {
        color: '#ef4444',
        fontSize: 14,
        textAlign: 'center',
    },
    registerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: PRIMARY,
        padding: 18,
        borderRadius: 16,
        marginTop: 8,
    },
    registerButtonDisabled: {
        opacity: 0.7,
    },
    registerButtonText: {
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
    loginText: {
        color: PRIMARY,
        fontSize: 14,
        fontWeight: '700',
    },
});
