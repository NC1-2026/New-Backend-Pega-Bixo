import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import InicioScreen from '../screens/InicioScreen';
import CatalogoScreen from '../screens/CatalogoScreen';
import QuizScreen from '../screens/QuizScreen';
import SobreScreen from '../screens/SobreScreen';
import { cores } from '../theme';

const Tab = createBottomTabNavigator();

const icones = {
  Inicio: 'home-outline',
  Catalogo: 'grid-outline',
  Quiz: 'trophy-outline',
  Sobre: 'information-circle-outline',
};

export default function Tabs() {
  return (
    <Tab.Navigator
      initialRouteName="Inicio"
      screenOptions={({ route }) => ({
        headerShown: false,
        animation: 'fade',
        headerShown: false,
        tabBarActiveTintColor: cores.verdeEscuro,
        tabBarInactiveTintColor: cores.textoSuave,
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
        tabBarStyle: { backgroundColor: cores.branco, borderTopColor: cores.verdeClaro },
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={icones[route.name]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Inicio" component={InicioScreen} options={{ tabBarLabel: 'Início' }} />
      <Tab.Screen name="Catalogo" component={CatalogoScreen} options={{ tabBarLabel: 'Catálogo' }} />
      <Tab.Screen name="Quiz" component={QuizScreen} />
      <Tab.Screen name="Sobre" component={SobreScreen} />
    </Tab.Navigator>
  );
}