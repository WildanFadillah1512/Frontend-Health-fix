import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PRIMARY, BACKGROUND_DARK } from '@/constants/Colors';
import { useState } from 'react';

const FAQS = [
    { q: 'How do I change my goal?', a: 'You can change your goal by resetting your plan in the Edit Profile section.' },
    { q: 'How is calorie burn calculated?', a: 'We use MET values based on the workout type and your body weight.' },
    { q: 'Can I use this offline?', a: 'Currently, the app requires an internet connection for most features.' },
    { q: 'How do I delete my data?', a: 'Go to Settings > Account > Delete Account.' },
];

export default function HelpScreen() {
    const router = useRouter();
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </Pressable>
                <Text style={styles.title}>Help & Support</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.scroll} contentContainerStyle={styles.contentContainer}>
                <Text style={styles.subtitle}>Frequently Asked Questions</Text>

                {FAQS.map((faq, index) => (
                    <Pressable
                        key={index}
                        style={styles.faqItem}
                        onPress={() => setOpenIndex(openIndex === index ? null : index)}
                    >
                        <View style={styles.questionRow}>
                            <Text style={styles.question}>{faq.q}</Text>
                            <Ionicons
                                name={openIndex === index ? "chevron-up" : "chevron-down"}
                                size={20}
                                color="rgba(255,255,255,0.5)"
                            />
                        </View>
                        {openIndex === index && (
                            <Text style={styles.answer}>{faq.a}</Text>
                        )}
                    </Pressable>
                ))}

                <Text style={[styles.subtitle, { marginTop: 32 }]}>Contact Us</Text>
                <View style={styles.form}>
                    <TextInput
                        style={styles.input}
                        placeholder="Subject"
                        placeholderTextColor="rgba(255,255,255,0.3)"
                    />
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Describe your issue..."
                        placeholderTextColor="rgba(255,255,255,0.3)"
                        multiline
                        textAlignVertical="top"
                    />
                    <Pressable style={styles.submitButton}>
                        <Text style={styles.submitText}>Send Message</Text>
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
    contentContainer: {
        padding: 24,
        paddingBottom: 40,
    },
    scroll: {
        flex: 1,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '700',
        color: PRIMARY,
        marginBottom: 16,
    },
    faqItem: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    questionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    question: {
        fontSize: 15,
        fontWeight: '600',
        color: '#fff',
        flex: 1,
        marginRight: 12,
    },
    answer: {
        marginTop: 12,
        fontSize: 14,
        color: 'rgba(255,255,255,0.6)',
        lineHeight: 20,
    },
    form: {
        gap: 16,
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: 16,
        color: '#fff',
        fontSize: 16,
    },
    textArea: {
        height: 120,
    },
    submitButton: {
        backgroundColor: PRIMARY,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    submitText: {
        color: '#000',
        fontWeight: '700',
        fontSize: 16,
    }
});
