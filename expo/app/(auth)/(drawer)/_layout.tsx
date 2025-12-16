import { Drawer } from "expo-router/drawer";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View, Image, TouchableOpacity, useWindowDimensions } from "react-native";
import Colors from "@/constants/Colors";
import { Link } from 'expo-router';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { CustomDrawerContent } from "@/components/CustomDrawer";

export default function Layout() {
    const dimensions = useWindowDimensions();

    return (
        <Drawer
            drawerContent={CustomDrawerContent}
            screenOptions={{
                headerLeft: () => (
                    <DrawerToggleButton tintColor={Colors.grey} />
                ),
                headerStyle: {
                    backgroundColor: Colors.light,
                },
                headerShadowVisible: false,
                drawerActiveBackgroundColor: Colors.selected,
                drawerActiveTintColor: '#000',
                drawerInactiveTintColor: '#000',
                overlayColor: 'rgba(0, 0, 0, 0.2)',
                drawerItemStyle: { borderRadius: 12 },
                drawerLabelStyle: { marginLeft: 0 },
                drawerStyle: { width: dimensions.width * 0.86 },
            }}>
            <Drawer.Screen
                name="(chat)/new"
                dangerouslySingular={() => Math.random().toString()}
                options={{
                    title: 'Warike Assistant',
                    drawerIcon: () => (
                        <View style={[styles.item, { backgroundColor: '#000' }]}>
                            <Image source={require('@/assets/images/logo-white.png')} style={styles.btnImage} />
                        </View>
                    ),
                    headerRight: () => (
                        <Link href={'/(auth)/(drawer)/(chat)/new'} push asChild>
                            <TouchableOpacity>
                                <Ionicons
                                    name="create-outline"
                                    size={24}
                                    color={Colors.grey}
                                    style={{ marginRight: 16 }}
                                />
                            </TouchableOpacity>
                        </Link>
                    ),
                }}
            />

            <Drawer.Screen
                name="(chat)/[id]"
                options={{
                    drawerItemStyle: {
                        display: 'none',
                    },
                    headerRight: () => (
                        <Link href={'/(auth)/(drawer)/(chat)/new'} push asChild>
                            <TouchableOpacity>
                                <Ionicons
                                    name="create-outline"
                                    size={24}
                                    color={Colors.grey}
                                    style={{ marginRight: 16 }}
                                />
                            </TouchableOpacity>
                        </Link>
                    ),
                }}
            />

        </Drawer>
    );
}


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
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    roundImage: {
        width: 30,
        height: 30,
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
    item: {
        borderRadius: 15,
        overflow: 'hidden',
    },
    btnImage: {
        margin: 6,
        width: 16,
        height: 16,
    },
    dallEImage: {
        width: 28,
        height: 28,
        resizeMode: 'cover',
    },
});