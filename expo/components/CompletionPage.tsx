import { generateAPIUrl } from '@/utils/api';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { fetch as expoFetch } from 'expo/fetch';
import * as Crypto from 'expo-crypto';
import { useState } from 'react';
import { View, TextInput, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import '@/utils/polyfills';

export default function App() {
    const [input, setInput] = useState('');
    const { messages, error, sendMessage } = useChat({
        transport: new DefaultChatTransport({
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
            api: generateAPIUrl('/api/completion'),
        }),
        onError: (err) => {
            console.error('CompletionPage error:', err);
        },
    });

    if (error) return <Text>{error.message}</Text>;

    return (
        <SafeAreaView style={{ height: '100%' }}>
            <View
                style={{
                    height: '95%',
                    display: 'flex',
                    flexDirection: 'column',
                    paddingHorizontal: 8,
                }}
            >
                <ScrollView style={{ flex: 1 }}>
                    {messages.map(m => (
                        <View key={m.id} style={{ marginVertical: 8 }}>
                            <View>
                                <Text style={{ fontWeight: 700 }}>{m.role}</Text>
                                {m.parts.map((part, i) => {
                                    switch (part.type) {
                                        case 'text':
                                            return <Text key={`${m.id}-${i}`}>{part.text}</Text>;
                                    }
                                })}
                            </View>
                        </View>
                    ))}
                </ScrollView>

                <View style={{ marginTop: 8 }}>
                    <TextInput
                        style={{ backgroundColor: 'white', padding: 8 }}
                        placeholder="Say something..."
                        value={input}
                        onChange={e => setInput(e.nativeEvent.text)}
                        onSubmitEditing={e => {
                            e.preventDefault();
                            sendMessage({ text: input });
                            setInput('');
                        }}
                        autoFocus={true}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}