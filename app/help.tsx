import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import GlassPanel from '@/components/GlassPanel';
import { PRIMARY, BACKGROUND_DARK } from '@/constants/Colors';

export default function HelpScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const faqCategories = [
        {
            title: 'Getting Started',
            icon: 'rocket-outline',
            questions: [
                { q: 'How do I set up my profile?', a: 'Go to Profile > Edit Profile to update your information.' },
                { q: 'How do I log my first workout?', a: 'Tap the Workout tab, select a program, and hit Start.' },
            ],
        },
        {
            title: 'Workouts',
            icon: 'barbell-outline',
            questions: [
                { q: 'How do I create custom workouts?', a: 'Coming soon in the next update!' },
                { q: 'Can I track outdoor runs?', a: 'Yes, use the Cardio tracking feature.' },
            ],
        },
        {
            title: 'Nutrition',
            icon: 'restaurant-outline',
            questions: [
                { q: 'How do I log meals?', a: 'Go to Nutrition > Add Meal and search for foods.' },
                { q: 'Can I scan barcodes?', a: 'Barcode scanning coming soon!' },
            ],
        },
    ];

    const supportOptions = [
        { title: 'Contact Support', icon: 'mail-outline', subtitle: 'Get help from our team' },
        { title: 'Community Forum', icon: 'people-outline', subtitle: 'Connect with other users' },
        { title: 'Report a Bug', icon: 'bug-outline', subtitle: 'Help us improve' },
        { title: 'Feature Request', icon: 'bulb-outline', subtitle: 'Share your ideas' },
    ];

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </Pressable>
                <Text style={styles.headerTitle}>Help & Support</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                {/* Search */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="rgba(255,255,255,0.5)" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search for help..."
                        placeholderTextColor="rgba(255,255,255,0.3)"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* Quick Actions */}
                <View style={styles.quickActions}>
                    {supportOptions.map((option, index) => (
                        <Pressable key={index} style={styles.actionCard}>
                            <View style={styles.actionIcon}>
                                <Ionicons name={option.icon as any} size={24} color={PRIMARY} />
                            </View>
                            <Text style={styles.actionTitle}>{option.title}</Text>
                            <Text style={styles.actionSubtitle}>{option.subtitle}</Text>
                        </Pressable>
                    ))}
                </View>

                {/* FAQ */}
                <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>

                {faqCategories.map((category, catIndex) => (
                    <View key={catIndex} style={styles.faqSection}>
                        <View style={styles.faqHeader}>
                            <View style={styles.faqIcon}>
                                <Ionicons name={category.icon as any} size={20} color={PRIMARY} />
                            </View>
                            <Text style={styles.faqCategoryTitle}>{category.title}</Text>
                        </View>

                        {category.questions.map((item, qIndex) => (
                            <GlassPanel key={qIndex} style={styles.faqCard}>
                                <Pressable style={styles.faqQuestion}>
                                    <Text style={styles.faqQuestionText}>{item.q}</Text>
                                    <Ionicons name="chevron-down" size={20} color="rgba(255,255,255,0.3)" />
                                </Pressable>
                            </GlassPanel>
                        ))}
                    </View>
                ))}

                {/* App Info */}
                <GlassPanel style={styles.infoCard}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>App Version</Text>
                        <Text style={styles.infoValue}>1.0.0</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Terms of Service</Text>
                        <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.3)" />
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Privacy Policy</Text>
                        <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.3)" />
                    </View>
                </GlassPanel>

                {/* Contact */}
                <View style={styles.contactSection}>
                    <Text style={styles.contactTitle}>Still need help?</Text>
                    <Text style={styles.contactDesc}>Our support team is here 24/7</Text>
                    <Pressable style={styles.contactButton}>
                        <Ionicons name="chatbubble-ellipses" size={20} color="#000" />
                        <Text style={styles.contactButtonText}>Start Live Chat</Text>
                    </Pressable>
                </View>

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
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 48,
        paddingBottom: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 9999,
        paddingHorizontal: 20,
        height: 48,
        marginBottom: 24,
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#FFFFFF',
    },
    quickActions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 32,
    },
    actionCard: {
        width: '48%',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        gap: 8,
    },
    actionIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(13, 242, 108, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    actionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    actionSubtitle: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.5)',
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 16,
    },
    faqSection: {
        marginBottom: 24,
    },
    faqHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
    },
    faqIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(13, 242, 108, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    faqCategoryTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    faqCard: {
        marginBottom: 8,
        padding: 16,
    },
    faqQuestion: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    faqQuestionText: {
        flex: 1,
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
    },
    infoCard: {
        padding: 16,
        marginBottom: 24,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    infoLabel: {
        fontSize: 15,
        color: '#FFFFFF',
    },
    infoValue: {
        fontSize: 15,
        color: 'rgba(255, 255, 255, 0.5)',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    contactSection: {
        alignItems: 'center',
        paddingVertical: 24,
    },
    contactTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    contactDesc: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.6)',
        marginBottom: 20,
    },
    contactButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: PRIMARY,
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 9999,
    },
    contactButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
    },
});
