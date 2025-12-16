import Colors from "@/constants/Colors";
import { migrateDbIfNeeded, DATABASE_NAME } from "@/utils/Database";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";

export default function Layout() {
    return (
        <SQLiteProvider databaseName={DATABASE_NAME} onInit={migrateDbIfNeeded}>
            <Stack
                screenOptions={{
                    contentStyle: { backgroundColor: Colors.selected },
                }}>
                <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
                <Stack.Screen
                    name="(modal)/settings"
                    options={{
                        headerTitle: 'Settings On',
                        headerTitleStyle: { color: '#000' },
                        presentation: 'modal',
                        headerShadowVisible: false,
                        headerStyle: { backgroundColor: Colors.selected },
                        sheetAllowedDetents: [0.50],
                        sheetGrabberVisible: true,
                    }}
                />
            </Stack>
        </SQLiteProvider>
    );
}