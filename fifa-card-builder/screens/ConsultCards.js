import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { getCards, deleteCard } from '../services/CardService';
import FifaCard from '../components/FifaCard';
import { MaterialIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';

export default function ConsultCards({ navigation }) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Hook que detecta se a tela está em foco (visível para o usuário)
  const isFocused = useIsFocused();

  // Recarrega a lista de cartas sempre que o usuário entra nesta tela
  useEffect(() => {
    if (isFocused) {
      fetchCards();
    }
  }, [isFocused]);

  // Busca todas as cartas cadastradas no backend
  const fetchCards = async () => {
    try {
      const data = await getCards();
      setCards(data);
    } catch (error) {
      console.error("Failed to fetch cards", error);
    } finally {
      setLoading(false);
    }
  };

  // Exibe um alerta de confirmação antes de excluir uma carta
  const handleDelete = (id) => {
    Alert.alert(
      "Excluir Carta",
      "Tem certeza que deseja excluir esta carta?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive",
          onPress: async () => {
            try {
              await deleteCard(id);
              fetchCards(); // Atualiza a lista após a exclusão
            } catch (error) {
              Alert.alert("Erro", "Não foi possível excluir a carta.");
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#d4af37" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* FlatList é otimizado para listas longas */}
      <FlatList
        data={cards}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            {/* Renderiza o componente visual da carta */}
            <FifaCard card={item} />
            
            {/* Botões de ação (Editar e Excluir) */}
            <View style={styles.actionsContainer}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.editButton]} 
                onPress={() => navigation.navigate('CreateCard', { cardId: item._id })}
              >
                <MaterialIcons name="edit" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, styles.deleteButton]} 
                onPress={() => handleDelete(item._id)}
              >
                <MaterialIcons name="delete" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>Nenhuma carta encontrada.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  listContent: {
    paddingVertical: 20,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#666',
  },
  cardWrapper: {
    alignItems: 'center',
    marginBottom: 30,
  },
  actionsContainer: {
    flexDirection: 'row',
    marginTop: -10,
    gap: 15,
  },
  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  editButton: {
    backgroundColor: '#007AFF',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
});
