import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';


const Page = () => {
    const router = useRouter();

    const { signOut } = useAuth();

    const onSignOut = async () => {
        await signOut();
        router.replace('/');
    };
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[defaultStyles.btn, { backgroundColor: Colors.teal }]}
                onPress={onSignOut}>
                <Text style={styles.buttonText}>Sign Out</Text>
            </TouchableOpacity>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.teal,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginBottom: 20,
        backgroundColor: '#fff',
    },

    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
    },
});
export default Page;
