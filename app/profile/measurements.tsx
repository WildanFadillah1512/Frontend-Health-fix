
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PRIMARY, BACKGROUND_DARK, SURFACE_DARK } from '@/constants/Colors';
import client from '@/api/client';
import GlassPanel from '@/components/GlassPanel';
import { useUser } from '@/context/UserContext';

export default function MeasurementLogScreen() {
    const router = useRouter();
    const { updateUserData } = useUser();
    const [loading, setLoading] = useState(false);

    const [weight, setWeight] = useState('');
    const [bodyFat, setBodyFat] = useState('');
    const [chest, setChest] = useState('');
    const [waist, setWaist] = useState('');
    const [hips, setHips] = useState('');

    const handleSubmit = async () => {
        if (!weight) {
            Alert.alert('Error', 'Please enter at least your weight.');
            return;
        }

        setLoading(true);
        try {
            await client.post('/measurements/log', {
                weight,
                bodyFat: bodyFat || undefined,
                chest: chest || undefined,
                waist: waist || undefined,
                hips: hips || undefined,
                date: new Date().toISOString()
            });

            // Update local user context if weight changed
            updateUserData({ weight: parseFloat(weight) });

            Alert.alert('Success', 'Measurement logged successfully!', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } catch (e: any) {
            Alert.alert('Error', 'Failed to log measurement. ' + (e.response?.data?.error || e.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                </Pressable>
                <Text style={styles.headerTitle}>Log Measurements</Text>
            </View>

            <View style={styles.content}>
                <GlassPanel style={styles.formCard}>
                    <Text style={styles.label}>Weight (kg)</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={weight}
                        onChangeText={setWeight}
                        placeholder="e.g. 75.5"
                        placeholderTextColor="#666"
                    />

                    <Text style={styles.label}>Body Fat (%)</Text>
                    <TextInput
                        style={styles.input} output
                        keyboardType="numeric"
                        value={bodyFat}
                        onChangeText={setBodyFat}
                        placeholder="Optional"
                        placeholderTextColor="#666"
                    />

                    <View style={styles.row}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.label}>Chest (cm)</Text>
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                value={chest}
                                onChangeText={setChest}
                                placeholder="Optional"
                                placeholderTextColor="#666"
                            />
                        </View>
                        <View style={{ width: 15 }} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.label}>Waist (cm)</Text>
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                value={waist}
                                onChangeText={setWaist}
                                placeholder="Optional"
                                placeholderTextColor="#666"
                            />
                        </View>
                    </View>

                    <Text style={styles.label}>Hips (cm)</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={hips}
                        onChangeText={setHips}
                        placeholder="Optional"
                        placeholderTextColor="#666"
                    />
                </GlassPanel>

                <Pressable
                    onPress={handleSubmit}
                    style={[styles.submitButton, loading && { opacity: 0.7 }]}
                    disabled={loading}
                >
                    {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.submitText}>Save Measurements</Text>}
                </Pressable>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: BACKGROUND_DARK },
    header: { padding: 20, paddingTop: 60, flexDirection: 'row', alignItems: 'center', backgroundColor: SURFACE_DARK },
    backButton: { marginRight: 15 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
    content: { padding: 20 },
    formCard: { padding: 20, marginBottom: 20 },
    label: { color: '#AAA', fontSize: 14, marginBottom: 8, marginTop: 10 },
    input: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: 12, color: '#FFF', fontSize: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    row: { flexDirection: 'row' },
    submitButton: { backgroundColor: PRIMARY, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 10 },
    submitText: { color: '#000', fontWeight: 'bold', fontSize: 16 }
});
