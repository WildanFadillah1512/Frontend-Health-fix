
import { View, Text, StyleSheet, ScrollView, Pressable, Image, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { PRIMARY, BACKGROUND_DARK, SURFACE_DARK } from '@/constants/Colors';
import client from '@/api/client';
import GlassPanel from '@/components/GlassPanel';

export default function ProgramDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [program, setProgram] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);

    useEffect(() => {
        const fetchProgram = async () => {
            try {
                const res = await client.get(`/programs/${id}`);
                setProgram(res.data);
            } catch (e) {
                console.error(e);
                Alert.alert("Error", "Failed to load program details");
            } finally {
                setLoading(false);
            }
        };
        fetchProgram();
    }, [id]);

    const handleEnroll = async () => {
        setEnrolling(true);
        try {
            await client.post('/programs/enroll', { programId: id });
            Alert.alert("Success", "You have successfully enrolled in this program!");
            router.replace('/(tabs)/workout');
        } catch (e: any) {
            console.error(e);
            const msg = e.response?.data?.error || "Failed to enroll";
            Alert.alert("Enrollment Failed", msg);
        } finally {
            setEnrolling(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={PRIMARY} />
            </View>
        );
    }

    if (!program) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: 'white' }}>Program not found</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Image source={{ uri: program.thumbnailUrl || 'https://via.placeholder.com/400x200' }} style={styles.heroImage} />
            <Pressable style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="white" />
            </Pressable>

            <View style={styles.content}>
                <Text style={styles.title}>{program.title}</Text>

                <View style={styles.metaRow}>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{program.difficulty}</Text>
                    </View>
                    <Text style={styles.metaText}>{program.duration} Weeks</Text>
                    <Text style={styles.metaText}>{program.category}</Text>
                </View>

                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.description}>{program.description}</Text>

                <Text style={styles.sectionTitle}>Schedule</Text>
                <View style={styles.schedulePreview}>
                    <Text style={styles.scheduleText}>
                        This program includes {program.workouts?.length || 0} workouts spread across {program.duration} weeks.
                    </Text>
                </View>

                <View style={{ height: 100 }} />
            </View>

            <View style={styles.footer}>
                <Pressable
                    style={[styles.enrollButton, enrolling && { opacity: 0.7 }]}
                    onPress={handleEnroll}
                    disabled={enrolling}
                >
                    {enrolling ? (
                        <ActivityIndicator color="black" />
                    ) : (
                        <Text style={styles.enrollButtonText}>Enroll Now</Text>
                    )}
                </Pressable>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BACKGROUND_DARK,
    },
    heroImage: {
        width: '100%',
        height: 250,
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
    },
    content: {
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        gap: 15,
    },
    badge: {
        backgroundColor: PRIMARY,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
    },
    badgeText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 12,
    },
    metaText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginTop: 20,
        marginBottom: 10,
    },
    description: {
        color: 'rgba(255,255,255,0.8)',
        lineHeight: 22,
    },
    schedulePreview: {
        backgroundColor: SURFACE_DARK,
        padding: 15,
        borderRadius: 10,
    },
    scheduleText: {
        color: 'rgba(255,255,255,0.7)',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        backgroundColor: 'rgba(0,0,0,0.8)',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
    },
    enrollButton: {
        backgroundColor: PRIMARY,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    enrollButtonText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 16,
    }
});
