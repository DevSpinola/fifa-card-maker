import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { register } from '../services/authService';

export default function Register({ navigation }) {
    const [id, setId] = useState('');
    const [nome, setNome] = useState('');
    const [userLogin, setUserLogin] = useState('');
    const [senha, setSenha] = useState('');

    const handleRegister = async () => {
        if (!id || !nome || !userLogin || !senha) {
            return Alert.alert("Erro", "Preencha todos os campos");
        }

        try {
            await register({ id, nome, login: userLogin, senha });
            Alert.alert("Sucesso", "Usuário criado! Faça login.");
            navigation.goBack();
        } catch (error) {
            Alert.alert("Erro", "Erro ao criar usuário. Verifique se o ID ou Login já existem.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Novo Usuário</Text>
            
            <TextInput style={styles.input} placeholder="ID Único (ex: user01)" value={id} onChangeText={setId} />
            <TextInput style={styles.input} placeholder="Nome Completo" value={nome} onChangeText={setNome} />
            <TextInput style={styles.input} placeholder="Login" value={userLogin} onChangeText={setUserLogin} autoCapitalize="none"/>
            <TextInput style={styles.input} placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry />

            <Button title="Cadastrar" onPress={handleRegister} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 }
});