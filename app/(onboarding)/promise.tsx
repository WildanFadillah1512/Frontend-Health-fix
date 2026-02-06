import { View, Text, StyleSheet, Pressable, ScrollView, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Button from '@/components/Button';
import { PRIMARY, BACKGROUND_DARK } from '@/constants/Colors';
import { useUser } from '@/context/UserContext';
import { useAuth } from '@/context/AuthContext';

export default function PromiseScreen() {
    const router = useRouter();
    const { userData, updateUserData } = useUser();
    const { setHasOnboarded } = useAuth();

    const handleCommit = async () => {
        // 1. Update local & persist to SQLite
        await updateUserData({ hasOnboarded: true });

        // 2. Update AuthContext state immediately to prevent redirect loop
        setHasOnboarded(true);

        // 3. Navigate to main app
        router.replace('/(tabs)/today');
    };

    // Simple calculation for daily calories (Mifflin-St Jeor Equation approximation)
    const calculateCalories = () => {
        let bmr = 10 * userData.weight + 6.25 * userData.height - 5 * userData.age;
        bmr = userData.gender === 'male' ? bmr + 5 : bmr - 161;

        // Multiplier based on activity level
        const multipliers: Record<string, number> = {
            'sedentary': 1.2,
            'light': 1.375,
            'moderate': 1.55,
            'very': 1.725,
            'extra': 1.9,
        };
        const multiplier = multipliers[userData.activityLevel] || 1.55;
        return Math.round(bmr * multiplier);
    };

    const calories = calculateCalories();
    const targetDiff = userData.weight - userData.targetWeight;
    const isLosing = targetDiff > 0;

    return (
        <ImageBackground
            source={require('../../assets/5.jpg')}
            style={styles.container}
            resizeMode="cover"
        >
            <LinearGradient
                colors={['rgba(16, 34, 23, 0.85)', 'rgba(10, 22, 16, 0.95)', BACKGROUND_DARK]}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Progress indicator */}
                    <View style={styles.header}>
                        <Pressable onPress={() => router.back()} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color="#fff" />
                        </Pressable>
                        <View style={styles.progressDots}>
                            <View style={styles.dotInactive} />
                            <View style={styles.dotInactive} />
                            <View style={styles.dotInactive} />
                            <View style={styles.dotInactive} />
                            <View style={styles.dotActive} />
                        </View>
                        <View style={{ width: 40 }} />
                    </View>

                    <View style={styles.content}>
                        {/* Icon */}
                        <View style={styles.iconContainer}>
                            <Ionicons name="shield-checkmark" size={64} color={PRIMARY} />
                        </View>

                        <Text style={styles.title}>The Promise</Text>

                        <Text style={styles.subtitle}>
                            We promise to guide you every step of the way. Now, it's your turn to commit.
                        </Text>

                        {/* Your Results Summary */}
                        <View style={styles.summaryCard}>
                            <Text style={styles.summaryTitle}>Your Personalized Plan</Text>

                            <View style={styles.summaryRow}>
                                <View style={styles.summaryItem}>
                                    <Ionicons name="flame-outline" size={24} color={PRIMARY} />
                                    <Text style={styles.summaryLabel}>Daily Goal</Text>
                                    <Text style={styles.summaryValue}>{calories.toLocaleString()}</Text>
                                    <Text style={styles.summaryUnit}>calories</Text>
                                </View>
                                <View style={styles.summaryDivider} />
                                <View style={styles.summaryItem}>
                                    <Ionicons name="fitness-outline" size={24} color={PRIMARY} />
                                    <Text style={styles.summaryLabel}>Workouts</Text>
                                    <Text style={styles.summaryValue}>4x</Text>
                                    <Text style={styles.summaryUnit}>per week</Text>
                                </View>
                            </View>

                            <View style={styles.goalBadge}>
                                <Ionicons name={isLosing ? "trending-down" : "trending-up"} size={16} color={PRIMARY} />
                                <Text style={styles.goalText}>Target: {isLosing ? 'Lose Weight' : 'Gain Weight'} • {Math.abs(targetDiff).toFixed(1)}kg</Text>
                            </View>
                        </View>

                        {/* Commitment Statement */}
                        <View style={styles.commitmentBox}>
                            <Ionicons name="checkmark-circle" size={20} color={PRIMARY} />
                            <Text style={styles.commitmentText}>
                                I commit to showing up for myself, one day at a time.
                            </Text>
                        </View>

                        <Button
                            title="I Commit"
                            onPress={handleCommit}
                            icon={<Ionicons name="arrow-forward" size={20} color="#000" />}
                            style={styles.button}
                        />

                        <Pressable onPress={handleCommit} style={styles.skipButton}>
                            <Text style={styles.skipText}>I'll commit later</Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </LinearGradient>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
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
    progressDots: {
        flexDirection: 'row',
        gap: 12,
    },
    dotInactive: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    dotActive: {
        width: 32,
        height: 8,
        borderRadius: 4,
        backgroundColor: PRIMARY,
        shadowColor: PRIMARY,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
    },
    content: {
        paddingHorizontal: 24,
        paddingBottom: 48,
        alignItems: 'center',
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(13, 242, 108, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(13, 242, 108, 0.3)',
        shadowColor: PRIMARY,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
    },
    title: {
        fontSize: 32, // Reduced
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 15,
        color: 'rgba(255, 255, 255, 0.6)',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 32,
        paddingHorizontal: 20,
    },
    summaryCard: {
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        marginBottom: 24,
    },
    summaryTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 24,
        textAlign: 'center',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    summaryItem: {
        alignItems: 'center',
        gap: 6,
    },
    summaryLabel: {
        fontSize: 11,
        color: 'rgba(255, 255, 255, 0.5)',
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    summaryValue: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    summaryUnit: {
        fontSize: 11,
        color: 'rgba(255, 255, 255, 0.5)',
    },
    summaryDivider: {
        width: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    goalBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: 'rgba(13, 242, 108, 0.1)',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 9999,
        borderWidth: 1,
        borderColor: 'rgba(13, 242, 108, 0.2)',
    },
    goalText: {
        fontSize: 13,
        fontWeight: '600',
        color: PRIMARY,
    },
    commitmentBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        backgroundColor: 'rgba(13, 242, 108, 0.03)',
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(13, 242, 108, 0.15)',
        marginBottom: 32,
    },
    commitmentText: {
        flex: 1,
        fontSize: 15,
        color: 'rgba(255, 255, 255, 0.9)',
        fontStyle: 'italic',
        lineHeight: 22,
    },
    button: {
        width: '100%',
        marginBottom: 16,
        marginTop: 0,
    },
    skipButton: {
        padding: 8,
    },
    skipText: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.4)',
        textDecorationLine: 'underline',
    },
});
