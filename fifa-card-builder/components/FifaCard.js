import React from 'react';
import { View, Text, Image, ImageBackground, StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const CARD_ASPECT_RATIO = 1.45; 
const CARD_HEIGHT = CARD_WIDTH * CARD_ASPECT_RATIO;

const CARD_TEMPLATES = {
  gold: require('../assets/gold.png'),
  silver: require('../assets/silver.png'),
  bronze: require('../assets/bronze.png'),
};

export default function FifaCardPro({ card }) {
  if (!card) return null;
  const { player, sport, position, overall, attributes } = card;

  const getCardType = (rating) => {
    const numRating = Number(rating);
    if (numRating >= 75) return 'gold';
    if (numRating >= 65) return 'silver';
    return 'bronze';
  };
  
  const cardType = getCardType(overall);
  const bgSource = CARD_TEMPLATES[cardType];

  // Função para pegar label curto (3 letras)
  const getAttributeLabel = (key) => {
    const def = sport?.attributeDefs?.find((d) => d.key === key);
    return def ? def.label.substring(0, 3).toUpperCase() : key.substring(0, 3).toUpperCase();
  };

  // Definição manual das colunas para ficar IGUAL ao FIFA
  // Coluna 1: Ritmo, Chute, Passe
  const col1Keys = ['pac', 'sho', 'pas']; 
  // Coluna 2: Drible, Defesa, Físico
  const col2Keys = ['dri', 'def', 'phy'];

  // Fallback caso as chaves não sejam padrão FIFA
  const allKeys = Object.keys(attributes || {});
  const leftColumn = col1Keys.every(k => allKeys.includes(k)) ? col1Keys : allKeys.slice(0, 3);
  const rightColumn = col2Keys.every(k => allKeys.includes(k)) ? col2Keys : allKeys.slice(3, 6);

  const textColor = '#3e3222'; // Cor padrão FIFA (Marrom escuro)

  return (
    <View style={styles.container}>
      <ImageBackground source={bgSource} style={styles.cardBackground} resizeMode="contain">
        
        {/* CAMADA 2: FOTO DO JOGADOR */}
        <View style={styles.playerImageContainer}>
           <Image 
             source={{ uri: player.photo }} 
             style={styles.playerImage} 
             resizeMode="contain" 
           />
        </View>

        {/* CAMADA 3: INFORMAÇÕES */}
        <View style={styles.overlayContainer}>
          
          {/* LADO ESQUERDO: Rating, Posição, Nação, Clube */}
          <View style={styles.infoLeftColumn}>
            <Text style={[styles.ratingText, { color: textColor }]}>{overall}</Text>
            <Text style={[styles.positionText, { color: textColor }]}>{position?.toUpperCase()}</Text>
            
            {/* Linha decorativa abaixo da posição */}
            <View style={[styles.dividerLine, { backgroundColor: textColor }]} />
            
            {/* Ícones empilhados (Nação em cima, Clube embaixo) se houvesse bandeira */}
            {/* Simulando apenas o clube por enquanto */}
            {sport?.icon && (
               <View style={styles.iconWrapper}>
                 <Image source={{ uri: sport.icon }} style={styles.clubIcon} resizeMode="contain" />
               </View>
            )}
          </View>

          {/* NOME DO JOGADOR */}
          <View style={styles.nameContainer}>
            <Text style={[styles.playerName, { color: textColor }]} numberOfLines={1} adjustsFontSizeToFit>
              {player.name.toUpperCase()}
            </Text>
            {/* Linha decorativa abaixo do nome */}
            <View style={[styles.nameDivider, { backgroundColor: textColor }]} />
          </View>

          {/* GRID DE ATRIBUTOS */}
          <View style={styles.attributesContainer}>
             {/* Coluna Esquerda */}
             <View style={styles.attrColumn}>
                {leftColumn.map(key => (
                  <View key={key} style={styles.attrItem}>
                    <Text style={[styles.attrValue, { color: textColor }]}>{attributes[key]}</Text>
                    <Text style={[styles.attrLabel, { color: textColor }]}>{getAttributeLabel(key)}</Text>
                  </View>
                ))}
             </View>
             
             {/* Divisor Vertical Central */}
             <View style={[styles.verticalSeparator, { backgroundColor: textColor }]} />

             {/* Coluna Direita */}
             <View style={styles.attrColumn}>
                {rightColumn.map(key => (
                  <View key={key} style={styles.attrItem}>
                    <Text style={[styles.attrValue, { color: textColor }]}>{attributes[key]}</Text>
                    <Text style={[styles.attrLabel, { color: textColor }]}>{getAttributeLabel(key)}</Text>
                  </View>
                ))}
             </View>
          </View>

        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    alignSelf: 'center',
    marginVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  cardBackground: {
    width: '100%',
    height: '100%',
  },
  // A foto deve ficar um pouco "abaixo" das infos laterais, mas visível
  playerImageContainer: {
    position: 'absolute',
    top: '15%', 
    right: '8%', // Empurra a foto para a direita, liberando espaço para o Rating na esquerda
    width: '55%', 
    height: '40%', 
    zIndex: 1, 
    overflow: 'hidden'
  },
  playerImage: {
    width: '100%',
    height: '100%',
  },
  overlayContainer: {
    flex: 1,
    zIndex: 2,
  },
  // Coluna da esquerda (onde fica 99, ATA, Bandeira)
  infoLeftColumn: {
    position: 'absolute',
    top: '20%', 
    left: '8%', // Margem da esquerda
    alignItems: 'center',
    width: '22%',
  },
  ratingText: {
    // Tenta usar fonte condensada nativa
    fontFamily: Platform.OS === 'ios' ? 'AvenirNext-CondensedBold' : 'sans-serif-condensed',
    fontSize: 42, // Rating bem grande
    fontWeight: 'bold', 
    includeFontPadding: false,
    lineHeight: 42,
  },
  positionText: {
    fontFamily: Platform.OS === 'ios' ? 'AvenirNext-Condensed' : 'sans-serif-condensed',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  dividerLine: {
    width: '100%',
    height: 1,
    opacity: 0.4,
    marginBottom: 8,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clubIcon: {
    width: '100%',
    height: '100%',
    opacity: 0.9,
  },
  nameContainer: {
    position: 'absolute',
    top: '64%', // Ponto onde começa a área de texto
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 25,
  },
  playerName: {
    fontFamily: Platform.OS === 'ios' ? 'AvenirNext-CondensedBold' : 'sans-serif-condensed',
    fontSize: 26,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  nameDivider: {
    width: '80%',
    height: 1,
    opacity: 0.2,
    marginTop: 4,
  },
  attributesContainer: {
    position: 'absolute',
    bottom: '13%', // Ajuste para não colar no fundo
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  attrColumn: {
    width: '35%', // Largura das colunas de stats
    paddingLeft: 15, // Recuo interno para alinhar texto
  },
  attrItem: {
    flexDirection: 'row',
    alignItems: 'center', // Centraliza verticalmente
    marginBottom: 2,
  },
  attrValue: {
    fontFamily: Platform.OS === 'ios' ? 'AvenirNext-CondensedBold' : 'sans-serif-condensed',
    fontWeight: 'bold',
    fontSize: 19,
    marginRight: 6, // Espaço entre número e label
  },
  attrLabel: {
    fontFamily: Platform.OS === 'ios' ? 'AvenirNext-Condensed' : 'sans-serif-condensed',
    fontWeight: '500',
    fontSize: 16,
  },
  verticalSeparator: {
    width: 1,
    height: '85%', // Altura da linha divisória dos stats
    opacity: 0.2,
    marginHorizontal: 0,
  }
});