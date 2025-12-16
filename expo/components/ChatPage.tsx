import { generateAPIUrl } from '@/utils/api';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, UIMessage } from 'ai';
import { fetch as expoFetch } from 'expo/fetch';
import * as Crypto from 'expo-crypto';
import { ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet, Text, View, Image, ScrollView } from 'react-native';

import ChatMessage from '@/components/chat/ChatMessage';
import MessageInput from '@/components/chat/MessageInput';
import MessageSuggestions from '@/components/chat/MessageSuggestions';
import { defaultStyles } from '@/constants/Styles';
import { FlashList } from '@shopify/flash-list';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ScrollView as GHScrollView } from 'react-native-gesture-handler';
import Animated, { FadeIn } from 'react-native-reanimated';
import HeaderDropDown from './HeaderDropDown';

import { useAuth } from '@clerk/clerk-expo';

import { addChat, addMessage, getMessages } from '@/utils/Database';
import { Role } from '@/utils/Interfaces';
import { useSQLiteContext } from 'expo-sqlite';

export function ChatPage() {
    const [height, setHeight] = useState(0);
    const scrollViewRef = useRef<GHScrollView>(null);

    // Auth - get token for API requests
    const { getToken } = useAuth();

    // logic Database
    const db = useSQLiteContext();
    const { id } = useLocalSearchParams<{ id: string }>();
    const [chatId, _setChatId] = useState(id);
    const chatIdRef = useRef(chatId);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);

    // Create transport with auth headers
    const getTokenRef = useRef(getToken);
    useEffect(() => {
        getTokenRef.current = getToken;
    }, [getToken]);

    const transport = useMemo(() => new DefaultChatTransport({
        fetch: async (url, options) => {
            if (options?.method === 'POST' && options.body && typeof options.body === 'string') {
                const hash = await Crypto.digestStringAsync(
                    Crypto.CryptoDigestAlgorithm.SHA256,
                    options.body
                );
                options.headers = {
                    ...options.headers,
                    'x-amz-content-sha256': hash,
                };
            }
            return expoFetch(url as string, options as any);
        },
        credentials: 'include',
        api: generateAPIUrl("/api/chat"),
        headers: async () => {
            const token = await getTokenRef.current();
            return {
                "Authorization": token ? `Bearer ${token}` : '',
                "X-Clerk-Token": token || '',
            };
        },
    }), []);

    // Helper to filter parts for database storage (exclude tool invocations and empty text)
    const filterPartsForDB = (parts: UIMessage['parts']) => {
        return parts.filter((part) => {
            // Only keep text parts
            if (part.type !== 'text') return false;
            // Exclude empty text
            if (!part.text || part.text.trim().length === 0) return false;
            return true;
        });
    };

    const { messages, stop, sendMessage, status, setMessages } = useChat({
        transport: transport,

        onFinish: async ({ message }) => {
            scrollViewRef.current?.scrollToEnd({ animated: true });

            // Save assistant message to database
            const currentChatId = chatIdRef.current;

            if (currentChatId && message) {
                const chatIdNum = parseInt(currentChatId);
                if (isNaN(chatIdNum)) return;

                // Filter out tool invocations and empty parts
                const validParts = filterPartsForDB(message.parts);

                // Only save if there's actual text content
                if (validParts.length === 0) return;

                try {
                    await addMessage(db, chatIdNum, {
                        parts: validParts,
                        role: Role.Assistant,
                    });

                } catch {
                    // Fail silently
                }
            }
        },
        onError: (err) => {
            console.error('Chat error:', err);
        },
    });

    useEffect(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    }, [messages.length]);

    const setChatId = (id: string) => {
        chatIdRef.current = id;
        _setChatId(id);
    }

    // Load existing messages when chat ID is present
    useEffect(() => {
        const loadExistingMessages = async () => {
            if (id && db) {
                setIsLoadingMessages(true);
                try {
                    const dbMessages = await getMessages(db, parseInt(id));
                    // Convert DB messages to UIMessage format - ensure id is always a string
                    const uiMessages: UIMessage[] = dbMessages.map((msg) => ({
                        ...msg,
                        id: msg.id || crypto.randomUUID(),
                    }));
                    setMessages(uiMessages);
                } catch {
                    // Fail silently
                } finally {
                    setIsLoadingMessages(false);
                }
            }
        };
        loadExistingMessages();
    }, [id, db, setMessages]);


    // Main container
    const onLayout = (event: any) => {
        const { height } = event.nativeEvent.layout;
        setHeight(height / 2);
    };


    // logic Input messages
    const onSendMessage = async (text: string) => {
        if (!text.trim()) return;

        // Save message to database
        let currentChatId = chatIdRef.current;


        // Validate if currentChatId is actually a valid number
        const chatIdNum = currentChatId ? parseInt(currentChatId) : NaN;
        const isValidChatId = !isNaN(chatIdNum) && chatIdNum > 0;

        if (!currentChatId || !isValidChatId) {
            // Create new chat if none exists or if chatId is invalid (e.g., "(auth)" from URL)

            const res = await addChat(db, text);
            const chatID = res.lastInsertRowId;

            setChatId(chatID.toString());
            currentChatId = chatID.toString();

            await addMessage(db, chatID, { parts: [{ type: 'text', text: text }], role: Role.User });

        } else {
            // Add message to existing chat
            await addMessage(db, chatIdNum, { parts: [{ type: 'text', text: text }], role: Role.User });
        }
        // Send message to AI AFTER chat and message are saved
        sendMessage({ text });
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            style={{ flex: 1 }}
        >
            <Animated.View
                entering={FadeIn.duration(250)}
                style={[defaultStyles.pageContainer, { flex: 1 }]}
            >
                <Stack.Screen
                    options={{
                        headerTitle: () => (
                            <HeaderDropDown
                                title="Warike Assistant"
                                items={[
                                    { key: 'gemini-2.5-flash', title: 'Gemini 3 Flash', icon: 'bolt' },
                                    { key: 'gemini-2.5-flash', title: 'Gemini 2.5 Flash', icon: 'sparkles' },
                                ]}
                                onSelect={() => {}}
                                selected="gemini"
                            />
                        ),
                    }}
                />
                <ScrollView
                    style={styles.mainContainer}
                    ref={scrollViewRef}
                    onContentSizeChange={() =>
                        scrollViewRef.current?.scrollToEnd({ animated: true })
                    }
                    onLayout={onLayout}
                    keyboardDismissMode="on-drag"
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ flexGrow: 1 }}
                >
                    {isLoadingMessages ? (
                        <View style={[styles.loadingContainer, { marginTop: height / 2 - 50 }]}>
                            <ActivityIndicator size="large" color="#666" />
                            <Text style={styles.loadingText}>Fetching messages...</Text>
                        </View>
                    ) : messages.length === 0 && (
                        <View style={[styles.logoContainer, { marginTop: height / 2 - 100 }]}>
                            <Image source={require('@/assets/images/logo-white.png')} style={styles.image} />
                        </View>
                    )}

                    <FlashList
                        data={messages}
                        renderItem={({ item }) => <ChatMessage message={item} status={status} isLoading={false} />}
                        contentContainerStyle={{ paddingTop: 30, paddingBottom: 20 }}
                        keyboardDismissMode="on-drag"
                        ListFooterComponent={() => {
                            if (messages.length > 0 && status === 'submitted') {
                                return (
                                    <ChatMessage
                                        message={{
                                            id: 'thinking',
                                            role: Role.Assistant,
                                            parts: [{ type: 'text', text: 'Thinking...' }],
                                        }}
                                        isLoading={true}
                                    />

                                );
                            }
                            return null;
                        }}
                    />
                </ScrollView>

                <View>
                    {messages.length === 0 && <MessageSuggestions onSelectSuggestion={onSendMessage} />}
                    <MessageInput
                        onShouldSend={onSendMessage}
                        onShouldStop={stop}
                        status={status}
                    />
                </View>

            </Animated.View>
        </KeyboardAvoidingView>
    );
}
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    logoContainer: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        height: 80,
        backgroundColor: '#fff',
        borderRadius: 50,
    },
    image: {
        width: 80,
        height: 80,
        resizeMode: 'cover',
    },
    loadingContainer: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    loadingText: {
        fontSize: 14,
        color: '#666',
        marginTop: 8,
    },
});

export default ChatPage;