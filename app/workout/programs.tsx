
import { View, Text, StyleSheet, ScrollView, Pressable, Image, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PRIMARY, BACKGROUND_DARK, SURFACE_DARK } from '@/constants/Colors';
import client from '@/api/client';

export default function ProgramsScreen() {
    const router = useRouter();
    const [programs, setPrograms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const res = await client.get('/programs');
                setPrograms(res.data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchPrograms();
    }, []);

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                </Pressable>
                <Text style={styles.headerTitle}>Workout Programs</Text>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color={PRIMARY} style={{ marginTop: 40 }} />
            ) : (
                <View style={styles.list}>
                    {programs.map((program) => (
                        <Pressable
                            key={program.id}
                            style={styles.card}
                            onPress={() => router.push(`/workout/program/${program.id}`)}
                        >
                            <Image source={{ uri: program.thumbnailUrl || 'https://via.placeholder.com/300x150' }} style={styles.image} />
                            <View style={styles.cardContent}>
                                <Text style={styles.title}>{program.title}</Text>
                                <Text style={styles.description} numberOfLines={2}>{program.description}</Text>
                                <View style={styles.stats}>
                                    <Text style={styles.stat}>{program.duration} Weeks</Text>
                                    <Text style={styles.stat}>•</Text>
                                    <Text style={styles.stat}>{program.difficulty}</Text>
                                </View>
                                {program.isPremium && (
                                    <View style={styles.badge}>
                                        <Text style={styles.badgeText}>PREMIUM</Text>
                                    </View>
                                )}
                            </View>
                        </Pressable>
                    ))}
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: BACKGROUND_DARK },
    header: { padding: 20, paddingTop: 60, flexDirection: 'row', alignItems: 'center', backgroundColor: SURFACE_DARK },
    backButton: { marginRight: 15 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
    list: { padding: 20, gap: 15 },
    card: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, overflow: 'hidden' },
    image: { width: '100%', height: 150 },
    cardContent: { padding: 15 },
    title: { fontSize: 18, fontWeight: 'bold', color: '#FFF', marginBottom: 5 },
    description: { color: '#AAA', fontSize: 14, marginBottom: 10 },
    stats: { flexDirection: 'row', gap: 10, alignItems: 'center' },
    stat: { color: PRIMARY, fontWeight: '600' },
    badge: { position: 'absolute', top: 10, right: 10, backgroundColor: '#FFD700', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
    badgeText: { color: '#000', fontSize: 10, fontWeight: 'bold' }
});
