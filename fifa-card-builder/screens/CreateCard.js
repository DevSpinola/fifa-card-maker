import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CreateCard() {
  return (
    <View style={styles.container}>
      <Text>Tela de Criação de Nova Carta</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
