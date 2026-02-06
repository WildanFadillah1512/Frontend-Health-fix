import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GlassPanel from '@/components/GlassPanel';
import { PRIMARY, BACKGROUND_DARK } from '@/constants/Colors';
import { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'expo-router';
import { useFoods } from '@/hooks/useFoods';

export default function NutritionScreen() {
    const router = useRouter();
    const { userData } = useUser();
    const [searchQuery, setSearchQuery] = useState('');
    const { searchResults, searchFoods } = useFoods();

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery.length > 0) {
                searchFoods(searchQuery);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const macros = {
        protein: { current: 54, goal: 120, color: '#ec4899' },
        carbs: { current: 180, goal: 250, color: '#06b6d4' },
        fat: { current: 42, goal: 65, color: '#f59e0b' },
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Nutrition</Text>
                <Pressable onPress={() => router.push('/(nutrition)/recipes')} style={{ backgroundColor: 'rgba(255,255,255,0.1)', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20 }}>
                    <Text style={{ color: PRIMARY, fontWeight: '600' }}>Recipes</Text>
                </Pressable>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="rgba(255,255,255,0.5)" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search for food..."
                        placeholderTextColor="rgba(255,255,255,0.3)"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {searchQuery.length > 0 ? (
                    <View>
                        <Text style={styles.sectionTitle}>Search Results</Text>
                        {searchResults.map((food) => (
                            <GlassPanel key={food.id} style={styles.mealCard}>
                                <View style={styles.mealHeader}>
                                    <View>
                                        <Text style={styles.mealTitle}>{food.name}</Text>
                                        <Text style={styles.mealCalories}>{food.calories} kcal</Text>
                                    </View>
                                    <Pressable
                                        style={styles.addButton}
                                        onPress={() => router.push({
                                            pathname: '/(nutrition)/log', // Using directory group
                                            params: { ...food }
                                        })}
                                    >
                                        <Ionicons name="add" size={24} color="#000" />
                                    </Pressable>
                                </View>
                                <View style={styles.mealMacros}>
                                    <Text style={styles.macroText}>{food.protein}g P • {food.carbs}g C • {food.fat}g F</Text>
                                </View>
                            </GlassPanel>
                        ))}
                    </View>
                ) : (
                    <>
                        {/* Daily Calorie Goal (Same as before) */}
                        <GlassPanel style={styles.calorieCard}>
                            <View style={styles.calorieHeader}>
                                <Text style={styles.cardTitle}>Daily Goal</Text>
                                <Text style={styles.remaining}>
                                    {Math.max(0, 2400 - userData.dailyStats.calories)} kcal left
                                </Text>
                            </View>
                            <View style={styles.calorieBar}>
                                <View style={[styles.calorieProgress, { width: `${Math.min(100, (userData.dailyStats.calories / 2400) * 100)}%` }]} />
                            </View>
                            <View style={styles.calorieStats}>
                                <View>
                                    <Text style={styles.statValue}>{userData.dailyStats.calories}</Text>
                                    <Text style={styles.statLabel}>Consumed</Text>
                                </View>
                                <View style={styles.statDivider} />
                                <View>
                                    <Text style={styles.statValue}>2,400</Text>
                                    <Text style={styles.statLabel}>Target</Text>
                                </View>
                            </View>
                        </GlassPanel>

                        {/* Today's Meals List */}
                        <View style={styles.mealsSection}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.cardTitle}>Today's Meals</Text>
                                <Pressable onPress={() => router.push('/(nutrition)/log')}>
                                    <Ionicons name="add-circle" size={28} color={PRIMARY} />
                                </Pressable>
                            </View>

                            {userData.dailyStats.meals.length > 0 ? (
                                userData.dailyStats.meals.map((meal, index) => (
                                    <GlassPanel key={index} style={styles.mealCard}>
                                        <View style={styles.mealHeader}>
                                            <Ionicons name="restaurant" size={24} color={PRIMARY} />
                                            <Text style={styles.mealTime}>{meal.time}</Text>
                                            <Text style={styles.mealCalories}>{meal.calories} kcal</Text>
                                        </View>
                                        <Text style={styles.mealItem}>{meal.name}</Text>
                                        <Text style={styles.macroText}>P: {meal.protein}g  C: {meal.carbs}g  F: {meal.fat}g</Text>
                                    </GlassPanel>
                                ))
                            ) : (
                                <GlassPanel style={[styles.mealCard, styles.mealCardEmpty]}>
                                    <View style={styles.emptyMeal}>
                                        <Ionicons name="restaurant-outline" size={24} color="rgba(255,255,255,0.3)" />
                                        <Text style={styles.emptyMealText}>No meals logged today</Text>
                                        <Pressable style={styles.addMealButton} onPress={() => router.push('/(nutrition)/log')}>
                                            <Text style={styles.addMealText}>+ Log Meal</Text>
                                        </Pressable>
                                    </View>
                                </GlassPanel>
                            )}
                        </View>
                    </>
                )}

                <View style={{ height: 80 }} />
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
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    searchButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    calorieCard: {
        marginBottom: 20,
    },
    calorieHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    remaining: {
        fontSize: 14,
        fontWeight: '600',
        color: PRIMARY,
    },
    calorieBar: {
        height: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 6,
        overflow: 'hidden',
        marginBottom: 16,
    },
    calorieProgress: {
        height: '100%',
        backgroundColor: PRIMARY,
        borderRadius: 6,
    },
    calorieStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    statValue: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    statLabel: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.5)',
        marginTop: 4,
        textAlign: 'center',
    },
    statDivider: {
        width: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    macrosCard: {
        marginBottom: 20,
    },
    macroRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginTop: 16,
    },
    macroInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        width: 80,
    },
    macroDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    macroName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    macroProgress: {
        flex: 1,
        position: 'relative',
        height: 8,
    },
    macroBar: {
        height: '100%',
        borderRadius: 4,
    },
    macroValue: {
        fontSize: 13,
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.7)',
        minWidth: 90,
        textAlign: 'right',
    },
    mealsSection: {
        marginBottom: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    mealCard: {
        marginBottom: 12,
    },
    mealHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
    },
    mealTime: {
        flex: 1,
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    mealCalories: {
        fontSize: 14,
        fontWeight: '600',
        color: PRIMARY,
    },
    mealItem: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.6)',
        lineHeight: 22,
        marginLeft: 36,
    },
    mealCardEmpty: {
        borderStyle: 'dashed',
    },
    emptyMeal: {
        alignItems: 'center',
        paddingVertical: 16,
    },
    emptyMealText: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.4)',
        marginTop: 8,
        marginBottom: 12,
    },
    addMealButton: {
        paddingHorizontal: 20,
        paddingVertical: 8,
    },
    addMealText: {
        fontSize: 14,
        fontWeight: '600',
        color: PRIMARY,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 9999,
        paddingHorizontal: 20,
        height: 48,
        marginBottom: 20,
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#FFFFFF',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 16,
    },
    mealTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    mealMacros: {
        marginTop: 4,
    },
    macroText: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.6)',
        marginTop: 4,
    },
    addButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: PRIMARY,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        right: 0,
        top: 0,
    }
});
