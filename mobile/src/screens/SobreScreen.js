import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { cores } from '../theme';

export default function SobreScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: cores.fundo }}>
      <View style={{ padding: 20, gap: 16 }}>
        <View>
          <Text style={{ fontSize: 13, fontWeight: '600', letterSpacing: 0.5, color: cores.verde }}>
            FAUNA BRASILEIRA
          </Text>
          <Text style={{ fontSize: 30, fontWeight: '800', color: cores.verdeEscuro }}>Sobre o app</Text>
        </View>
        <Text style={{ fontSize: 16, lineHeight: 26, color: cores.texto }}>
          Um catálogo interativo para você conhecer a incrível fauna brasileira, aprender sobre sua
          importância e ajudar na conservação da nossa natureza.
        </Text>
        <View style={{ padding: 16, borderRadius: 20, backgroundColor: cores.verdeClaro }}>
          <Text style={{ fontSize: 17, fontWeight: '800', color: cores.verdeEscuro }}>
            Preserve a fauna. Preserve o Brasil!
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}