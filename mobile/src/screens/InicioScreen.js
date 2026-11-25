import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { cores } from '../theme';

export default function InicioScreen({ navigation }) {
  const botao = (rotulo, destino, fundo, corTexto, borda) => (
    <Pressable
      onPress={() => navigation.navigate(destino)}
      accessibilityRole="button"
      style={{
        height: 64,
        paddingHorizontal: 20,
        borderRadius: 20,
        justifyContent: 'center',
        backgroundColor: fundo,
        borderWidth: borda ? 1.5 : 0,
        borderColor: cores.borda,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: '700', color: corTexto }}>{rotulo}</Text>
    </Pressable>
  );

  return (
    <View style={{ flex: 1, backgroundColor: cores.fundo }}>
      <SafeAreaView
        edges={['top']}
        style={{
          backgroundColor: cores.verdeEscuro,
          paddingHorizontal: 28,
          paddingTop: 40,
          paddingBottom: 48,
          borderBottomLeftRadius: 36,
          borderBottomRightRadius: 36,
        }}
      >
        <Text style={{ fontSize: 40, fontWeight: '800', lineHeight: 44, color: '#FFFFFF' }}>
          {'Fauna\nBrasileira'}
        </Text>
        <Text style={{ marginTop: 12, fontSize: 16, color: cores.fundo }}>
          Conheça, aprenda e preserve!
        </Text>
      </SafeAreaView>

      <View style={{ padding: 24, gap: 12 }}>
        {botao('Catálogo', 'Catalogo', cores.verdeEscuro, '#FFFFFF', false)}
        {botao('Quiz', 'Quiz', cores.verdeClaro, cores.verdeEscuro, false)}
        {botao('Sobre o app', 'Sobre', cores.branco, cores.verdeEscuro, true)}
      </View>
    </View>
  );
}