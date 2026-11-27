import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { cores } from '../theme';

export default function SobreScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: cores.fundo }}>
      <View style={{ padding: 20, gap: 16 }}>
        <View>
          <Text style={{ fontSize: 13, fontWeight: '600', letterSpacing: 0.5, color: cores.verde }}>
            PEGA-BICHO
          </Text>
          <Text style={{ fontSize: 30, fontWeight: '800', color: cores.verdeEscuro }}>Sobre o Projeto</Text>
        </View>
        <Text style={{ fontSize: 16,fontWeight: '800', lineHeight: 26, color: cores.texto }}>
          Pega Bicho — Aprenda sobre a fauna da Amazônia!

Desenvolvido pela turma NCI do 3º período do curso de T.I. para a 21ª Feira Tecnológica da FUCAPI, o Pega Bixo nasceu com o objetivo de aproximar crianças e turistas da biodiversidade amazônica.

Inicialmente, nossa ideia era usar a câmera do celular para identificar espécies encontradas na cidade, em parques e na floresta. Como o escopo era ambicioso para o tempo disponível, fizemos uma escolha estratégica e modesta: começamos com um catálogo interativo de animais locais e um quiz para testar seus conhecimentos.

Este é um protótipo inicial, mas já traduz muito bem o que queremos construir. Obrigado por experimentar o app — e se você curtiu a proposta, vote na gente!
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