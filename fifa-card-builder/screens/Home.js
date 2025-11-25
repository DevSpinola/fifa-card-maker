import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { removeToken } from '../services/authService'; // <--- Importação adicionada

// Imagens das cartas para a animação da logo
const cardImages = [
  require('../assets/gold.png'),
  require('../assets/silver.png'),
  require('../assets/bronze.png')
];

export default function Home({ navigation }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Efeito para trocar a imagem da carta a cada 1.5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % cardImages.length);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  // <--- Função de Logout adicionada
  const handleLogout = async () => {
    await removeToken();
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      {/* Exibe a imagem atual do carrossel */}
      <Image 
        source={cardImages[currentImageIndex]} 
        style={styles.logo} 
        resizeMode="contain"
      />
      <Text style={styles.title}>FIFA Card Builder</Text>
      
      <View style={styles.buttonContainer}>
        {/* Botão para navegar para a tela de consulta */}
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('ConsultCards')}
        >
          <Text style={styles.buttonText}>Consultar Cartas</Text>
        </TouchableOpacity>

        {/* Botão para navegar para a tela de criação de Carta */}
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('CreateCard')}
        >
          <Text style={styles.buttonText}>Criar Nova Carta</Text>
        </TouchableOpacity>

        {/* <--- Botão Novo: Criar Jogador (Mantendo o estilo original) */}
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('CreatePlayer')}
        >
          <Text style={styles.buttonText}>Criar Jogador</Text>
        </TouchableOpacity>

        {/* <--- Botão Novo: Sair (Mantendo o estilo, com cor de alerta) */}
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#d9534f', marginTop: 10 }]} 
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 150,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 50,
    color: '#333',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});