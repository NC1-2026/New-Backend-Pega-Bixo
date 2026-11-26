import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Tabs from './src/navigation/Tabs';
import DetalheScreen from './src/screens/DetalheScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Tabs" component={Tabs} />
          <Stack.Screen name="Detalhe" component={DetalheScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

<Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
  <Stack.Screen name="Tabs" component={Tabs} />
  <Stack.Screen name="Detalhe" component={DetalheScreen} options={{ animation: 'fade_from_bottom' }} />
</Stack.Navigator>