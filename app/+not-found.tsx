import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { PRIMARY, BACKGROUND_DARK } from '@/constants/Colors';

export default function NotFoundScreen() {
    return (
        <LinearGradient
            colors={[BACKGROUND_DARK, '#0a160f']}
            style={styles.container}
        >
            <View style={styles.content}>
                {/* 3D Illustration placeholder */}
                <View style={styles.imageContainer}>
                    <View style={styles.illustration}>
                        <Text style={styles.illustrationText}>🗺️</Text>
                    </View>
                </View>

                <Text style={styles.title}>Oops! You've{'\n'}wandered off the{'\n'}track.</Text>

                <Text style={styles.description}>
                    Even the best athletes take a wrong turn sometimes. Let's get you back to your training plan.
                </Text>

                <Link href="/(tabs)/today" asChild>
                    <Pressable style={styles.button}>
                        <Text style={styles.buttonText}>Back to Home Base</Text>
                    </Pressable>
                </Link>
            </View>
        </LinearGradient>
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
        paddingHorizontal: 32,
    },
    imageContainer: {
        width: 300,
        height: 300,
        borderRadius: 32,
        backgroundColor: 'rgba(173, 216, 230, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 48,
    },
    illustration: {
        width: 200,
        height: 200,
        alignItems: 'center',
        justifyContent: 'center',
    },
    illustrationText: {
        fontSize: 120,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 16,
        lineHeight: 38,
    },
    description: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.6)',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 48,
        maxWidth: 320,
    },
    button: {
        backgroundColor: PRIMARY,
        paddingHorizontal: 48,
        paddingVertical: 18,
        borderRadius: 9999,
        shadowColor: PRIMARY,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
        elevation: 10,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000000',
        textAlign: 'center',
    },
});
