import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Button from '@/components/Button';
import GlassPanel from '@/components/GlassPanel';
import { PRIMARY, BACKGROUND_DARK } from '@/constants/Colors';
import { useUser } from '@/context/UserContext';

export default function EditGoalsScreen() {
    const router = useRouter();
    const { userData, updateUserData, updatePreferences } = useUser();

    // Initialize state from userData
    const [targetWeight, setTargetWeight] = useState(userData.targetWeight || 70);
    // Real persisted calorie goal
    const [dailyCalories, setDailyCalories] = useState(userData.preferences?.calorieGoal || 2400);
    const [currentGoal, setCurrentGoal] = useState(userData.goal || 'Fat Loss');

    const handleSave = async () => {
        // Save Core User Data
        updateUserData({
            targetWeight: targetWeight,
            goal: currentGoal,
        });
        // Save Calorie Preference
        updatePreferences({
            calorieGoal: dailyCalories
        });

        router.back();
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="close" size={24} color="#fff" />
                </Pressable>
                <Text style={styles.headerTitle}>CALIBRATE GOALS</Text>
                <Pressable style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveText}>SAVE</Text>
                </Pressable>
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                {/* Current Objective */}
                <GlassPanel style={styles.objectiveCard}>
                    <View style={styles.objectiveHeader}>
                        <View style={styles.objectiveIcon}>
                            <Ionicons name="fitness" size={24} color={PRIMARY} />
                        </View>
                        <View style={styles.objectiveInfo}>
                            <Text style={styles.objectiveLabel}>CURRENT OBJECTIVE</Text>
                            <Text style={styles.objectiveTitle}>{currentGoal.replace('_', ' ').toUpperCase()}</Text>
                        </View>
                        {/* Could make this a picker or modal later */}
                        <Ionicons name="pencil" size={20} color="rgba(255,255,255,0.5)" />
                    </View>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: '65%' }]} />
                    </View>
                </GlassPanel>

                {/* Target Weight */}
                <GlassPanel style={styles.targetCard}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardLabel}>TARGET WEIGHT</Text>
                        <Text style={styles.unit}>KG</Text>
                    </View>

                    <View style={styles.weightDisplay}>
                        <Text style={styles.largeValue}>{targetWeight.toFixed(1)}</Text>
                        <Text style={styles.kgLabel}>kg</Text>
                    </View>

                    <View style={styles.goalIndicator}>
                        <Ionicons name="trending-down" size={16} color={PRIMARY} />
                        <Text style={styles.goalText}>
                            {userData.weight ? (targetWeight - userData.weight).toFixed(1) : '0'}kg difference
                        </Text>
                    </View>

                    {/* Simple +/- controls for now since Slider is mocked */}
                    <View style={styles.calorieControl}>
                        <Pressable
                            style={styles.adjustButton}
                            onPress={() => setTargetWeight(prev => Math.max(30, prev - 0.5))}
                        >
                            <Text style={styles.adjustButtonText}>-0.5</Text>
                        </Pressable>
                        <Pressable
                            style={styles.adjustButton}
                            onPress={() => setTargetWeight(prev => Math.min(200, prev + 0.5))}
                        >
                            <Text style={styles.adjustButtonText}>+0.5</Text>
                        </Pressable>
                    </View>
                </GlassPanel>

                {/* Daily Energy */}
                <GlassPanel style={styles.energyCard}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardLabel}>DAILY ENERGY</Text>
                        <Text style={styles.unit}>KCAL</Text>
                    </View>

                    <View style={styles.calorieControl}>
                        <Pressable
                            style={styles.adjustButton}
                            onPress={() => setDailyCalories(Math.max(1200, dailyCalories - 100))}
                        >
                            <Text style={styles.adjustButtonText}>-100</Text>
                        </Pressable>

                        <Text style={styles.calorieValue}>{dailyCalories.toLocaleString()}</Text>

                        <Pressable
                            style={styles.adjustButton}
                            onPress={() => setDailyCalories(Math.min(3500, dailyCalories + 100))}
                        >
                            <Text style={styles.adjustButtonText}>+100</Text>
                        </Pressable>
                    </View>
                </GlassPanel>

                {/* Estimated Achievement */}
                <GlassPanel style={styles.achievementCard}>
                    <View style={styles.achievementRow}>
                        <View style={styles.achievementItem}>
                            <Ionicons name="checkmark-circle" size={24} color={PRIMARY} />
                            <View style={styles.achievementInfo}>
                                <Text style={styles.achievementLabel}>ESTIMATED ACHIEVEMENT</Text>
                                <Text style={styles.achievementValue}>12 Weeks</Text>
                            </View>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.achievementItem}>
                            <View style={styles.achievementInfo}>
                                <Text style={styles.achievementLabel}>PROJ. DATE</Text>
                                <Text style={styles.achievementValue}>Nov 14, 2024</Text>
                            </View>
                        </View>
                    </View>
                </GlassPanel>

                <View style={{ height: 40 }} />
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
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
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
        fontSize: 14,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 1,
    },
    saveButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    saveText: {
        fontSize: 14,
        fontWeight: '700',
        color: PRIMARY,
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: 20,
    },
    objectiveCard: {
        marginBottom: 16,
        padding: 20,
    },
    objectiveHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    objectiveIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(13, 242, 108, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    objectiveInfo: {
        flex: 1,
    },
    objectiveLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: 'rgba(255, 255, 255, 0.5)',
        letterSpacing: 1,
        marginBottom: 4,
    },
    objectiveTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    progressBar: {
        height: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: PRIMARY,
        borderRadius: 3,
    },
    targetCard: {
        marginBottom: 16,
        padding: 20,
        alignItems: 'center',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 20,
    },
    cardLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: 'rgba(255, 255, 255, 0.5)',
        letterSpacing: 1.5,
    },
    unit: {
        fontSize: 11,
        fontWeight: '700',
        color: PRIMARY,
        letterSpacing: 1,
    },
    weightDisplay: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 8,
        marginBottom: 12,
    },
    largeValue: {
        fontSize: 56,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    kgLabel: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.5)',
    },
    goalIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 24,
    },
    goalText: {
        fontSize: 14,
        fontWeight: '600',
        color: PRIMARY,
    },
    sliderContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    sliderLabel: {
        fontSize: 11,
        color: 'rgba(255, 255, 255, 0.4)',
    },
    sliderTrack: {
        flex: 1,
        height: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 3,
        position: 'relative',
    },
    sliderFill: {
        height: '100%',
        backgroundColor: PRIMARY,
        borderRadius: 3,
    },
    sliderThumb: {
        position: 'absolute',
        top: -7,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: PRIMARY,
        borderWidth: 3,
        borderColor: BACKGROUND_DARK,
        transform: [{ translateX: -10 }],
    },
    energyCard: {
        marginBottom: 16,
        padding: 20,
    },
    calorieControl: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
        marginBottom: 24,
    },
    adjustButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    adjustButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    calorieValue: {
        fontSize: 40,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    achievementCard: {
        padding: 20,
    },
    achievementRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    achievementItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    achievementInfo: {
        flex: 1,
    },
    achievementLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: 'rgba(255, 255, 255, 0.5)',
        letterSpacing: 1,
        marginBottom: 4,
    },
    achievementValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    divider: {
        width: 1,
        height: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginHorizontal: 16,
    },
});
