import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { cores } from '../theme';

export default function QuizScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: cores.fundo }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 12 }}>
        <Text style={{ fontSize: 40, fontWeight: '800', color: cores.verdeEscuro }}>Quiz</Text>
        <Text style={{ textAlign: 'center', fontSize: 16, lineHeight: 24, color: cores.texto }}>
          Teste seus conhecimentos sobre a fauna brasileira! Em breve.
        </Text>
      </View>
    </SafeAreaView>
  );
}