import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Button from '@/components/Button';
import TextInput from '@/components/TextInput';
import { PRIMARY, BACKGROUND_DARK } from '@/constants/Colors';

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = () => {
        // Navigate to main app after login
        router.replace('/(tabs)/today');
    };

    return (
        <View style={styles.container}>
            {/* Hero Background Image */}
            <LinearGradient
                colors={['rgba(16, 34, 23, 0.4)', 'rgba(16, 34, 23, 0.9)', BACKGROUND_DARK]}
                style={styles.heroGradient}
            >
                <View style={styles.heroContent}>
                    <View style={styles.logoContainer}>
                        <Ionicons name="flash" size={32} color={PRIMARY} />
                    </View>
                    <Text style={styles.logoText}>HealthFit</Text>
                    <Text style={styles.tagline}>TRANSFORM YOUR LIFE</Text>
                </View>
            </LinearGradient>

            <ScrollView style={styles.formContainer} contentContainerStyle={styles.formContent}>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Please enter your details to sign in.</Text>

                <View style={styles.form}>
                    <TextInput
                        label="Email Address"
                        placeholder="your.email@example.com"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        icon={<Ionicons name="mail-outline" size={20} color="rgba(255,255,255,0.5)" />}
                    />

                    <TextInput
                        label="Password"
                        placeholder="Enter your password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        icon={<Ionicons name="lock-closed-outline" size={20} color="rgba(255,255,255,0.5)" />}
                    />

                    <Pressable style={styles.forgotPassword}>
                        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                    </Pressable>

                    <Button
                        title="Sign In"
                        onPress={handleLogin}
                        icon={<Ionicons name="arrow-forward" size={20} color="#000" />}
                        style={styles.signInButton}
                    />

                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    <View style={styles.socialButtons}>
                        <Pressable style={styles.socialButton}>
                            <Ionicons name="logo-google" size={24} color="#fff" />
                        </Pressable>
                        <Pressable style={styles.socialButton}>
                            <Ionicons name="logo-apple" size={24} color="#fff" />
                        </Pressable>
                    </View>

                    <View style={styles.signupPrompt}>
                        <Text style={styles.signupText}>Don't have an account? </Text>
                        <Pressable onPress={() => router.push('/(auth)/signup')}>
                            <Text style={styles.signupLink}>Create one</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BACKGROUND_DARK,
    },
    heroGradient: {
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroContent: {
        alignItems: 'center',
    },
    logoContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(13, 242, 108, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    logoText: {
        fontSize: 32,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    tagline: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.5)',
        letterSpacing: 2,
    },
    formContainer: {
        flex: 1,
        backgroundColor: BACKGROUND_DARK,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        marginTop: -32,
    },
    formContent: {
        padding: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.5)',
        marginBottom: 32,
    },
    form: {
        gap: 8,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 24,
    },
    forgotPasswordText: {
        fontSize: 14,
        color: PRIMARY,
        fontWeight: '500',
    },
    signInButton: {
        marginBottom: 24,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    dividerText: {
        fontSize: 11,
        color: 'rgba(255, 255, 255, 0.4)',
        marginHorizontal: 16,
        letterSpacing: 1,
    },
    socialButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
        marginBottom: 32,
    },
    socialButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    signupPrompt: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
    },
    signupText: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.5)',
    },
    signupLink: {
        fontSize: 14,
        color: PRIMARY,
        fontWeight: '600',
    },
});
