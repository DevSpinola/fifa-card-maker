import React, { useState, useEffect, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getPlayers } from '../services/PlayerService';
import { getSports } from '../services/SportService';
import { createCard, getCardById, updateCard } from '../services/CardService';
import FifaCard from '../components/FifaCard';

export default function CreateCard({ route, navigation }) {
  const cardId = route.params?.cardId;
  const isEditing = !!cardId;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Estados para armazenar as listas de jogadores e esportes vindos da API
  const [players, setPlayers] = useState([]);
  const [sports, setSports] = useState([]);

  // Estados do formulário
  const [selectedPlayerId, setSelectedPlayerId] = useState('');
  const [selectedSportId, setSelectedSportId] = useState('');
  const [position, setPosition] = useState('');
  const [attributes, setAttributes] = useState({});

  // Carrega os dados toda vez que a tela ganha foco
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });
    return unsubscribe;
  }, [navigation]);

  // Busca jogadores e esportes na API
  const loadData = async () => {
    try {
      const [playersData, sportsData] = await Promise.all([
        getPlayers(),
        getSports()
      ]);
      setPlayers(playersData);
      setSports(sportsData);

      // Se estiver editando, preenche o formulário com os dados da carta existente
      if (isEditing) {
        const cardData = await getCardById(cardId);
        setSelectedPlayerId(cardData.player._id);
        setSelectedSportId(cardData.sport._id);
        setPosition(cardData.position);
        setAttributes(cardData.attributes || {});
      } else {
        // Se for nova carta, seleciona o primeiro item das listas por padrão
        if (playersData.length > 0) setSelectedPlayerId(playersData[0]._id);
        if (sportsData.length > 0) setSelectedSportId(sportsData[0]._id);
      }
    } catch (error) {
      console.error("Error loading data", error);
      Alert.alert("Erro", "Falha ao carregar dados.");
    } finally {
      setLoading(false);
    }
  };

  // useMemo: Otimiza a busca do objeto jogador selecionado, evitando recálculos desnecessários
  const selectedPlayer = useMemo(() => 
    players.find(p => p._id === selectedPlayerId), 
    [players, selectedPlayerId]
  );

  // useMemo: Otimiza a busca do objeto esporte selecionado
  const selectedSport = useMemo(() => 
    sports.find(s => s._id === selectedSportId), 
    [sports, selectedSportId]
  );

  // Quando o esporte muda (e não estamos editando), reseta os atributos para os valores padrão daquele esporte
  useEffect(() => {
    if (selectedSport && !isEditing) {
      const initialAttrs = {};
      selectedSport.attributeDefs.forEach(def => {
        initialAttrs[def.key] = def.default || 50;
      });
      setAttributes(initialAttrs);
    }
  }, [selectedSportId, isEditing]); 

  // Calcula a média (Overall) em tempo real para o preview
  const previewOverall = useMemo(() => {
    const values = Object.values(attributes).map(v => Number(v) || 0);
    if (values.length === 0) return 0;
    const sum = values.reduce((a, b) => a + b, 0);
    return Math.round(sum / values.length);
  }, [attributes]);

  // Objeto temporário para mostrar a carta no preview enquanto edita
  const previewCard = {
    player: selectedPlayer || { name: 'Player', photo: null },
    sport: selectedSport || { icon: null, attributeDefs: [] },
    position: position || null,
    overall: previewOverall,
    attributes: attributes
  };

  // Atualiza o valor de um atributo específico (garantindo que fique entre 0 e 99)
  const handleAttributeChange = (key, value) => {
    let numValue = parseInt(value);
    if (isNaN(numValue)) numValue = 0;
    if (numValue > 99) numValue = 99;
    
    setAttributes(prev => ({
      ...prev,
      [key]: numValue
    }));
  };

  // Salva ou atualiza a carta no backend
  const handleSave = async () => {
    if (!selectedPlayerId || !selectedSportId) {
      Alert.alert("Erro", "Selecione um jogador e um esporte.");
      return;
    }

    setSaving(true);
    const cardData = {
      player: selectedPlayerId,
      sport: selectedSportId,
      position: position,
      attributes: attributes,
      overall: previewOverall
    };

    try {
      if (isEditing) {
        await updateCard(cardId, cardData);
        Alert.alert("Sucesso", "Carta atualizada com sucesso!");
      } else {
        await createCard(cardData);
        Alert.alert("Sucesso", "Carta criada com sucesso!");
      }
      navigation.goBack();
    } catch (error) {
      console.error("Error saving card", error);
      Alert.alert("Erro", "Falha ao salvar a carta.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#d4af37" />
      </View>
    );
  }

  return (
    // KeyboardAvoidingView evita que o teclado cubra os campos de input
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Seção de Preview da Carta */}
        <View style={styles.previewContainer}>
          <Text style={styles.sectionTitle}>Preview</Text>
          <FifaCard card={previewCard} />
        </View>

        {/* Formulário de Configuração */}
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Configurações</Text>

          <Text style={styles.label}>Jogador</Text>
          <View style={styles.pickerRow}>
            <View style={[styles.pickerContainer, { flex: 1 }]}>
              <Picker
                selectedValue={selectedPlayerId}
                onValueChange={(itemValue) => setSelectedPlayerId(itemValue)}
              >
                {players.map(player => (
                  <Picker.Item key={player._id} label={player.name} value={player._id} />
                ))}
              </Picker>
            </View>
            <TouchableOpacity 
              style={styles.addPlayerButton}
              onPress={() => navigation.navigate('CreatePlayer')}
            >
              <Text style={styles.addPlayerButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Esporte</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedSportId}
              onValueChange={(itemValue) => setSelectedSportId(itemValue)}
              enabled={!isEditing} // Desabilita troca de esporte na edição para simplificar
            >
              {sports.map(sport => (
                <Picker.Item key={sport._id} label={sport.name} value={sport._id} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Posição (ex: ATA, GOL)</Text>
          <TextInput
            style={styles.input}
            value={position}
            onChangeText={setPosition}
            placeholder="Posição"
            maxLength={3}
            autoCapitalize="characters"
          />

          {/* Renderiza os inputs de atributos dinamicamente baseados no esporte */}
          {selectedSport && (
            <View style={styles.attributesContainer}>
              <Text style={styles.subTitle}>Atributos ({selectedSport.name})</Text>
              <View style={styles.attributesGrid}>
                {selectedSport.attributeDefs.map((def) => (
                  <View key={def.key} style={styles.attributeInputWrapper}>
                    <Text style={styles.attributeLabel}>{def.label} ({def.key.toUpperCase()})</Text>
                    <TextInput
                      style={styles.input}
                      value={String(attributes[def.key] || 0)}
                      onChangeText={(val) => handleAttributeChange(def.key, val)}
                      keyboardType="numeric"
                      maxLength={2}
                    />
                  </View>
                ))}
              </View>
            </View>
          )}

          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>
                {isEditing ? "Atualizar Carta" : "Criar Carta"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  },
  scrollContent: {
    padding: 20,
  },
  previewContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555',
    marginTop: 10,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
    marginTop: 10,
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fafafa',
  },
  addPlayerButton: {
    backgroundColor: '#28a745',
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPlayerButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  attributesContainer: {
    marginTop: 10,
  },
  attributesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  attributeInputWrapper: {
    width: '48%',
    marginBottom: 15,
  },
  attributeLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
