import { View, Text, StyleSheet, ScrollView, TextInput, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PRIMARY, BACKGROUND_DARK } from '@/constants/Colors';
import { useUser } from '@/context/UserContext';
import { useState } from 'react';

export default function EditProfileScreen() {
    const router = useRouter();
    const { userData, updateUserData } = useUser();

    // Local state for editing
    const [name, setName] = useState(userData.name);
    const [weight, setWeight] = useState(userData.weight.toString());
    const [height, setHeight] = useState(userData.height.toString());

    const handleSave = () => {
        updateUserData({
            name,
            weight: parseFloat(weight),
            height: parseFloat(height),
        });
        router.back();
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </Pressable>
                <Text style={styles.title}>Edit Profile</Text>
                <Pressable onPress={handleSave}>
                    <Text style={styles.saveText}>Save</Text>
                </Pressable>
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.avatarSection}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{userData.name.charAt(0)}</Text>
                        <View style={styles.editBadge}>
                            <Ionicons name="camera" size={16} color="#000" />
                        </View>
                    </View>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Full Name</Text>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

                    <View style={styles.row}>
                        <View style={[styles.inputGroup, { flex: 1 }]}>
                            <Text style={styles.label}>Height (cm)</Text>
                            <TextInput
                                style={styles.input}
                                value={height}
                                onChangeText={setHeight}
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={[styles.inputGroup, { flex: 1 }]}>
                            <Text style={styles.label}>Weight (kg)</Text>
                            <TextInput
                                style={styles.input}
                                value={weight}
                                onChangeText={setWeight}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>

                    <Pressable
                        style={styles.linkButton}
                        onPress={() => router.push('/profile/goals')}
                    >
                        <Text style={styles.linkText}>Want to change your goals?</Text>
                        <Ionicons name="arrow-forward" size={16} color={PRIMARY} />
                    </Pressable>
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
    saveText: {
        color: PRIMARY,
        fontWeight: '700',
        fontSize: 16,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
    },
    avatarSection: {
        alignItems: 'center',
        marginVertical: 32,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(13, 242, 108, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: PRIMARY,
    },
    avatarText: {
        fontSize: 40,
        fontWeight: '700',
        color: PRIMARY,
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: PRIMARY,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: BACKGROUND_DARK,
    },
    form: {
        gap: 20,
    },
    inputGroup: {
        gap: 8,
    },
    row: {
        flexDirection: 'row',
        gap: 16,
    },
    label: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        fontWeight: '600',
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: 16,
        color: '#fff',
        fontSize: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    readOnlyInput: {
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    readOnlyText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 16,
        textTransform: 'capitalize',
    },
    helperText: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.3)',
    },
    linkButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 12,
    },
    linkText: {
        fontSize: 14,
        color: PRIMARY,
        fontWeight: '600',
    }
});
