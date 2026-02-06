import { View, Text, StyleSheet, Pressable, ScrollView, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Button from '@/components/Button';
import { PRIMARY, BACKGROUND_DARK } from '@/constants/Colors';
import { useUser } from '@/context/UserContext';

type Goal = {
    id: string;
    title: string;
    description: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
};

const GOALS: Goal[] = [
    {
        id: 'lose_weight',
        title: 'Lose Weight',
        description: 'Burn fat and get lean.',
        icon: 'scale-outline',
        color: '#3b82f6',
    },
    {
        id: 'build_muscle',
        title: 'Build Muscle',
        description: 'Gain mass and strength.',
        icon: 'barbell-outline',
        color: '#a855f7',
    },
    {
        id: 'stay_fit',
        title: 'Stay Fit',
        description: 'Maintain healthy lifestyle.',
        icon: 'heart-outline',
        color: '#f97316',
    },
    {
        id: 'improve_endurance',
        title: 'Improve Endurance',
        description: 'Build stamina and cardio.',
        icon: 'bicycle-outline',
        color: '#06b6d4',
    },
];

export default function GoalsScreen() {
    const router = useRouter();
    const { userData, updateUserData } = useUser();
    const [selectedGoal, setSelectedGoal] = useState(userData.goal);

    const handleContinue = () => {
        updateUserData({ goal: selectedGoal });
        router.push('/(onboarding)/activity-level');
    };

    return (
        <ImageBackground
            source={require('../../assets/3.jpg')}
            style={styles.container}
            resizeMode="cover"
        >
            <LinearGradient
                colors={['rgba(16, 34, 23, 0.9)', BACKGROUND_DARK]}
                style={{ flex: 1 }}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </Pressable>
                    {/* Progress indicators */}
                    <View style={styles.progressDots}>
                        <View style={styles.dotInactive} />
                        <View style={styles.dotActive} />
                        <View style={styles.dotInactive} />
                        <View style={styles.dotInactive} />
                        <View style={styles.dotInactive} />
                    </View>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                    <Text style={styles.title}>Let's define your path.</Text>
                    <Text style={styles.subtitle}>
                        Select the goal that matters most to you right now.
                    </Text>

                    <View style={styles.goalsContainer}>
                        {GOALS.map((goal) => (
                            <Pressable
                                key={goal.id}
                                style={[
                                    styles.goalCard,
                                    selectedGoal === goal.id && styles.goalCardActive,
                                ]}
                                onPress={() => setSelectedGoal(goal.id)}
                            >
                                <View style={[styles.iconContainer, { backgroundColor: `${goal.color}20` }]}>
                                    <Ionicons name={goal.icon} size={28} color={selectedGoal === goal.id ? PRIMARY : goal.color} />
                                </View>
                                <View style={styles.goalText}>
                                    <Text style={[styles.goalTitle, selectedGoal === goal.id && styles.goalTitleActive]}>
                                        {goal.title}
                                    </Text>
                                    <Text style={styles.goalDescription}>{goal.description}</Text>
                                </View>
                                <View style={[styles.radio, selectedGoal === goal.id && styles.radioActive]}>
                                    {selectedGoal === goal.id && <View style={styles.radioDot} />}
                                </View>
                            </Pressable>
                        ))}
                    </View>

                    <Button
                        title="Continue"
                        onPress={handleContinue}
                        icon={<Ionicons name="arrow-forward" size={20} color="#000" />}
                        style={styles.button}
                    />
                </ScrollView>
            </LinearGradient>
        </ImageBackground>
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
        flex: 1,
    },
    contentContainer: {
        padding: 24,
    },
    title: {
        fontSize: 28, // Reduced from 32
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.6)',
        lineHeight: 22,
        marginBottom: 32,
        textAlign: 'center',
        maxWidth: '80%',
        alignSelf: 'center',
    },
    goalsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 32,
    },
    goalCard: {
        width: '48%', // Grid layout (approx 2 columns)
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        padding: 16,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    goalCardActive: {
        borderColor: PRIMARY,
        backgroundColor: 'rgba(13, 242, 108, 0.1)',
        shadowColor: PRIMARY,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    goalText: {
        alignItems: 'center',
    },
    goalTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 4,
        textAlign: 'center',
    },
    goalTitleActive: {
        color: PRIMARY,
    },
    goalDescription: {
        fontSize: 11,
        color: 'rgba(255, 255, 255, 0.5)',
        textAlign: 'center',
        lineHeight: 14,
    },
    radio: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioActive: {
        borderColor: PRIMARY,
        backgroundColor: PRIMARY,
    },
    radioDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#000',
    },
    button: {
        marginTop: 16,
    },
});
