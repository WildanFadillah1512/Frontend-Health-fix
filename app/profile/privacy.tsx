import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PRIMARY, BACKGROUND_DARK } from '@/constants/Colors';

export default function PrivacyScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </Pressable>
                <Text style={styles.title}>Privacy Policy</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.content}>
                <Text style={styles.sectionTitle}>1. Data Collection</Text>
                <Text style={styles.text}>
                    We collect personal information that you provide to us such as name, height, weight, and fitness goals.
                    We also track your workout progress, meals, and other health metrics to provide personalized recommendations.
                </Text>

                <Text style={styles.sectionTitle}>2. Use of Information</Text>
                <Text style={styles.text}>
                    Your data is used solely to improve your fitness journey. We analyze your stats to adjust workout difficulty
                    and meal plans. We do not sell your personal data to third parties.
                </Text>

                <Text style={styles.sectionTitle}>3. Data Security</Text>
                <Text style={styles.text}>
                    We implement industry-standard security measures to protect your data. However, no method of transmission
                    over the internet is 100% secure.
                </Text>

                <Text style={styles.sectionTitle}>4. Contact Us</Text>
                <Text style={styles.text}>
                    If you have any questions about this Privacy Policy, please contact us at privacy@expohealth.com.
                </Text>

                <View style={{ height: 40 }} />
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
        padding: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: PRIMARY,
        marginBottom: 12,
        marginTop: 12,
    },
    text: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.7)',
        lineHeight: 24,
        marginBottom: 16,
    }
});
