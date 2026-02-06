import { View, Text, TextInput, Pressable, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import client from '@/api/client';
import { PRIMARY, BACKGROUND_DARK } from '@/constants/Colors';
import GlassPanel from '@/components/GlassPanel';
import { Ionicons } from '@expo/vector-icons';
import { DatabaseService } from '@/services/DatabaseService';

export default function CreateFoodScreen() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [calories, setCalories] = useState('');
    const [protein, setProtein] = useState('');
    const [carbs, setCarbs] = useState('');
    const [fat, setFat] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        if (!name || !calories) {
            Alert.alert('Error', 'Please enter name and calories');
            return;
        }

        setLoading(true);
        try {
            const response = await client.post('/foods/custom', {
                name,
                calories: parseInt(calories),
                protein: parseFloat(protein) || 0,
                carbs: parseFloat(carbs) || 0,
                fat: parseFloat(fat) || 0,
                portion: '1 serving' // Default
            });

            // Seed locally so it appears in search immediately
            if (response.data) {
                DatabaseService.seedFoods([response.data]);
            }

            Alert.alert('Success', 'Food created successfully');
            router.back();
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to create food');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </Pressable>
                <Text style={styles.title}>Create Custom Food</Text>
                <View style={{ width: 40 }} />
            </View>
            <ScrollView style={styles.content}>
                <GlassPanel style={styles.formCard}>
                    <Text style={styles.label}>Food Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. Grandma's Apple Pie"
                        placeholderTextColor="rgba(255,255,255,0.3)"
                        value={name}
                        onChangeText={setName}
                    />

                    <Text style={styles.label}>Calories</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="0"
                        placeholderTextColor="rgba(255,255,255,0.3)"
                        keyboardType="numeric"
                        value={calories}
                        onChangeText={setCalories}
                    />

                    <View style={styles.row}>
                        <View style={styles.col}>
                            <Text style={styles.label}>Protein (g)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="0"
                                placeholderTextColor="rgba(255,255,255,0.3)"
                                keyboardType="numeric"
                                value={protein}
                                onChangeText={setProtein}
                            />
                        </View>
                        <View style={styles.col}>
                            <Text style={styles.label}>Carbs (g)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="0"
                                placeholderTextColor="rgba(255,255,255,0.3)"
                                keyboardType="numeric"
                                value={carbs}
                                onChangeText={setCarbs}
                            />
                        </View>
                        <View style={styles.col}>
                            <Text style={styles.label}>Fat (g)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="0"
                                placeholderTextColor="rgba(255,255,255,0.3)"
                                keyboardType="numeric"
                                value={fat}
                                onChangeText={setFat}
                            />
                        </View>
                    </View>

                    <Pressable style={styles.createButton} onPress={handleCreate} disabled={loading}>
                        <Text style={styles.createButtonText}>{loading ? 'Creating...' : 'Create Food'}</Text>
                    </Pressable>
                </GlassPanel>
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
        padding: 20,
    },
    formCard: {
        padding: 20,
    },
    label: {
        color: '#fff',
        marginBottom: 8,
        fontWeight: '600',
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: 16,
        color: '#fff',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    col: {
        flex: 1,
    },
    createButton: {
        backgroundColor: PRIMARY,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 16,
    },
    createButtonText: {
        color: '#000',
        fontWeight: '700',
        fontSize: 16,
    }
});
