import { View, Text, StyleSheet, Pressable, Image, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { PRIMARY } from '@/constants/Colors';
import client from '@/api/client';

interface PhotoUploadProps {
    onUploadComplete: (url: string) => void;
    currentImage?: string;
    endpoint: string; // '/upload/progress-photo' or '/upload/meal-image'
    size?: number;
}

export default function PhotoUpload({ onUploadComplete, currentImage, endpoint, size = 100 }: PhotoUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [image, setImage] = useState<string | null>(currentImage || null);

    const pickImage = async () => {
        // Request permissions
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert("Permission Required", "You need to grant camera roll permissions to upload photos.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            handleUpload(result.assets[0]);
        }
    };

    const handleUpload = async (asset: ImagePicker.ImagePickerAsset) => {
        setUploading(true);
        try {
            const formData = new FormData();

            // Append file
            // @ts-ignore: React Native FormData
            formData.append('photo', {
                uri: asset.uri,
                name: 'upload.jpg',
                type: 'image/jpeg',
            });

            const response = await client.post(endpoint, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                const url = response.data.url; // or response.data.photoUrl depending on backend
                setImage(url);
                onUploadComplete(url);
                Alert.alert("Success", "Photo uploaded successfully!");
            }
        } catch (error) {
            console.error('Upload failed:', error);
            Alert.alert("Error", "Failed to upload photo. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Pressable
                onPress={pickImage}
                style={[styles.imageContainer, { width: size, height: size, borderRadius: size / 2 }]}
            >
                {image ? (
                    <Image source={{ uri: image }} style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]} />
                ) : (
                    <View style={[styles.placeholder, { width: size, height: size, borderRadius: size / 2 }]}>
                        <Ionicons name="camera" size={size * 0.4} color="rgba(255,255,255,0.5)" />
                    </View>
                )}

                <View style={styles.editBadge}>
                    <Ionicons name="pencil" size={12} color="#000" />
                </View>

                {uploading && (
                    <View style={[styles.loadingOverlay, { borderRadius: size / 2 }]}>
                        <ActivityIndicator color={PRIMARY} />
                    </View>
                )}
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageContainer: {
        position: 'relative',
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    image: {
        resizeMode: 'cover',
    },
    placeholder: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: PRIMARY,
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#000',
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
