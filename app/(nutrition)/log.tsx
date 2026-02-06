import { View, Text, StyleSheet, TextInput, Pressable, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PRIMARY, BACKGROUND_DARK } from '@/constants/Colors';
import { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';

export default function LogMealScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { addMeal } = useUser();

    // If params passed from search (id, name, etc), populate
    const [name, setName] = useState(params.name as string || '');
    const [calories, setCalories] = useState(params.calories as string || '');
    const [protein, setProtein] = useState(params.protein as string || '');
    const [carbs, setCarbs] = useState(params.carbs as string || '');
    const [fat, setFat] = useState(params.fat as string || '');
    const [type, setType] = useState('Breakfast');

    const handleSave = () => {
        if (!name || !calories) return;

        addMeal({
            id: Date.now().toString(),
            name,
            calories: parseInt(calories),
            protein: parseInt(protein) || 0,
            carbs: parseInt(carbs) || 0,
            fat: parseInt(fat) || 0,
            time: type,
            image: params.image as string // optional
        });

        router.back();
    };

    const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </Pressable>
                <Text style={styles.title}>Log Meal</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.content}>
                <Text style={styles.label}>Meal Type</Text>
                <View style={styles.typeContainer}>
                    {mealTypes.map((t) => (
                        <Pressable
                            key={t}
                            style={[styles.typeButton, type === t && styles.typeButtonActive]}
                            onPress={() => setType(t)}
                        >
                            <Text style={[styles.typeText, type === t && styles.typeTextActive]}>{t}</Text>
                        </Pressable>
                    ))}
                </View>

                <Text style={styles.label}>Food Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g. Oatmeal"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    value={name}
                    onChangeText={setName}
                />

                <Text style={styles.label}>Calories (kcal)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="0"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    keyboardType="numeric"
                    value={calories}
                    onChangeText={setCalories}
                />

                <View style={styles.macrosRow}>
                    <View style={styles.macroInput}>
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
                    <View style={styles.macroInput}>
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
                    <View style={styles.macroInput}>
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

                <Pressable style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>SAVE MEAL</Text>
                </Pressable>
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
        padding: 24,
    },
    label: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        marginBottom: 8,
        fontWeight: '600',
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: 16,
        color: '#fff',
        fontSize: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    typeContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
        flexWrap: 'wrap',
    },
    typeButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    typeButtonActive: {
        backgroundColor: PRIMARY,
        borderColor: PRIMARY,
    },
    typeText: {
        color: 'rgba(255,255,255,0.7)',
        fontWeight: '600',
    },
    typeTextActive: {
        color: '#000',
    },
    macrosRow: {
        flexDirection: 'row',
        gap: 16,
    },
    macroInput: {
        flex: 1,
    },
    saveButton: {
        backgroundColor: PRIMARY,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 24,
    },
    saveButtonText: {
        color: '#000',
        fontWeight: '700',
        fontSize: 16,
    },
});
