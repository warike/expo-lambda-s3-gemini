
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Image, TouchableOpacity, KeyboardAvoidingView, Platform, View, Text, StyleSheet, TextInput, Alert, ScrollView } from 'react-native';
import { defaultStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';
import { useSignIn, useSignUp } from '@clerk/clerk-expo';

const LoginPage = () => {
    const { type } = useLocalSearchParams<{ type: string }>();
    const { signIn, setActive, isLoaded } = useSignIn();
    const { signUp, isLoaded: signUpLoaded, setActive: signupSetActive } = useSignUp();

    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const onSignInPress = async () => {
        if (!isLoaded) { return; }
        setLoading(true);
        try {
            const completeSignIn = await signIn.create({
                identifier: emailAddress,
                password,
            });
            await setActive({ session: completeSignIn.createdSessionId });
        } catch (err: any) {
            Alert.alert(err.errors[0].message);
        } finally {
            setLoading(false);
        }
    };

    const onSignUpPress = async () => {
        if (!signUpLoaded) { return; }
        setLoading(true);
        try {
            const result = await signUp.create({
                emailAddress,
                password,
            });
            signupSetActive({ session: result.createdSessionId });
        } catch (err: any) {
            alert(err.errors[0].message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 150 : 0}
            style={styles.container}>

            {loading && (
                <View style={defaultStyles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#fff" />
                </View>
            )}

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                showsVerticalScrollIndicator={false}
            >
                <Image source={require('../assets/images/logo-white.png')} style={styles.logo} />

                <Text style={styles.title}>{type === 'login' ? 'Welcome back' : 'Create your account'}</Text>

                <View style={styles.inputContainer}>
                    <TextInput
                        autoCapitalize="none"
                        placeholder="john@apple.com"
                        value={emailAddress}
                        onChangeText={setEmailAddress}
                        style={styles.inputField}
                    />
                    <TextInput
                        placeholder="password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        style={styles.inputField}
                    />
                </View>

                {type === 'login' ? (
                    <TouchableOpacity style={[defaultStyles.btn, styles.btnPrimary]} onPress={onSignInPress}>
                        <Text style={styles.btnPrimaryText}>Login</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={[defaultStyles.btn, styles.btnPrimary]} onPress={onSignUpPress}>
                        <Text style={styles.btnPrimaryText}>Create account</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    scrollContent: {
        flexGrow: 1,
        padding: 10,
        justifyContent: 'center',
        marginBottom: 500,
    },
    logo: {
        width: 150,
        height: 150,
        alignSelf: 'center',
        // marginVertical: 10,
    },
    title: {
        fontSize: 30,
        marginBottom: 50,
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    inputContainer: {
        marginBottom: 5,
    },
    inputField: {
        marginVertical: 4,
        height: 50,
        borderWidth: 1,
        borderColor: Colors.grey,
        borderRadius: 12,
        padding: 10,
        backgroundColor: '#fff',
    },
    btnPrimary: {
        backgroundColor: Colors.teal,
        marginVertical: 4,
    },
    btnPrimaryText: {
        color: '#fff',
        fontSize: 16,
    },
});
export default LoginPage;
