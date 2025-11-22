import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  createPlayer,
  updatePlayer,
  getPlayerById,
} from "../services/PlayerService";

const REMOVE_BG_API_KEY = "1VCKK78VENhyoxBYFTSx3UbY"; // Substitua pela sua chave da API remove.bg

export default function CreatePlayer({ navigation, route }) {
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState(null);
  const [processingImage, setProcessingImage] = useState(false);
  const playerId = route.params ? route.params.playerId : null;

  useEffect(() => {
    if (playerId) {
      getPlayerById(playerId)
        .then((player) => {
          setName(player.name);
          setPhoto(player.photo);
        })
        .catch((error) => {
          console.error("Erro ao buscar jogador:", error);
          Alert.alert("Erro", "Não foi possível buscar os dados do jogador.");
        });
    }
  }, [playerId]);

  // Função para converter URI da imagem para Base64
  const convertToBase64 = async (uri, mimeType = 'image/jpeg') => {
    try {
      console.log("Iniciando conversão para Base64...");
      const response = await fetch(uri);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          console.log("Conversão concluída!");
          let result = reader.result;
          
          // Se o resultado vier como application/octet-stream ou sem tipo, forçamos o tipo conhecido
          if (typeof result === 'string') {
             const parts = result.split(',');
             if (parts.length === 2) {
                // Reconstrói o cabeçalho data URI com o mimeType correto
                result = `data:${mimeType};base64,${parts[1]}`;
             }
          }
          
          resolve(result);
        };
        reader.onerror = (error) => {
          console.error("Erro no FileReader:", error);
          reject(error);
        };
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Erro ao converter imagem para Base64:", error);
      throw error;
    }
  };

  // Função para remover o fundo da imagem
  const removeBg = async (imageUri) => {
    const formData = new FormData();
    formData.append("size", "auto");
    formData.append("image_file", {
      uri: imageUri,
      name: "image.jpg",
      type: "image/jpeg",
    });

    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: { "X-Api-Key": REMOVE_BG_API_KEY },
      body: formData,
    });

    if (response.ok) {
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            // A API do remove.bg retorna PNG por padrão
            let result = reader.result;
            if (typeof result === 'string') {
                const parts = result.split(',');
                if (parts.length === 2) {
                   // Força image/png pois é o retorno do remove.bg
                   result = `data:image/png;base64,${parts[1]}`;
                }
            }
            resolve(result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } else {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  };

  const pickImage = async () => {
    console.log("Botão de selecionar foto clicado!");
    
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1], // Mantendo quadrado para cards
        quality: 0.5, // Reduzindo ainda mais - 50%
        base64: false,
        // Configurações de redimensionamento
        exif: false,
        allowsMultipleSelection: false,
      });
      
      console.log("Resultado do ImagePicker:", result);
      
      if (!result.canceled) {
        const asset = result.assets[0];

        // Validação prévia de tamanho (2.5MB) para evitar chamadas desnecessárias à API
        if (asset.fileSize && asset.fileSize > 2.5 * 1024 * 1024) {
          Alert.alert(
            "Aviso", 
            `Imagem muito grande (${(asset.fileSize / (1024 * 1024)).toFixed(2)}MB). Escolha uma imagem menor que 2.5MB.`
          );
          return;
        }

        setProcessingImage(true);
        try {
          // Tenta remover o fundo
          console.log("Tentando remover o fundo...");
          let finalImageBase64;
          
          try {
            if (REMOVE_BG_API_KEY === "INSERT_YOUR_API_KEY_HERE") {
               throw new Error("API Key não configurada");
            }
            finalImageBase64 = await removeBg(asset.uri);
            console.log("Fundo removido com sucesso!");
          } catch (bgError) {
            console.warn("Falha ao remover fundo (ou chave não configurada), usando imagem original:", bgError.message);
            Alert.alert("Aviso", "Não foi possível remover o fundo (verifique a API Key). Usando imagem original.");
            // Passa o mimeType original ou jpeg como fallback
            finalImageBase64 = await convertToBase64(asset.uri, asset.mimeType || 'image/jpeg');
          }

          // Verificar tamanho da string Base64
          const sizeInKB = Math.round((finalImageBase64.length * 3) / 4 / 1024);
          console.log(`Tamanho da imagem: ${sizeInKB}KB`);
          
          if (sizeInKB > 2500) { // Aumentei para 2.5MB para bater com o backend
            Alert.alert("Aviso", `Imagem muito grande (${sizeInKB}KB). Tente uma imagem menor.`);
            return;
          }
          
          setPhoto(finalImageBase64);
        } catch (error) {
          console.error("Erro no processamento da imagem:", error);
          Alert.alert("Erro", "Não foi possível processar a imagem.");
        } finally {
          setProcessingImage(false);
        }
      }
    } catch (error) {
      console.error("Erro no ImagePicker:", error);
      Alert.alert("Erro", "Não foi possível abrir a galeria.");
    }
  };

  const handleCreate = async () => {
    if (!name || !photo) {
      Alert.alert("Erro", "Todos os campos são obrigatórios.");
      return;
    }
    
    // Validações básicas no frontend
    if (name.length < 2) {
      Alert.alert("Erro", "Nome deve ter pelo menos 2 caracteres.");
      return;
    }
    
    console.log("Dados a serem enviados:", {
      name: name.trim(),
      photoTamanho: photo ? `${Math.round((photo.length * 3) / 4 / 1024)}KB` : "Sem foto",
      photoInicio: photo ? photo.substring(0, 50) + "..." : "Sem foto"
    });
    
    try {
      const result = await createPlayer({ 
        name: name.trim(), 
        photo: photo 
      });
      console.log("Resposta da API:", result);
      Alert.alert("Sucesso", "Jogador cadastrado com sucesso.");
      navigation.goBack();
    } catch (error) {
      console.error("Erro completo:", error);
      console.error("Resposta da API:", error.response?.data);
      console.error("Status:", error.response?.status);
      
      const errorMessage = error.response?.data?.erro || error.message || "Erro desconhecido";
      Alert.alert("Erro", `Não foi possível cadastrar o jogador: ${errorMessage}`);
    }
  };

  const handleUpdate = async () => {
    if (!name || !photo) {
      Alert.alert("Erro", "Todos os campos são obrigatórios.");
      return;
    }
    try {
      await updatePlayer(playerId, { name, photo });
      Alert.alert("Sucesso", "Jogador atualizado com sucesso.");
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao atualizar jogador:", error);
      Alert.alert("Erro", "Não foi possível atualizar o jogador.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome:</Text>
      <TextInput 
        style={styles.input} 
        value={name} 
        onChangeText={setName}
        placeholder="Digite o nome do jogador"
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Foto:</Text>
      <TouchableOpacity style={styles.photoButton} onPress={pickImage} disabled={processingImage}>
        {processingImage ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.photoButtonText}>📷 Selecionar Foto (Remove BG)</Text>
        )}
      </TouchableOpacity>
      {photo && (
        <Image 
          source={{ uri: photo.startsWith('data:') ? photo : photo }} 
          style={styles.image}
          resizeMode="contain"
        />
      )}

      <TouchableOpacity 
        style={styles.submitButton} 
        onPress={playerId ? handleUpdate : handleCreate}
      >
        <Text style={styles.submitButtonText}>
          {playerId ? "✓ Atualizar Jogador" : "✓ Cadastrar Jogador"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    backgroundColor: "white",
    fontSize: 16,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  photoButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  photoButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: "#34C759",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    alignSelf: "center",
    backgroundColor: "white",
  },
});
