import { View, Text, StyleSheet, Pressable, ScrollView, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import Button from '@/components/Button';
import { PRIMARY, BACKGROUND_DARK, SURFACE_DARK } from '@/constants/Colors';
import { useUser } from '@/context/UserContext';

export default function PhysicalDataScreen() {
    const router = useRouter();
    const { userData, updateUserData } = useUser();
    const [weight, setWeight] = useState(userData.weight);
    const [height, setHeight] = useState(userData.height);
    const [age, setAge] = useState(userData.age);
    const [gender, setGender] = useState<'male' | 'female' | 'other'>(userData.gender);

    const handleContinue = () => {
        updateUserData({ weight, height, age, gender });
        router.push('/(onboarding)/goals');
    };

    return (
        <ImageBackground
            source={require('../../assets/2.jpg')}
            style={styles.container}
            resizeMode="cover"
        >
            <LinearGradient
                colors={['rgba(16, 34, 23, 0.85)', BACKGROUND_DARK]}
                style={{ flex: 1 }}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </Pressable>
                    <Text style={styles.headerTitle}>Tune Your Stats</Text>
                </View>

                <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                    {/* Weight & Height Grid */}
                    <View style={styles.topSection}>
                        {/* Weight */}
                        <View style={styles.leftColumn}>
                            <View style={styles.weightCard}>
                                <Text style={styles.cardLabel}>WEIGHT</Text>
                                <View style={styles.valueDisplay}>
                                    <Text style={styles.largeValue}>{weight.toFixed(1)}</Text>
                                    <Text style={styles.unit}>kg</Text>
                                </View>
                                {/* Simplified wheel picker */}
                                <View style={styles.wheelPicker}>
                                    <Slider
                                        style={{ width: '100%' }}
                                        minimumValue={40}
                                        maximumValue={150}
                                        value={weight}
                                        onValueChange={setWeight}
                                        minimumTrackTintColor={PRIMARY}
                                        maximumTrackTintColor="rgba(255,255,255,0.1)"
                                        thumbTintColor={PRIMARY}
                                    />
                                </View>
                            </View>

                            {/* Gender Selector */}
                            <View style={styles.genderSelector}>
                                <Pressable
                                    style={[styles.genderButton, gender === 'female' && styles.genderButtonActive]}
                                    onPress={() => setGender('female')}
                                >
                                    <Ionicons name="female" size={18} color={gender === 'female' ? PRIMARY : 'rgba(255,255,255,0.5)'} />
                                    <Text style={[styles.genderText, gender === 'female' && styles.genderTextActive]}>Female</Text>
                                </Pressable>
                                <Pressable
                                    style={[styles.genderButton, gender === 'male' && styles.genderButtonActive]}
                                    onPress={() => setGender('male')}
                                >
                                    <Ionicons name="male" size={18} color={gender === 'male' ? PRIMARY : 'rgba(255,255,255,0.5)'} />
                                    <Text style={[styles.genderText, gender === 'male' && styles.genderTextActive]}>Male</Text>
                                </Pressable>
                                <Pressable
                                    style={[styles.genderButton, gender === 'other' && styles.genderButtonActive]}
                                    onPress={() => setGender('other')}
                                >
                                    <Ionicons name="transgender" size={18} color={gender === 'other' ? PRIMARY : 'rgba(255,255,255,0.5)'} />
                                    <Text style={[styles.genderText, gender === 'other' && styles.genderTextActive]}>Other</Text>
                                </Pressable>
                            </View>
                        </View>

                        {/* Height */}
                        <View style={styles.rightColumn}>
                            <View style={styles.heightCard}>
                                <Text style={styles.cardLabel}>HEIGHT</Text>
                                <View style={styles.heightSlider}>
                                    <Slider
                                        style={{ width: 220, height: 40, transform: [{ rotate: '-90deg' }] }}
                                        minimumValue={140}
                                        maximumValue={220}
                                        value={height}
                                        onValueChange={setHeight}
                                        minimumTrackTintColor={PRIMARY}
                                        maximumTrackTintColor="rgba(255,255,255,0.1)"
                                        thumbTintColor={PRIMARY}
                                    />
                                </View>
                                <View style={styles.heightValue}>
                                    <Text style={styles.mediumValue}>{Math.round(height)}</Text>
                                    <Text style={styles.smallUnit}>cm</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Age Slider */}
                    <View style={styles.ageSection}>
                        <View style={styles.ageHeader}>
                            <Text style={styles.ageLabel}>Age</Text>
                            <View style={styles.ageValueContainer}>
                                <Text style={styles.ageValue}>{age}</Text>
                                <Text style={styles.ageUnit}>yrs</Text>
                            </View>
                        </View>
                        <Slider
                            style={{ width: '100%', height: 40 }}
                            minimumValue={16}
                            maximumValue={80}
                            value={age}
                            onValueChange={(val) => setAge(Math.round(val))}
                            minimumTrackTintColor={PRIMARY}
                            maximumTrackTintColor="rgba(255,255,255,0.1)"
                            thumbTintColor={PRIMARY}
                        />
                    </View>

                    <Button
                        title="Calibrate Stats"
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
        paddingHorizontal: 16,
        paddingTop: 48,
        paddingBottom: 16,
        gap: 16,
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
        flex: 1,
        fontSize: 18,
        fontWeight: '700',
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        marginRight: 40,
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: 16,
    },
    topSection: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    leftColumn: {
        flex: 3,
        gap: 12,
    },
    rightColumn: {
        flex: 1.5,
    },
    weightCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)', // Glass effect
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        minHeight: 180,
    },
    heightCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 24,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 280,
    },
    cardLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: PRIMARY,
        letterSpacing: 1.5,
        marginBottom: 16,
        textAlign: 'center',
        textTransform: 'uppercase',
        opacity: 0.9,
    },
    valueDisplay: {
        alignItems: 'center',
        marginBottom: 20,
    },
    largeValue: {
        fontSize: 40, // Reduced from 48
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: -1,
    },
    unit: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.6)',
        marginTop: 2,
        fontWeight: '500',
    },
    wheelPicker: {
        flex: 1,
        justifyContent: 'center',
    },
    genderSelector: {
        flexDirection: 'row',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: 9999,
        padding: 4,
        gap: 4,
        height: 56,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    genderButton: {
        flex: 1,
        borderRadius: 9999,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    genderButtonActive: {
        backgroundColor: '#1E3E2B', // Darker green background
        borderWidth: 1,
        borderColor: PRIMARY,
    },
    genderText: {
        fontSize: 13,
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.5)',
    },
    genderTextActive: {
        color: '#FFFFFF',
    },
    heightSlider: {
        height: 220,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heightValue: {
        alignItems: 'center',
        marginTop: 8,
    },
    mediumValue: {
        fontSize: 22,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    smallUnit: {
        fontSize: 11,
        color: 'rgba(255, 255, 255, 0.5)',
    },
    ageSection: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        marginBottom: 24,
    },
    ageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 16,
    },
    ageLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.8)',
    },
    ageValueContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
    },
    ageValue: {
        fontSize: 28,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    ageUnit: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.5)',
    },
    button: {
        marginTop: 8,
        backgroundColor: PRIMARY,
    },
});
