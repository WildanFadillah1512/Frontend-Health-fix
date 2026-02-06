import { View, Text, StyleSheet, TextInput, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import GlassPanel from '@/components/GlassPanel';
import { PRIMARY, BACKGROUND_DARK } from '@/constants/Colors';
import { useState } from 'react';

export default function FoodSearchScreen() {
    const router = useRouter();
    const [search, setSearch] = useState('');

    const recentFoods = [
        { name: 'Oatmeal', calories: 150, portion: '1 cup' },
        { name: 'Banana', calories: 105, portion: '1 medium' },
        { name: 'Chicken Breast', calories: 165, portion: '100g' },
        { name: 'Rice', calories: 205, portion: '1 cup cooked' },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.closeButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </Pressable>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color="rgba(255,255,255,0.5)" />
                    <TextInput
                        style={styles.input}
                        placeholder="Search food (e.g. Avocado)"
                        placeholderTextColor="rgba(255,255,255,0.3)"
                        value={search}
                        onChangeText={setSearch}
                        autoFocus
                    />
                </View>
                <Pressable onPress={() => router.push('/(nutrition)/create-food')} style={styles.createButton}>
                    <Ionicons name="add" size={24} color="#fff" />
                </Pressable>
            </View>

            <ScrollView style={styles.content}>
                <Text style={styles.sectionTitle}>Recent</Text>
                {recentFoods.map((food, index) => (
                    <Pressable key={index} style={styles.foodItem}>
                        <View style={styles.foodInfo}>
                            <Text style={styles.foodName}>{food.name}</Text>
                            <Text style={styles.foodPortion}>{food.portion}</Text>
                        </View>
                        <View style={styles.foodAction}>
                            <Text style={styles.calories}>{food.calories}</Text>
                            <Ionicons name="add-circle-outline" size={24} color={PRIMARY} />
                        </View>
                    </Pressable>
                ))}

                <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Categories</Text>
                <View style={styles.categories}>
                    {['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map((cat, i) => (
                        <GlassPanel key={i} style={styles.categoryCard}>
                            <Text style={styles.categoryText}>{cat}</Text>
                        </GlassPanel>
                    ))}
                </View>
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
        paddingTop: 60,
        paddingHorizontal: 16,
        paddingBottom: 16,
        gap: 12,
    },
    closeButton: {
        padding: 4,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
        gap: 8,
    },
    input: {
        flex: 1,
        color: '#fff',
        fontSize: 16,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 16,
    },
    foodItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    foodInfo: {
        flex: 1,
    },
    foodName: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '500',
        marginBottom: 2,
    },
    foodPortion: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.5)',
    },
    foodAction: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    calories: {
        fontSize: 15,
        color: PRIMARY,
        fontWeight: '600',
    },
    categories: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    categoryCard: {
        width: '48%',
        padding: 20,
        alignItems: 'center',
        borderRadius: 12,
    },
    categoryText: {
        color: '#fff',
        fontWeight: '600',
    },
    createButton: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
