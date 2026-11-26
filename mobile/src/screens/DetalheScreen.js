import { Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FotoAnimal from '../components/FotoAnimal';
import StatusBadge from '../components/StatusBadge';
import { ALIMENTACAO } from '../utils/labels';
import { cores } from '../theme';

const Secao = ({ titulo, children, fundo = cores.branco }) => (
  <View style={{ backgroundColor: fundo, borderRadius: 20, padding: 18, gap: 10 }}>
    <Text style={{ fontSize: 17, fontWeight: '800', color: cores.verdeEscuro }}>{titulo}</Text>
    {children}
  </View>
);

export default function DetalheScreen({ route, navigation }) {
  const { animal } = route.params;
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: cores.fundo }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <FotoAnimal uri={animal.imagemUrl} style={{ width, height: 320 }} />

        <View
          style={{
            marginTop: -28,
            padding: 20,
            gap: 18,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            backgroundColor: cores.fundo,
          }}
        >
          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 30, fontWeight: '800', color: cores.verdeEscuro }}>{animal.nome}</Text>
            <Text style={{ fontSize: 16, fontStyle: 'italic', color: cores.textoSuave }}>{animal.nomeCientifico}</Text>
            <View style={{ marginTop: 6 }}>
              <StatusBadge status={animal.statusConservacao} />
            </View>
          </View>

          {animal.nomesRegionais?.length > 0 && (
            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 13, fontWeight: '700', letterSpacing: 0.5, color: cores.verde }}>
                TAMBÉM CHAMADO DE
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {animal.nomesRegionais.map((n) => (
                  <View
                    key={n}
                    style={{ height: 36, paddingHorizontal: 16, borderRadius: 18, justifyContent: 'center', backgroundColor: cores.branco, borderWidth: 1.5, borderColor: cores.borda }}
                  >
                    <Text style={{ fontSize: 14, fontWeight: '600', color: cores.verdeEscuro }}>{n}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <Secao titulo="Alimentação">
            <View style={{ alignSelf: 'flex-start', height: 28, paddingHorizontal: 12, borderRadius: 14, justifyContent: 'center', backgroundColor: cores.verde }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: cores.branco }}>
                {ALIMENTACAO[animal.tipoAlimentacao] ?? animal.tipoAlimentacao}
              </Text>
            </View>
            <Text style={{ fontSize: 14, lineHeight: 22, color: cores.texto }}>{animal.descricaoAlimentacao}</Text>
          </Secao>

          <Secao titulo="Comportamento">
            <Text style={{ fontSize: 14, lineHeight: 22, color: cores.texto }}>{animal.comportamento}</Text>
          </Secao>

          {animal.informacoesAdicionais?.length > 0 && (
            <Secao titulo="Curiosidades" fundo={cores.verdeSecao}>
              {animal.informacoesAdicionais.map((c, i) => (
                <Text key={i} style={{ fontSize: 14, lineHeight: 22, color: cores.texto }}>
                  • {c}
                </Text>
              ))}
            </Secao>
          )}
        </View>
      </ScrollView>

      <Pressable
        onPress={() => navigation.goBack()}
        accessibilityRole="button"
        accessibilityLabel="Voltar ao catálogo"
        style={{
          position: 'absolute',
          top: insets.top + 12,
          left: 20,
          width: 44,
          height: 44,
          borderRadius: 22,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: cores.branco,
        }}
      >
        <Text style={{ fontSize: 24, color: cores.verdeEscuro, marginTop: -2 }}>‹</Text>
      </Pressable>
    </View>
  );
}