import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { useState, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import GlassPanel from '@/components/GlassPanel';
import { PRIMARY, BACKGROUND_DARK } from '@/constants/Colors';
import client from '@/api/client';
import { DatabaseService } from '@/services/DatabaseService';

type Message = {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
};

export default function AICoachScreen() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');

    const suggestions = [
        { icon: 'flash', text: 'Suggest today\'s workout' },
        { icon: 'restaurant', text: 'Meal plan ideas' },
        { icon: 'fitness', text: 'Form correction tips' },
        { icon: 'trending-up', text: 'Show my progress' },
    ];

    const [isLoading, setIsLoading] = useState(false);

    // Load history on mount
    useState(() => {
        try {
            const history = DatabaseService.getChatMessages();
            if (history.length > 0) {
                setMessages(history);
            } else {
                // Default welcome if no history
                const welcome: Message = {
                    id: '1',
                    text: "Hello! I'm your AI fitness coach. I'm here to help you reach your goals. What would you like to work on today?",
                    sender: 'ai',
                    timestamp: new Date(),
                };
                setMessages([welcome]);
                DatabaseService.saveChatMessage({ ...welcome, timestamp: welcome.timestamp.toISOString() });
            }
        } catch (e) {
            console.error("Failed to load chat history:", e);
        }

        // Sync unsynced messages
        const syncMessages = async () => {
            try {
                const unsynced = DatabaseService.getUnsyncedChatMessages();
                if (unsynced.length > 0) {
                    const response = await client.post('/ai/chat/sync', { messages: unsynced });
                    if (response.data.synced > 0) {
                        const ids = unsynced.map(m => m.id);
                        DatabaseService.markChatMessagesAsSynced(ids);
                        console.log(`Synced ${response.data.synced} chat messages`);
                    }
                }
            } catch (e) {
                console.error("Background sync failed:", e);
            }
        };
        syncMessages();
    });

    const sendMessage = async () => {
        if (!inputText.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputText,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        DatabaseService.saveChatMessage({ ...userMessage, timestamp: userMessage.timestamp.toISOString(), synced: 0 }); // Initially unsynced

        setInputText('');
        setIsLoading(true);

        try {
            // Updated to use the new backend route
            const response = await client.post('/ai/chat', { message: userMessage.text });

            // If success, mark user message as synced
            DatabaseService.saveChatMessage({ ...userMessage, timestamp: userMessage.timestamp.toISOString(), synced: 1 });

            const aiText = response.data.text;

            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                text: aiText,
                sender: 'ai',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, aiResponse]);
            // AI response comes from server, so it is synced by definition (or will be if we fetch history, but here we save locally)
            // Wait, if we save locally as synced=1, it won't be pushed. But the server already HAS it (it generated it).
            // So synced: 1 is correct.
            DatabaseService.saveChatMessage({ ...aiResponse, timestamp: aiResponse.timestamp.toISOString(), synced: 1 });

        } catch (error) {
            console.error('AI Chat Error:', error);
            const errorResponse: Message = {
                id: (Date.now() + 1).toString(),
                text: "Sorry, I'm having trouble connecting to the server. Please try again.",
                sender: 'ai',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorResponse]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <View style={styles.aiAvatar}>
                        <Ionicons name="flash" size={24} color={PRIMARY} />
                    </View>
                    <View>
                        <Text style={styles.headerTitle}>AI Coach</Text>
                        <View style={styles.statusRow}>
                            <View style={styles.statusDot} />
                            <Text style={styles.statusText}>Online</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Messages */}
            <ScrollView
                style={styles.messagesContainer}
                contentContainerStyle={styles.messagesContent}
                showsVerticalScrollIndicator={false}
            >
                {messages.map((message) => (
                    <View
                        key={message.id}
                        style={[
                            styles.messageBubble,
                            message.sender === 'user' ? styles.userBubble : styles.aiBubble,
                        ]}
                    >
                        {message.sender === 'ai' && (
                            <View style={styles.aiAvatarSmall}>
                                <Ionicons name="flash" size={16} color={PRIMARY} />
                            </View>
                        )}
                        <View style={[
                            styles.bubbleContent,
                            message.sender === 'user' ? styles.userBubbleContent : styles.aiBubbleContent,
                        ]}>
                            <Text style={[
                                styles.messageText,
                                message.sender === 'user' && styles.userMessageText,
                            ]}>
                                {message.text}
                            </Text>
                        </View>
                    </View>
                ))}

                {/* Quick Suggestions (only if no user messages yet) */}
                {messages.length === 1 && (
                    <View style={styles.suggestionsContainer}>
                        <Text style={styles.suggestionsTitle}>Quick actions:</Text>
                        <View style={styles.suggestionsGrid}>
                            {suggestions.map((suggestion, index) => (
                                <Pressable key={index} style={styles.suggestionCard}>
                                    <Ionicons name={suggestion.icon as any} size={20} color={PRIMARY} />
                                    <Text style={styles.suggestionText}>{suggestion.text}</Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                )}

                <View style={{ height: 20 }} />
            </ScrollView>

            {/* Input */}
            <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        placeholder="Ask me anything..."
                        placeholderTextColor="rgba(255,255,255,0.3)"
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                        maxLength={500}
                    />
                    <Pressable
                        style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
                        onPress={sendMessage}
                        disabled={!inputText.trim()}
                    >
                        <Ionicons name="send" size={20} color={inputText.trim() ? '#000' : 'rgba(255,255,255,0.3)'} />
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
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    aiAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(13, 242, 108, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(13, 242, 108, 0.3)',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 2,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: PRIMARY,
    },
    statusText: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.6)',
    },
    messagesContainer: {
        flex: 1,
    },
    messagesContent: {
        padding: 20,
    },
    messageBubble: {
        flexDirection: 'row',
        marginBottom: 16,
        gap: 8,
    },
    userBubble: {
        justifyContent: 'flex-end',
    },
    aiBubble: {
        justifyContent: 'flex-start',
    },
    aiAvatarSmall: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(13, 242, 108, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bubbleContent: {
        maxWidth: '75%',
        padding: 16,
        borderRadius: 16,
    },
    userBubbleContent: {
        backgroundColor: PRIMARY,
        borderBottomRightRadius: 4,
    },
    aiBubbleContent: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderBottomLeftRadius: 4,
    },
    messageText: {
        fontSize: 15,
        lineHeight: 22,
        color: 'rgba(255, 255, 255, 0.9)',
    },
    userMessageText: {
        color: '#000',
    },
    suggestionsContainer: {
        marginTop: 24,
    },
    suggestionsTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.5)',
        marginBottom: 12,
    },
    suggestionsGrid: {
        gap: 12,
    },
    suggestionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        padding: 16,
        borderRadius: 12,
    },
    suggestionText: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    inputContainer: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.05)',
        backgroundColor: BACKGROUND_DARK,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: '#FFFFFF',
        maxHeight: 100,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: PRIMARY,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
});
