import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import GlassPanel from '@/components/GlassPanel';
import { PRIMARY, BACKGROUND_DARK } from '@/constants/Colors';

export default function UnitSettings() {
    const router = useRouter();
    const [units, setUnits] = useState({
        energy: 'calories', // calories, kilojoules
        weight: 'kg', // kg, lbs
        distance: 'km', // km, miles
        water: 'ml', // ml, oz
    });

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </Pressable>
                <Text style={styles.title}>Units of Measure</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.content}>
                <GlassPanel style={styles.card}>
                    <View style={styles.row}>
                        <Text style={styles.label}>Energy</Text>
                        <View style={styles.toggle}>
                            <Pressable
                                style={[styles.option, units.energy === 'calories' && styles.activeOption]}
                                onPress={() => setUnits(u => ({ ...u, energy: 'calories' }))}
                            >
                                <Text style={[styles.optionText, units.energy === 'calories' && styles.activeText]}>Cal</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.option, units.energy === 'kilojoules' && styles.activeOption]}
                                onPress={() => setUnits(u => ({ ...u, energy: 'kilojoules' }))}
                            >
                                <Text style={[styles.optionText, units.energy === 'kilojoules' && styles.activeText]}>kJ</Text>
                            </Pressable>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.row}>
                        <Text style={styles.label}>Weight</Text>
                        <View style={styles.toggle}>
                            <Pressable
                                style={[styles.option, units.weight === 'kg' && styles.activeOption]}
                                onPress={() => setUnits(u => ({ ...u, weight: 'kg' }))}
                            >
                                <Text style={[styles.optionText, units.weight === 'kg' && styles.activeText]}>kg</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.option, units.weight === 'lbs' && styles.activeOption]}
                                onPress={() => setUnits(u => ({ ...u, weight: 'lbs' }))}
                            >
                                <Text style={[styles.optionText, units.weight === 'lbs' && styles.activeText]}>lbs</Text>
                            </Pressable>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.row}>
                        <Text style={styles.label}>Distance</Text>
                        <View style={styles.toggle}>
                            <Pressable
                                style={[styles.option, units.distance === 'km' && styles.activeOption]}
                                onPress={() => setUnits(u => ({ ...u, distance: 'km' }))}
                            >
                                <Text style={[styles.optionText, units.distance === 'km' && styles.activeText]}>km</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.option, units.distance === 'miles' && styles.activeOption]}
                                onPress={() => setUnits(u => ({ ...u, distance: 'miles' }))}
                            >
                                <Text style={[styles.optionText, units.distance === 'miles' && styles.activeText]}>mi</Text>
                            </Pressable>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.row}>
                        <Text style={styles.label}>Water</Text>
                        <View style={styles.toggle}>
                            <Pressable
                                style={[styles.option, units.water === 'ml' && styles.activeOption]}
                                onPress={() => setUnits(u => ({ ...u, water: 'ml' }))}
                            >
                                <Text style={[styles.optionText, units.water === 'ml' && styles.activeText]}>ml</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.option, units.water === 'oz' && styles.activeOption]}
                                onPress={() => setUnits(u => ({ ...u, water: 'oz' }))}
                            >
                                <Text style={[styles.optionText, units.water === 'oz' && styles.activeText]}>fl oz</Text>
                            </Pressable>
                        </View>
                    </View>
                </GlassPanel>
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
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 60,
        paddingHorizontal: 16,
        paddingBottom: 24,
    },
    backButton: {
        padding: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
    },
    content: {
        padding: 20,
    },
    card: {
        padding: 0,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        height: 64,
    },
    label: {
        fontSize: 16,
        color: '#fff',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        marginLeft: 16,
    },
    toggle: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 8,
        padding: 2,
    },
    option: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        minWidth: 48,
        alignItems: 'center',
    },
    activeOption: {
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    optionText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 13,
        fontWeight: '600',
    },
    activeText: {
        color: PRIMARY,
        fontWeight: '700',
    },
});
