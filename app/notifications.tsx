import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PRIMARY, BACKGROUND_DARK } from '@/constants/Colors';
import { useUser } from '@/context/UserContext';



export default function NotificationsScreen() {
    const router = useRouter();
    const { userData } = useUser();
    const notifications = userData.notifications || [];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </Pressable>
                <Text style={styles.title}>Notifications</Text>
                <View style={{ width: 40 }} />
            </View>

            {notifications.length > 0 ? (
                <FlatList
                    data={notifications}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }) => (
                        <View style={[styles.card, !item.read && styles.unread]}>
                            <View style={[styles.iconContainer, { backgroundColor: PRIMARY + '20' }]}>
                                <Ionicons name={item.type === 'reminder' ? 'alarm' : 'information-circle'} size={24} color={PRIMARY} />
                            </View>
                            <View style={styles.content}>
                                <View style={styles.row}>
                                    <Text style={styles.itemTitle}>{item.title}</Text>
                                    <Text style={styles.time}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                                </View>
                                <Text style={styles.message}>{item.message}</Text>
                            </View>
                            {!item.read && <View style={styles.dot} />}
                        </View>
                    )}
                />
            ) : (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Ionicons name="notifications-off-outline" size={64} color="rgba(255,255,255,0.2)" />
                    <Text style={{ color: 'rgba(255,255,255,0.5)', marginTop: 16 }}>No notifications yet</Text>
                </View>
            )}
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
    list: {
        padding: 20,
        gap: 12,
    },
    card: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        alignItems: 'center',
        gap: 16,
    },
    unread: {
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderLeftWidth: 3,
        borderLeftColor: PRIMARY,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
    time: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.4)',
    },
    message: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.6)',
        lineHeight: 20,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: PRIMARY,
    },
});
