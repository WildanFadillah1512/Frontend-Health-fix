import { View, Text, StyleSheet, Image, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Button from '@/components/Button';
import GlassPanel from '@/components/GlassPanel';
import { PRIMARY, BACKGROUND_DARK } from '@/constants/Colors';
import { useState } from 'react';

export default function MealDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [amount, setAmount] = useState(1);

    const food = {
        name: 'Avocado Toast',
        calories: 320,
        protein: 8,
        carbs: 24,
        fat: 22,
        portion: '1 slice',
        image: 'https://images.unsplash.com/photo-1588137372308-15f75323ca8d?w=500&q=80',
        ingredients: ['Sourdough bread', 'Half avocado', 'Red pepper flakes', 'Lemon juice'],
    };

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Hero Image */}
                <View style={styles.imageContainer}>
                    <Image source={{ uri: food.image }} style={styles.image} />
                    <Pressable onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </Pressable>
                    <View style={styles.gradientOverlay} />
                </View>

                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.title}>{food.name}</Text>
                        <View style={styles.portionRow}>
                            <Ionicons name="restaurant-outline" size={16} color="rgba(255,255,255,0.6)" />
                            <Text style={styles.portionText}>{food.portion}</Text>
                        </View>
                    </View>

                    {/* Macros */}
                    <View style={styles.macrosContainer}>
                        <GlassPanel style={styles.macroCard}>
                            <Text style={styles.macroValue}>{food.calories}</Text>
                            <Text style={styles.macroLabel}>Calories</Text>
                        </GlassPanel>
                        <View style={styles.macroDetails}>
                            <View style={styles.macroItem}>
                                <View style={[styles.dot, { backgroundColor: '#ec4899' }]} />
                                <Text style={styles.detailValue}>{food.protein}g</Text>
                                <Text style={styles.detailLabel}>Protein</Text>
                            </View>
                            <View style={styles.macroItem}>
                                <View style={[styles.dot, { backgroundColor: '#06b6d4' }]} />
                                <Text style={styles.detailValue}>{food.carbs}g</Text>
                                <Text style={styles.detailLabel}>Carbs</Text>
                            </View>
                            <View style={styles.macroItem}>
                                <View style={[styles.dot, { backgroundColor: '#f59e0b' }]} />
                                <Text style={styles.detailValue}>{food.fat}g</Text>
                                <Text style={styles.detailLabel}>Fat</Text>
                            </View>
                        </View>
                    </View>

                    {/* Amount Control */}
                    <GlassPanel style={styles.amountControl}>
                        <Text style={styles.amountLabel}>Number of servings</Text>
                        <View style={styles.stepper}>
                            <Pressable
                                style={styles.stepButton}
                                onPress={() => setAmount(Math.max(0.5, amount - 0.5))}
                            >
                                <Ionicons name="remove" size={20} color="#fff" />
                            </Pressable>

                            <Text style={styles.amountValue}>{amount}</Text>

                            <Pressable
                                style={styles.stepButton}
                                onPress={() => setAmount(amount + 0.5)}
                            >
                                <Ionicons name="add" size={20} color="#fff" />
                            </Pressable>
                        </View>
                    </GlassPanel>

                    {/* Ingredients */}
                    <Text style={styles.sectionTitle}>Ingredients</Text>
                    <View style={styles.ingredientsList}>
                        {food.ingredients.map((ing, i) => (
                            <View key={i} style={styles.ingredientRow}>
                                <Ionicons name="ellipse" size={6} color={PRIMARY} />
                                <Text style={styles.ingredientText}>{ing}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>

            {/* Add Button */}
            <View style={styles.footer}>
                <Button
                    title={`Add to Log • ${Math.round(food.calories * amount)} kcal`}
                    onPress={() => router.back()}
                    icon={<Ionicons name="add-circle" size={20} color="#000" />}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BACKGROUND_DARK,
    },
    imageContainer: {
        height: 300,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    gradientOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    backButton: {
        position: 'absolute',
        top: 60,
        left: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    content: {
        flex: 1,
        marginTop: -40,
        backgroundColor: BACKGROUND_DARK,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        paddingBottom: 100,
    },
    header: {
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 8,
    },
    portionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    portionText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 14,
    },
    macrosContainer: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 24,
    },
    macroCard: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        backgroundColor: 'rgba(13, 242, 108, 0.1)',
        borderColor: PRIMARY,
    },
    macroValue: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
    },
    macroLabel: {
        fontSize: 12,
        color: PRIMARY,
        fontWeight: '600',
    },
    macroDetails: {
        flex: 1.5,
        justifyContent: 'center',
        gap: 12,
    },
    macroItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    detailValue: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 14,
        width: 40,
    },
    detailLabel: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 12,
    },
    amountControl: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        marginBottom: 24,
    },
    amountLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
    },
    stepper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    stepButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    amountValue: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
        minWidth: 24,
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 16,
    },
    ingredientsList: {
        gap: 12,
    },
    ingredientRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    ingredientText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 15,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 24,
        backgroundColor: BACKGROUND_DARK,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.05)',
    },
});
