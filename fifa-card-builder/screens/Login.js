import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { login } from '../services/authService';

export default function Login({ navigation }) {
    const [userLogin, setUserLogin] = useState('');
    const [senha, setSenha] = useState('');

    const handleLogin = async () => {
        try {
            await login(userLogin, senha);
            // Se der certo, vai para a Home
            navigation.replace('Home'); 
        } catch (error) {
            Alert.alert("Erro", "Login ou senha inválidos");
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>FIFA Card Builder</Text>
            
            <TextInput
                style={styles.input}
                placeholder="Login"
                value={userLogin}
                onChangeText={setUserLogin}
                autoCapitalize="none"
            />
            
            <TextInput
                style={styles.input}
                placeholder="Senha"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry
            />

            <Button title="Entrar" onPress={handleLogin} />
            
            <View style={{ marginTop: 20 }}>
                <Button 
                    title="Criar Conta" 
                    color="gray" 
                    onPress={() => navigation.navigate('Register')} 
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 }
});