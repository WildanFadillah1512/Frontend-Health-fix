import { View, Text, StyleSheet, ScrollView, Pressable, Image, Dimensions, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PRIMARY, BACKGROUND_DARK, SURFACE_DARK } from '@/constants/Colors';
import { useUser } from '@/context/UserContext';
import GlassPanel from '@/components/GlassPanel';
import PhotoUpload from '@/components/PhotoUpload';
import { useEffect, useState } from 'react';
import client from '@/api/client';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function ProgressPhotosScreen() {
    const router = useRouter();
    const { userData } = useUser();
    const [photos, setPhotos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPhotos = async () => {
        try {
            // Need endpoint to fetch user's progress photos
            // For now assuming we can filter or have an endpoint. 
            // If backend doesn't have list endpoint for progress photos, we might need to add it or use generic /upload/list (if created)
            // Let's assume we can get from userData if populated OR fetch specific endpoint
            // BUT backend 'uploadRoutes.ts' didn't show list endpoint. I should add GET /progress-photos to backend or mock it for now.
            // Let's assume I need to ADD GET /api/upload/progress-photos to backend first?
            // Wait, audit said "Progress photos table exists". So I should add fetching to backend userController/uploadRoutes.

            // Temporary mock or simple empty state until backend endpoint is confirmed/added.
            // Actually I should add backend endpoint for GET /progress-photos.
            setPhotos([]); // Placeholder
        } catch (error) {
            console.error('Fetch photos error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPhotos();
    }, []);

    const handleUploadSuccess = (url: string) => {
        // Refresh photos
        fetchPhotos();
        Alert.alert("Success", "Progress photo uploaded!");
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </Pressable>
                <Text style={styles.title}>Progress Photos</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.content}>
                <GlassPanel style={styles.uploadCard}>
                    <Text style={styles.uploadTitle}>Add New Photo</Text>
                    <PhotoUpload
                        endpoint="/upload/progress-photo"
                        onUploadComplete={handleUploadSuccess}
                        size={100}
                    />
                </GlassPanel>

                <Text style={styles.sectionTitle}>Gallery</Text>
                <View style={styles.grid}>
                    {photos.length > 0 ? photos.map((photo, index) => (
                        <Pressable key={index} style={styles.photoCard}>
                            <Image source={{ uri: photo.url }} style={styles.photo} />
                            <Text style={styles.photoDate}>{new Date(photo.createdAt).toLocaleDateString()}</Text>
                        </Pressable>
                    )) : (
                        <Text style={styles.emptyText}>No progress photos yet. Start tracking your transformation!</Text>
                    )}
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
        padding: 20,
    },
    uploadCard: {
        alignItems: 'center',
        padding: 24,
        marginBottom: 32,
    },
    uploadTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 16,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    photoCard: {
        width: (SCREEN_WIDTH - 52) / 2,
        marginBottom: 12,
        backgroundColor: SURFACE_DARK,
        borderRadius: 12,
        overflow: 'hidden',
    },
    photo: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    photoDate: {
        padding: 8,
        fontSize: 12,
        color: 'rgba(255,255,255,0.6)',
        textAlign: 'center',
    },
    emptyText: {
        color: 'rgba(255,255,255,0.4)',
        textAlign: 'center',
        marginTop: 20,
        width: '100%',
    }
});
