import HeaderDropDown from '@/components/HeaderDropDown';
import { Stack } from 'expo-router';

export const ChatHeader = () => {
    return (
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
    );
};
