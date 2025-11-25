import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Importe as telas
import Login from './screens/Login';
import Register from './screens/Register';
import Home from './screens/Home';
import CreateCard from './screens/CreateCard';
import ConsultCards from './screens/ConsultCards';
import CreatePlayer from './screens/CreatePlayer';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={Register} options={{ title: 'Criar Conta' }} />
        <Stack.Screen name="Home" component={Home} options={{ title: 'Menu Principal', headerLeft: null }} />
        <Stack.Screen name="CreateCard" component={CreateCard} options={{ title: 'Criar Carta' }} />
        <Stack.Screen name="ConsultCards" component={ConsultCards} options={{ title: 'Minhas Cartas' }} />
        <Stack.Screen name="CreatePlayer" component={CreatePlayer} options={{ title: 'Criar Jogador' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}