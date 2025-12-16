
import Colors from "@/constants/Colors";
import { deleteChat, getChats, renameChat } from "@/utils/Database";
import { Chat } from "@/utils/Interfaces";
import { Ionicons } from "@expo/vector-icons";
import { DrawerContentScrollView, DrawerItem, DrawerItemList, useDrawerStatus } from "@react-navigation/drawer";
import { useGlobalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, Keyboard, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ContextMenu from 'zeego/context-menu';
import { ProfileDrawer } from "./ProfileDrawer";

export const CustomDrawerContent = (props: any) => {
    const { top } = useSafeAreaInsets();
    const db = useSQLiteContext();

    const isDrawerOpen = useDrawerStatus() === 'open';
    const [history, setHistory] = useState<Chat[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const searchInputRef = useRef<TextInput>(null);
    const router = useRouter();
    const { id } = useGlobalSearchParams();

    // Filter chats based on search query
    const filteredHistory = useMemo(() => {
        if (!searchQuery.trim()) {
            return history;
        }
        const query = searchQuery.toLowerCase().trim();
        return history.filter((chat) =>
            chat.title.toLowerCase().includes(query)
        );
    }, [history, searchQuery]);

    const loadChats = useCallback(async () => {
        // Load chats from SQLite
        const result = (await getChats(db)) as Chat[];
        setHistory(result);
    }, [db]);

    useEffect(() => {
        if (isDrawerOpen) {
            loadChats();
        } else {
            // Reset search when drawer closes
            setSearchQuery('');
            Keyboard.dismiss();
        }
    }, [isDrawerOpen, loadChats]);

    const clearSearch = () => {
        setSearchQuery('');
        searchInputRef.current?.focus();
    };

    const onDeleteChat = (chatId: number) => {
        Alert.alert('Delete Chat', 'Are you sure you want to delete this chat?', [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'Delete',
                onPress: async () => {
                    // Delete the chat
                    await deleteChat(db, chatId);
                    if (id && parseInt(id as string) === chatId) {
                        router.replace('/(auth)/(drawer)/(chat)/new');
                    }
                    loadChats();
                },
            },
        ]);
    };

    const onRenameChat = (chatId: number) => {
        Alert.prompt('Rename Chat', 'Enter a new name for the chat', async (newName) => {
            if (newName) {
                // Rename the chat
                await renameChat(db, chatId, newName);
                loadChats();
            }
        });
    };

    return (
        <View style={{ flex: 1, paddingTop: top, backgroundColor: '#fff' }}>
            <View style={{ backgroundColor: '#fff', paddingBottom: 10 }}>
                <View style={styles.searchSection}>
                    <Ionicons style={styles.searchIcon} name="search" size={20} color={Colors.greyLight} />
                    <TextInput
                        ref={searchInputRef}
                        style={styles.input}
                        placeholder="Search conversations..."
                        placeholderTextColor={Colors.greyLight}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        underlineColorAndroid="transparent"
                        returnKeyType="search"
                        autoCorrect={false}
                    />
                    {searchQuery.length > 0 && (
                        <Pressable
                            onPress={clearSearch}
                            style={({ pressed }) => [styles.clearButton, { opacity: pressed ? 0.5 : 1 }]}
                        >
                            <Ionicons name="close-circle" size={18} color={Colors.greyLight} />
                        </Pressable>
                    )}
                </View>
            </View>

            <DrawerContentScrollView
                {...props}
                keyboardShouldPersistTaps="handled"
                style={{ backgroundColor: '#fff' }}
                contentContainerStyle={{ backgroundColor: '#fff', paddingTop: 0 }}>
                {!searchQuery.trim() && <DrawerItemList {...props} />}

                {filteredHistory.length > 0 ? (
                    filteredHistory.map((chat) => (
                        <ContextMenu.Root key={chat.id}>
                            <ContextMenu.Trigger>
                                <DrawerItem
                                    label={chat.title}
                                    onPress={() => {
                                        setSearchQuery('');
                                        router.push(`/(auth)/(drawer)/(chat)/${chat.id}`);
                                    }}
                                    inactiveTintColor="#000"
                                />
                            </ContextMenu.Trigger>
                            <ContextMenu.Content>
                                <ContextMenu.Preview>
                                    {() => (
                                        <View style={{ padding: 16, height: 200, backgroundColor: '#fff' }}>
                                            <Text>{chat.title}</Text>
                                        </View>
                                    )}
                                </ContextMenu.Preview>

                                <ContextMenu.Item key={'rename'} onSelect={() => onRenameChat(chat.id)}>
                                    <ContextMenu.ItemTitle>Rename</ContextMenu.ItemTitle>
                                    <ContextMenu.ItemIcon
                                        ios={{
                                            name: 'pencil',
                                            pointSize: 18,
                                        }}
                                    />
                                </ContextMenu.Item>
                                <ContextMenu.Item key={'delete'} onSelect={() => onDeleteChat(chat.id)} destructive>
                                    <ContextMenu.ItemTitle>Delete</ContextMenu.ItemTitle>
                                    <ContextMenu.ItemIcon
                                        ios={{
                                            name: 'trash',
                                            pointSize: 18,
                                        }}
                                    />
                                </ContextMenu.Item>
                            </ContextMenu.Content>
                        </ContextMenu.Root>
                    ))
                ) : searchQuery.trim() ? (
                    <View style={styles.noResultsContainer}>
                        <Ionicons name="chatbubble-ellipses-outline" size={40} color={Colors.greyLight} />
                        <Text style={styles.noResultsText}>No conversations found</Text>
                        <Text style={styles.noResultsSubtext}>Try a different search term</Text>
                    </View>
                ) : null}
            </DrawerContentScrollView>
            <ProfileDrawer />
        </View>
    );
};

const styles = StyleSheet.create({
    searchSection: {
        marginHorizontal: 16,
        borderRadius: 10,
        height: 34,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.input,
    },
    searchIcon: {
        padding: 6,
    },
    input: {
        flex: 1,
        paddingTop: 8,
        paddingRight: 8,
        paddingBottom: 8,
        paddingLeft: 0,
        alignItems: 'center',
        color: '#424242',
    },
    clearButton: {
        padding: 6,
    },
    noResultsContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    noResultsText: {
        marginTop: 12,
        fontSize: 16,
        fontWeight: '600',
        color: Colors.grey,
    },
    noResultsSubtext: {
        marginTop: 4,
        fontSize: 14,
        color: Colors.greyLight,
    },
});

