import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/Home';
import ConsultCards from './screens/ConsultCards';
import CreateCard from './screens/CreateCard';
import CreatePlayer from './screens/CreatePlayer';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={Home} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="ConsultCards" 
          component={ConsultCards} 
          options={{ title: 'Consultar Cartas' }} 
        />
        <Stack.Screen 
          name="CreateCard" 
          component={CreateCard} 
          options={{ title: 'Nova Carta' }} 
        />
        <Stack.Screen 
          name="CreatePlayer" 
          component={CreatePlayer} 
          options={{ title: 'Novo Jogador' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}