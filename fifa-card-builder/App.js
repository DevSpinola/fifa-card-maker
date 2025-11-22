import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/Home';
import ConsultCards from './screens/ConsultCards';
import CreateCard from './screens/CreateCard';
import CreatePlayer from './screens/CreatePlayer';

// Cria a pilha de navegação
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    // Container principal que gerencia o estado da navegação
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        {/* Tela Inicial (sem cabeçalho padrão) */}
        <Stack.Screen 
          name="Home" 
          component={Home} 
          options={{ headerShown: false }} 
        />
        {/* Tela de Consulta de Cartas */}
        <Stack.Screen 
          name="ConsultCards" 
          component={ConsultCards} 
          options={{ title: 'Consultar Cartas' }} 
        />
        {/* Tela de Criação de Carta */}
        <Stack.Screen 
          name="CreateCard" 
          component={CreateCard} 
          options={{ title: 'Nova Carta' }} 
        />
        {/* Tela de Cadastro de Jogador */}
        <Stack.Screen 
          name="CreatePlayer" 
          component={CreatePlayer} 
          options={{ title: 'Novo Jogador' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}