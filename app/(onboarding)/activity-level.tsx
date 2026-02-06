import { View, Text, StyleSheet, Pressable, ScrollView, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Button from '@/components/Button';
import { PRIMARY, BACKGROUND_DARK } from '@/constants/Colors';
import { useUser } from '@/context/UserContext';

type ActivityLevel = {
    id: string;
    title: string;
    description: string;
    icon: keyof typeof Ionicons.glyphMap;
    multiplier: string;
};

const ACTIVITY_LEVELS: ActivityLevel[] = [
    {
        id: 'sedentary',
        title: 'Sedentary',
        description: 'Little to no exercise',
        icon: 'desktop-outline',
        multiplier: '×1.2',
    },
    {
        id: 'light',
        title: 'Lightly Active',
        description: '1-3 days per week',
        icon: 'walk-outline',
        multiplier: '×1.375',
    },
    {
        id: 'moderate',
        title: 'Moderately Active',
        description: '3-5 days per week',
        icon: 'bicycle-outline',
        multiplier: '×1.55',
    },
    {
        id: 'very',
        title: 'Very Active',
        description: '6-7 days per week',
        icon: 'barbell-outline',
        multiplier: '×1.725',
    },
    {
        id: 'extra',
        title: 'Extra Active',
        description: 'Intense training daily',
        icon: 'flame-outline',
        multiplier: '×1.9',
    },
];

export default function ActivityLevelScreen() {
    const router = useRouter();
    const { userData, updateUserData } = useUser();
    const [selectedLevel, setSelectedLevel] = useState(userData.activityLevel);

    const handleContinue = () => {
        updateUserData({ activityLevel: selectedLevel });
        router.push('/(onboarding)/target');
    };

    return (
        <ImageBackground
            source={require('../../assets/4.jpg')}
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
                        <View style={styles.dotInactive} />
                        <View style={styles.dotActive} />
                        <View style={styles.dotInactive} />
                        <View style={styles.dotInactive} />
                    </View>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                    <Text style={styles.title}>How active are you?</Text>
                    <Text style={styles.subtitle}>
                        This helps us calculate your daily calorie needs.
                    </Text>

                    <View style={styles.levelsContainer}>
                        {ACTIVITY_LEVELS.map((level) => (
                            <Pressable
                                key={level.id}
                                style={[
                                    styles.levelCard,
                                    selectedLevel === level.id && styles.levelCardActive,
                                ]}
                                onPress={() => setSelectedLevel(level.id)}
                            >
                                <View style={styles.levelHeader}>
                                    <View style={[styles.iconContainer, selectedLevel === level.id && styles.iconContainerActive]}>
                                        <Ionicons
                                            name={level.icon}
                                            size={24}
                                            color={selectedLevel === level.id ? PRIMARY : 'rgba(255, 255, 255, 0.7)'}
                                        />
                                    </View>
                                    <Text style={styles.multiplier}>{level.multiplier}</Text>
                                </View>
                                <Text style={[styles.levelTitle, selectedLevel === level.id && styles.levelTitleActive]}>
                                    {level.title}
                                </Text>
                                <Text style={styles.levelDescription}>{level.description}</Text>
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
        fontSize: 28, // Reduced
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
    levelsContainer: {
        gap: 12,
        marginBottom: 32,
    },
    levelCard: {
        padding: 16,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    levelCardActive: {
        borderColor: PRIMARY,
        backgroundColor: 'rgba(13, 242, 108, 0.1)',
        shadowColor: PRIMARY,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
    },
    levelHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainerActive: {
        backgroundColor: 'rgba(13, 242, 108, 0.15)',
    },
    multiplier: {
        fontSize: 12,
        fontWeight: '600',
        color: PRIMARY,
        fontFamily: 'monospace',
        backgroundColor: 'rgba(13, 242, 108, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        overflow: 'hidden',
    },
    levelTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    levelTitleActive: {
        color: PRIMARY,
    },
    levelDescription: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.5)',
        lineHeight: 18,
    },
    button: {
        marginTop: 16,
    },
});
