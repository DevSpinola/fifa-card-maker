import React from 'react';
import { View, Text, Image, ImageBackground, StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
// Ajuste leve no aspect ratio para ficar mais próximo do real
const CARD_ASPECT_RATIO = 1.48; 
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

  const col1Keys = ['pac', 'sho', 'pas']; 
  const col2Keys = ['dri', 'def', 'phy'];

  const allKeys = Object.keys(attributes || {});
  const leftColumn = col1Keys.every(k => allKeys.includes(k)) ? col1Keys : allKeys.slice(0, 3);
  const rightColumn = col2Keys.every(k => allKeys.includes(k)) ? col2Keys : allKeys.slice(3, 6);

  const textColor = '#3e3222'; 

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
          
          {/* LADO ESQUERDO: Rating, Posição, Nação/Clube */}
          <View style={styles.infoLeftColumn}>
            <Text style={[styles.ratingText, { color: textColor }]}>{overall}</Text>
            <Text style={[styles.positionText, { color: textColor }]}>{position?.toUpperCase()}</Text>
            
            <View style={[styles.dividerLine, { backgroundColor: textColor }]} />
            
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
            <View style={[styles.nameDivider, { backgroundColor: textColor }]} />
          </View>

          {/* GRID DE ATRIBUTOS */}
          <View style={styles.attributesContainer}>
             {/* Coluna Esquerda (Alinhada à direita, perto da linha) */}
             <View style={[styles.attrColumn, { alignItems: 'flex-end', paddingRight: 8 }]}>
                {leftColumn.map(key => (
                  <View key={key} style={styles.attrItem}>
                    <Text style={[styles.attrValue, { color: textColor }]}>{attributes[key]}</Text>
                    <Text style={[styles.attrLabel, { color: textColor }]}>{getAttributeLabel(key)}</Text>
                  </View>
                ))}
             </View>
             
             {/* Divisor Vertical Central */}
             <View style={[styles.verticalSeparator, { backgroundColor: textColor }]} />

             {/* Coluna Direita (Alinhada à esquerda, perto da linha) */}
             <View style={[styles.attrColumn, { alignItems: 'flex-start', paddingLeft: 8 }]}>
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
    // Sombras
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
  playerImageContainer: {
    position: 'absolute',
    top: '16%', // Ajuste fino para a foto
    right: '8%', 
    width: '50%', 
    height: '40%', 
    zIndex: 1, 
  },
  playerImage: {
    width: '100%',
    height: '100%',
  },
  overlayContainer: {
    flex: 1,
    zIndex: 2,
  },
  // --- LADO ESQUERDO (Rating/Pos) ---
  infoLeftColumn: {
    position: 'absolute',
    top: '22%', // Desci de 20% para 22% para não ficar colado no topo
    left: '10%', 
    alignItems: 'center',
    width: '20%',
  },
  ratingText: {
    fontFamily: Platform.OS === 'ios' ? 'AvenirNext-CondensedBold' : 'sans-serif-condensed',
    fontSize: 38, // Levemente menor para não estourar
    fontWeight: 'bold', 
    includeFontPadding: false,
    lineHeight: 38,
  },
  positionText: {
    fontFamily: Platform.OS === 'ios' ? 'AvenirNext-Condensed' : 'sans-serif-condensed',
    fontSize: 18,
    fontWeight: '600',
    marginTop: -2, // Aproxima a posição do rating
    marginBottom: 4,
  },
  dividerLine: {
    width: '80%', // Menor que 100% para ficar estético
    height: 1,
    opacity: 0.5,
    marginBottom: 6,
  },
  iconWrapper: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clubIcon: {
    width: '100%',
    height: '100%',
    opacity: 0.9,
  },
  // --- NOME ---
  nameContainer: {
    position: 'absolute',
    top: '63%', // Posição ideal do nome
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  playerName: {
    fontFamily: Platform.OS === 'ios' ? 'AvenirNext-CondensedBold' : 'sans-serif-condensed',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  nameDivider: {
    width: '85%',
    height: 1,
    opacity: 0.3,
    marginTop: 4,
  },
  // --- ATRIBUTOS ---
  attributesContainer: {
    position: 'absolute',
    bottom: '14%', // Subi um pouco o bloco todo
    width: '100%',
    paddingHorizontal: 30, // Margem lateral para centralizar o bloco visualmente
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  attrColumn: {
    flex: 1, // Divide o espaço igualmente
    // O alinhamento é controlado inline no JSX (flex-end vs flex-start)
  },
  attrItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 1, // Espaçamento vertical entre linhas
  },
  attrValue: {
    fontFamily: Platform.OS === 'ios' ? 'AvenirNext-CondensedBold' : 'sans-serif-condensed',
    fontWeight: 'bold',
    fontSize: 18,
    marginHorizontal: 4, // Espaço entre numero e texto
  },
  attrLabel: {
    fontFamily: Platform.OS === 'ios' ? 'AvenirNext-Condensed' : 'sans-serif-condensed',
    fontWeight: '400',
    fontSize: 16,
  },
  verticalSeparator: {
    width: 1,
    height: '90%', 
    opacity: 0.3,
    marginHorizontal: 5, // Espaço da linha para as colunas
  }
});