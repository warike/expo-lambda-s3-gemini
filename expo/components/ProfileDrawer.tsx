import Colors from "@/constants/Colors";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const ProfileDrawer = () => {
    const { bottom } = useSafeAreaInsets();
    const { user } = useUser();

    // Get user display information
    const userName = user?.fullName || user?.firstName || user?.emailAddresses[0]?.emailAddress || 'User';
    const avatarUrl = user?.imageUrl || 'https://galaxies.dev/img/meerkat_2.jpg';

    return (
        <View
            style={{
                padding: 16,
                paddingBottom: 10 + bottom,
                backgroundColor: Colors.light,
            }}>
            <Link href="/(auth)/(modal)/settings" asChild>
                <TouchableOpacity style={styles.footer}>
                    <Image
                        source={{ uri: avatarUrl }}
                        style={styles.avatar}
                    />
                    <Text style={styles.userName}>{userName}</Text>
                    <Ionicons name="ellipsis-horizontal" size={24} color={Colors.greyLight} />
                </TouchableOpacity>
            </Link>
        </View>
    );
};

const styles = StyleSheet.create({
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 10,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
    },
});
