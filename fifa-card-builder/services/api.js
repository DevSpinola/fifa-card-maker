import axios from "axios";
import * as SecureStore from 'expo-secure-store';

const api = axios.create({
    // Se estiver no emulador Android, use 10.0.2.2. Se for dispositivo físico, use o IP da sua máquina.
    baseURL: "http://10.0.2.2:3000", 
});

// Interceptador para adicionar o Token em todas as requisições
api.interceptors.request.use(async (config) => {
    try {
        const token = await SecureStore.getItemAsync('fifa_jwt_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (error) {
        console.error("Erro ao recuperar token", error);
    }
    return config;
});

export default api;