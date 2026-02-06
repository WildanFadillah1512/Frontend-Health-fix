import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PRIMARY, BACKGROUND_DARK } from '@/constants/Colors';
import { useUser } from '@/context/UserContext';
import { useState } from 'react';

export default function WaterLogScreen() {
    const router = useRouter();
    const { addWater, userData } = useUser();
    const [added, setAdded] = useState(0);

    const handleAdd = (amount: number) => {
        addWater(amount);
        setAdded(amount);
        setTimeout(() => {
            // router.back(); // keep them here to add more?
        }, 500);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </Pressable>
                <Text style={styles.title}>Water Tracker</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.content}>
                <View style={styles.circle}>
                    <Ionicons name="water" size={80} color="#06b6d4" />
                    <Text style={styles.total}>{userData.dailyStats.water} ml</Text>
                    <Text style={styles.goal}>Goal: 2500 ml</Text>
                </View>

                <View style={styles.grid}>
                    <Pressable style={styles.cupButton} onPress={() => handleAdd(250)}>
                        <Ionicons name="pint" size={32} color="#fff" />
                        <Text style={styles.cupText}>+250 ml</Text>
                    </Pressable>
                    <Pressable style={styles.cupButton} onPress={() => handleAdd(500)}>
                        <Ionicons name="water" size={32} color="#fff" />
                        <Text style={styles.cupText}>+500 ml</Text>
                    </Pressable>
                </View>
            </View>
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
        flex: 1,
        alignItems: 'center',
        paddingTop: 40,
    },
    circle: {
        width: 240,
        height: 240,
        borderRadius: 120,
        borderWidth: 8,
        borderColor: 'rgba(6, 182, 212, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 60,
    },
    total: {
        fontSize: 40,
        fontWeight: '700',
        color: '#06b6d4',
        marginTop: 16,
    },
    goal: {
        color: 'rgba(255,255,255,0.5)',
        marginTop: 8,
    },
    grid: {
        flexDirection: 'row',
        gap: 24,
    },
    cupButton: {
        width: 120,
        height: 120,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cupText: {
        color: '#fff',
        fontWeight: '600',
        marginTop: 12,
    },
});
