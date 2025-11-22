import axios from "axios";

// Para Android Emulator use 'http://10.0.2.2:3000'
// Para iOS Simulator use 'http://localhost:3000'
// Para dispositivo físico use o IP da sua máquina ex: 'http://192.168.1.5:3000'

const api = axios.create({
  baseURL: "http://10.0.2.2:3000",
  timeout: 30000, // 30 segundos para upload de imagens
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
