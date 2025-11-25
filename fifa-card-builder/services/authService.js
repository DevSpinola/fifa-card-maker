import api from './api';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'fifa_jwt_token';

// Salvar Token no dispositivo
export async function saveToken(token) {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
}

// Ler Token do dispositivo
export async function getToken() {
    return await SecureStore.getItemAsync(TOKEN_KEY);
}

// Apagar Token (Logout)
export async function removeToken() {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
}

// Fazer Login na API
export async function login(login, senha) {
    try {
        const response = await api.post('/user/login', { login, senha });
        const { token } = response.data;
        
        if (token) {
            await saveToken(token);
        }
        return response.data;
    } catch (error) {
        throw error;
    }
}

// Fazer Cadastro (Registro)
export async function register(data) {
    try {
        // data deve conter: { id, nome, login, senha }
        const response = await api.post('/user', data);
        return response.data;
    } catch (error) {
        throw error;
    }
}