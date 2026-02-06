import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PRIMARY, BACKGROUND_DARK } from '@/constants/Colors';
import { useUser } from '@/context/UserContext';
import { useState } from 'react';

export default function SleepLogScreen() {
    const router = useRouter();
    const { logSleep, userData } = useUser();
    const [hours, setHours] = useState('8');
    const [quality, setQuality] = useState('Good');

    const handleSave = () => {
        const h = parseFloat(hours);
        const wakeTime = new Date();
        const sleepTime = new Date(wakeTime.getTime() - h * 60 * 60 * 1000);

        logSleep({
            sleepTime: sleepTime.toISOString(),
            wakeTime: wakeTime.toISOString(),
            quality,
            notes: ''
        });
        router.back();
    }; const qualities = ['Poor', 'Fair', 'Good', 'Excellent'];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </Pressable>
                <Text style={styles.title}>Sleep Tracker</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.content}>
                <Ionicons name="moon" size={64} color="#8b5cf6" style={{ marginBottom: 40 }} />

                <Text style={styles.label}>How many hours did you sleep?</Text>

                <View style={styles.inputContainer}>
                    <Pressable onPress={() => setHours(String(Math.max(0, parseFloat(hours) - 0.5)))} style={styles.adjButton}>
                        <Ionicons name="remove" size={24} color="#fff" />
                    </Pressable>
                    <Text style={styles.value}>{hours}</Text>
                    <Pressable onPress={() => setHours(String(parseFloat(hours) + 0.5))} style={styles.adjButton}>
                        <Ionicons name="add" size={24} color="#fff" />
                    </Pressable>
                </View>
                <Text style={styles.unit}>Hours</Text>

                <Text style={styles.label}>Quality</Text>
                <View style={styles.qualityContainer}>
                    {qualities.map((q) => (
                        <Pressable
                            key={q}
                            style={[styles.qualityButton, quality === q && styles.qualityButtonActive]}
                            onPress={() => setQuality(q)}
                        >
                            <Text style={[styles.qualityText, quality === q && styles.qualityTextActive]}>{q}</Text>
                        </Pressable>
                    ))}
                </View>

                <Pressable style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>SAVE SLEEP</Text>
                </Pressable>
            </View>
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 100,
    },
    label: {
        fontSize: 18,
        color: 'rgba(255,255,255,0.7)',
        marginBottom: 32,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 32,
        marginBottom: 16,
    },
    adjButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    value: {
        fontSize: 64,
        fontWeight: '700',
        color: '#fff',
    },
    unit: {
        fontSize: 18,
        color: 'rgba(255,255,255,0.5)',
        marginBottom: 60,
    },
    saveButton: {
        backgroundColor: PRIMARY,
        paddingHorizontal: 60,
        paddingVertical: 16,
        borderRadius: 30,
    },
    saveButtonText: {
        color: '#000',
        fontWeight: '700',
        fontSize: 16,
    },
    qualityContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 40,
    },
    qualityButton: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    qualityButtonActive: {
        backgroundColor: PRIMARY,
        borderColor: PRIMARY,
    },
    qualityText: {
        color: '#fff',
        fontWeight: '600',
    },
    qualityTextActive: {
        color: '#000',
    },
});
