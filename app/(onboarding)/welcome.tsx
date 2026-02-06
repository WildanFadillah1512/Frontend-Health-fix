import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Button from '@/components/Button';
import { PRIMARY, BACKGROUND_DARK } from '@/constants/Colors';

export default function WelcomeScreen() {
    const router = useRouter();

    return (
        <ImageBackground
            source={require('../../assets/1.jpg')}
            style={styles.container}
            resizeMode="cover"
        >
            <LinearGradient
                colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.4)', 'rgba(16, 34, 23, 0.95)']}
                style={styles.gradient}
            >
                {/* Logo Badge */}
                <View style={styles.logoBadge}>
                    <Ionicons name="heart-circle" size={20} color={PRIMARY} />
                    <Text style={styles.logoText}>HEALTHFIT</Text>
                </View>

                <View style={styles.content}>
                    <View style={styles.heroTextContainer}>
                        <Text style={styles.heroText}>Transform</Text>
                        <Text style={[styles.heroText, styles.heroTextHighlight]}>Your Life</Text>
                    </View>

                    <Text style={styles.subtitle}>
                        Daily workouts. Personalized plans.{'\n'}Real results.
                    </Text>

                    <Button
                        title="Get Started"
                        onPress={() => router.push('/(onboarding)/physical-data')}
                        icon={<Ionicons name="arrow-forward" size={20} color="#000" />}
                        style={styles.button}
                    />

                    <Text style={styles.terms}>
                        By continuing, you agree to our <Text style={styles.termsLink}>Terms & Privacy Policy</Text>
                    </Text>
                </View>
            </LinearGradient>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BACKGROUND_DARK,
    },
    gradient: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 24,
    },
    logoBadge: {
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginTop: 60,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    logoText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 3,
    },
    content: {
        paddingBottom: 40,
    },
    heroTextContainer: {
        marginBottom: 16,
    },
    heroText: {
        fontSize: 42, // Reduced from 56
        fontWeight: '700',
        color: '#FFFFFF',
        lineHeight: 48,
        letterSpacing: -1,
    },
    heroTextHighlight: {
        color: PRIMARY,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        lineHeight: 24,
        marginBottom: 32,
        maxWidth: '80%',
    },
    button: {
        marginBottom: 24,
        backgroundColor: PRIMARY,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 8,
        shadowColor: PRIMARY,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    terms: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.5)',
        textAlign: 'center',
    },
    termsLink: {
        color: PRIMARY,
        textDecorationLine: 'underline',
    },
});
