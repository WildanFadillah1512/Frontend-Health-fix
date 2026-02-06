import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import GlassPanel from '@/components/GlassPanel';
import { PRIMARY, BACKGROUND_DARK } from '@/constants/Colors';
import { useWorkouts } from '@/hooks/useWorkouts';

export default function WorkoutScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const { workouts, isLoading } = useWorkouts();

    const categories = ['All', 'Strength', 'Cardio', 'Core', 'Flexibility'];

    // Filter workouts
    const filteredWorkouts = workouts.filter(w => {
        const matchesCategory = selectedCategory === 'All' || w.category === selectedCategory;
        const matchesSearch = w.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Find featured workout (mock logic: first advanced workout)
    const featuredWorkout = workouts.length > 0
        ? (workouts.find(w => w.difficulty === 'Advanced') || workouts[0])
        : null;

    if (isLoading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: 'white' }}>Loading workouts...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Workouts</Text>
                <Pressable onPress={() => router.push('/workout/programs')} style={{ backgroundColor: 'rgba(255,255,255,0.1)', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20 }}>
                    <Text style={{ color: PRIMARY, fontWeight: '600' }}>Programs</Text>
                </Pressable>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="rgba(255,255,255,0.5)" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search workouts..."
                        placeholderTextColor="rgba(255,255,255,0.3)"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* Categories */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.categoriesScroll}
                    contentContainerStyle={styles.categories}
                >
                    {categories.map((category) => (
                        <Pressable
                            key={category}
                            style={[
                                styles.categoryChip,
                                selectedCategory === category && styles.categoryChipActive,
                            ]}
                            onPress={() => setSelectedCategory(category)}
                        >
                            <Text style={[
                                styles.categoryText,
                                selectedCategory === category && styles.categoryTextActive,
                            ]}>
                                {category}
                            </Text>
                        </Pressable>
                    ))}
                </ScrollView>

                {/* Today's Plan */}
                {selectedCategory === 'All' && !searchQuery && featuredWorkout && (
                    <>
                        <Text style={styles.sectionTitle}>Recommended for You</Text>

                        <GlassPanel style={styles.featuredCard}>
                            <View style={styles.featuredBadge}>
                                <Ionicons name="star" size={12} color="#000" />
                                <Text style={styles.featuredText}>FEATURED</Text>
                            </View>
                            <View style={styles.featuredContent}>
                                <View style={styles.featuredIcon}>
                                    <Ionicons name="flame" size={40} color={PRIMARY} />
                                </View>
                                <View style={styles.featuredInfo}>
                                    <Text style={styles.featuredTitle}>{featuredWorkout.title}</Text>
                                    <Text style={styles.featuredMeta}>{featuredWorkout.duration} min • {featuredWorkout.exercises.length} exercises</Text>
                                    <Text style={styles.featuredDesc}>{featuredWorkout.description}</Text>
                                </View>
                            </View>
                            <Pressable
                                style={styles.featuredButton}
                                onPress={() => router.push(`/workout/${featuredWorkout.id}`)}
                            >
                                <Text style={styles.featuredButtonText}>Start Workout</Text>
                                <Ionicons name="arrow-forward" size={18} color="#000" />
                            </Pressable>
                        </GlassPanel>
                    </>
                )}

                {/* All Workouts */}
                <Text style={styles.sectionTitle}>
                    {selectedCategory === 'All' ? 'All Workouts' : `${selectedCategory} Workouts`}
                </Text>

                {filteredWorkouts.map((workout) => (
                    <GlassPanel key={workout.id} style={styles.workoutCard}>
                        <View style={styles.workoutRow}>
                            <View style={styles.workoutIconContainer}>
                                <Ionicons name={workout.icon as any} size={28} color={PRIMARY} />
                            </View>
                            <View style={styles.workoutDetails}>
                                <Text style={styles.workoutTitle}>{workout.title}</Text>
                                <View style={styles.workoutStats}>
                                    <View style={styles.stat}>
                                        <Ionicons name="time-outline" size={14} color="rgba(255,255,255,0.5)" />
                                        <Text style={styles.statText}>{workout.duration} min</Text>
                                    </View>
                                    <View style={styles.statDot} />
                                    <View style={styles.stat}>
                                        <Ionicons name="fitness-outline" size={14} color="rgba(255,255,255,0.5)" />
                                        <Text style={styles.statText}>{workout.exercises.length} exercises</Text>
                                    </View>
                                </View>
                                <View style={styles.difficultyBadge}>
                                    <Text style={styles.difficultyText}>{workout.difficulty}</Text>
                                </View>
                            </View>
                            <Pressable
                                style={styles.playButton}
                                onPress={() => router.push(`/workout/${workout.id}`)}
                            >
                                <Ionicons name="play" size={20} color="#000" />
                            </Pressable>
                        </View>
                    </GlassPanel>
                ))}

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
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
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
    categoriesScroll: {
        marginBottom: 24,
    },
    categories: {
        gap: 12,
    },
    categoryChip: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 9999,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    categoryChipActive: {
        backgroundColor: PRIMARY,
        borderColor: PRIMARY,
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.7)',
    },
    categoryTextActive: {
        color: '#000',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 16,
    },
    featuredCard: {
        marginBottom: 32,
        padding: 20,
    },
    featuredBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: PRIMARY,
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 9999,
        marginBottom: 16,
    },
    featuredText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#000',
        letterSpacing: 1,
    },
    featuredContent: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 20,
    },
    featuredIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(13, 242, 108, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    featuredInfo: {
        flex: 1,
    },
    featuredTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    featuredMeta: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.6)',
        marginBottom: 8,
    },
    featuredDesc: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.5)',
        lineHeight: 18,
    },
    featuredButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: PRIMARY,
        paddingVertical: 16,
        borderRadius: 9999,
    },
    featuredButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
    },
    workoutCard: {
        marginBottom: 12,
        padding: 16,
    },
    workoutRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    workoutIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(13, 242, 108, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    workoutDetails: {
        flex: 1,
    },
    workoutTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 6,
    },
    workoutStats: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    stat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statText: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.6)',
    },
    statDot: {
        width: 3,
        height: 3,
        borderRadius: 1.5,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    difficultyBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 9999,
        backgroundColor: 'rgba(13, 242, 108, 0.15)',
        borderWidth: 1,
        borderColor: 'rgba(13, 242, 108, 0.3)',
    },
    difficultyText: {
        fontSize: 11,
        fontWeight: '600',
        color: PRIMARY,
    },
    playButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: PRIMARY,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
