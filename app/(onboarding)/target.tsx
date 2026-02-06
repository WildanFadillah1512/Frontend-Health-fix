import { View, Text, StyleSheet, Pressable, ScrollView, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import Button from '@/components/Button';
import { PRIMARY, BACKGROUND_DARK } from '@/constants/Colors';
import { useUser } from '@/context/UserContext';

export default function TargetScreen() {
    const router = useRouter();
    const { userData, updateUserData } = useUser();
    const [targetWeight, setTargetWeight] = useState(userData.targetWeight);
    const [currentWeight] = useState(userData.weight);

    const handleContinue = () => {
        updateUserData({ targetWeight });
        router.push('/(onboarding)/promise');
    };

    return (
        <ImageBackground
            source={require('../../assets/3.jpg')} // reusing an image for now, can be changed
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
                    {/* Progress indicators - Step 4 of 5 */}
                    <View style={styles.progressDots}>
                        <View style={styles.dotInactive} />
                        <View style={styles.dotInactive} />
                        <View style={styles.dotInactive} />
                        <View style={styles.dotActive} />
                        <View style={styles.dotInactive} />
                    </View>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                    <Text style={styles.title}>Set Your Target</Text>
                    <Text style={styles.subtitle}>
                        What is your goal weight? We'll help you get there safely.
                    </Text>

                    <View style={styles.targetCard}>
                        <View style={styles.targetHeader}>
                            <View style={styles.weightInfo}>
                                <Text style={styles.label}>CURRENT</Text>
                                <Text style={styles.value}>{currentWeight} <Text style={styles.unit}>kg</Text></Text>
                            </View>
                            <Ionicons name="arrow-forward" size={24} color={PRIMARY} style={{ opacity: 0.5 }} />
                            <View style={styles.weightInfo}>
                                <Text style={[styles.label, { color: PRIMARY }]}>TARGET</Text>
                                <Text style={styles.valueActive}>{targetWeight.toFixed(1)} <Text style={[styles.unit, { color: PRIMARY }]}>kg</Text></Text>
                            </View>
                        </View>

                        <View style={styles.sliderContainer}>
                            <Slider
                                style={{ width: '100%', height: 40 }}
                                minimumValue={50}
                                maximumValue={100}
                                value={targetWeight}
                                onValueChange={setTargetWeight}
                                minimumTrackTintColor={PRIMARY}
                                maximumTrackTintColor="rgba(255,255,255,0.1)"
                                thumbTintColor={PRIMARY}
                            />
                        </View>
                    </View>

                    <View style={styles.insightCard}>
                        <Ionicons name="information-circle-outline" size={24} color={PRIMARY} />
                        <Text style={styles.insightText}>
                            A sustainable goal is to lose 0.5 - 1kg per week.
                        </Text>
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
        gap: 8, // slightly reduced gap to fit 5 dots
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
        fontSize: 28,
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
    targetCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        marginBottom: 24,
    },
    targetHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
    },
    weightInfo: {
        alignItems: 'center',
    },
    label: {
        fontSize: 12,
        fontWeight: '700',
        color: 'rgba(255, 255, 255, 0.6)',
        marginBottom: 8,
        letterSpacing: 1,
    },
    value: {
        fontSize: 24,
        fontWeight: '700',
        color: 'rgba(255, 255, 255, 0.8)',
    },
    valueActive: {
        fontSize: 32,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    unit: {
        fontSize: 14,
        fontWeight: '600',
    },
    sliderContainer: {
        marginTop: 8,
    },
    insightCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: 'rgba(13, 242, 108, 0.1)',
        padding: 16,
        borderRadius: 16,
        marginBottom: 32,
    },
    insightText: {
        flex: 1,
        fontSize: 14,
        color: PRIMARY,
        lineHeight: 20,
    },
    button: {
        marginTop: 16,
    },
});
