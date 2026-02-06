import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Button from '@/components/Button';
import TextInput from '@/components/TextInput';
import { PRIMARY, BACKGROUND_DARK } from '@/constants/Colors';

export default function SignupScreen() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    const handleSignup = () => {
        // Navigate to onboarding after signup
        router.replace('/(onboarding)/welcome');
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </Pressable>
                <Text style={styles.headerTitle}>HealthFit</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                <View style={styles.iconContainer}>
                    <Ionicons name="fitness" size={32} color={PRIMARY} />
                </View>

                <Text style={styles.title}>Join the Revolution</Text>
                <Text style={styles.subtitle}>Start your transformation today.</Text>

                <View style={styles.form}>
                    <TextInput
                        label="Full Name"
                        placeholder="John Doe"
                        value={name}
                        onChangeText={setName}
                        icon={<Ionicons name="person-outline" size={20} color="rgba(255,255,255,0.5)" />}
                    />

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
                        placeholder="Create a strong password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        icon={<Ionicons name="lock-closed-outline" size={20} color="rgba(255,255,255,0.5)" />}
                    />

                    <Pressable
                        style={styles.termsContainer}
                        onPress={() => setAcceptedTerms(!acceptedTerms)}
                    >
                        <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
                            {acceptedTerms && <Ionicons name="checkmark" size={16} color="#000" />}
                        </View>
                        <Text style={styles.termsText}>
                            I agree to the{' '}
                            <Text style={styles.termsLink}>Terms of Service</Text>
                            {' '}and{' '}
                            <Text style={styles.termsLink}>Privacy Policy</Text>
                        </Text>
                    </Pressable>

                    <Button
                        title="Create Account"
                        onPress={handleSignup}
                        disabled={!acceptedTerms}
                        icon={<Ionicons name="arrow-forward" size={20} color="#000" />}
                        style={styles.createButton}
                    />

                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>Or continue with</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    <View style={styles.socialButtons}>
                        <Pressable style={styles.socialButton}>
                            <Ionicons name="logo-apple" size={24} color="#fff" />
                        </Pressable>
                        <Pressable style={styles.socialButton}>
                            <Ionicons name="logo-google" size={24} color="#fff" />
                        </Pressable>
                    </View>

                    <View style={styles.loginPrompt}>
                        <Text style={styles.loginText}>Already a member? </Text>
                        <Pressable onPress={() => router.back()}>
                            <Text style={styles.loginLink}>Log In</Text>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 48,
        paddingBottom: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: 24,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(13, 242, 108, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.5)',
        marginBottom: 32,
    },
    form: {
        gap: 8,
    },
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginVertical: 16,
        gap: 12,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 2,
    },
    checkboxChecked: {
        backgroundColor: PRIMARY,
        borderColor: PRIMARY,
    },
    termsText: {
        flex: 1,
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.6)',
        lineHeight: 20,
    },
    termsLink: {
        color: PRIMARY,
        fontWeight: '600',
    },
    createButton: {
        marginTop: 8,
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
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.4)',
        marginHorizontal: 16,
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
    loginPrompt: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    loginText: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.5)',
    },
    loginLink: {
        fontSize: 14,
        color: PRIMARY,
        fontWeight: '600',
    },
});
