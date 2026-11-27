/* import { Text, View } from 'react-native';
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
} */

import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { listarAnimais } from '../services/api';
import { gerarQuiz } from '../utils/gerarQuiz';
import FotoAnimal from '../components/FotoAnimal';
import { cores } from '../theme';

const TOTAL = 5;

export default function QuizScreen({ navigation }) {
  const [fase, setFase] = useState('inicio'); // inicio | jogando | fim
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [perguntas, setPerguntas] = useState([]);
  const [indice, setIndice] = useState(0);
  const [escolhida, setEscolhida] = useState(null);
  const [pontos, setPontos] = useState(0);

  const comecar = async () => {
    setCarregando(true);
    setErro(null);
    try {
      const dados = await listarAnimais({ limite: 100 });
      const lista = dados.animais ?? [];
      if (lista.length < 4) {
        setErro('O catálogo precisa de pelo menos 4 animais para montar o quiz.');
        return;
      }
      setPerguntas(gerarQuiz(lista, TOTAL));
      setIndice(0);
      setPontos(0);
      setEscolhida(null);
      setFase('jogando');
    } catch (e) {
      setErro('Não foi possível carregar o quiz. Verifique a conexão e tente de novo.');
    } finally {
      setCarregando(false);
    }
  };

  const responder = (opcao) => {
    if (escolhida !== null) return; // já respondeu
    setEscolhida(opcao);
    if (opcao === perguntas[indice].correta) setPontos((p) => p + 1);
  };

  const proxima = () => {
    if (indice + 1 >= perguntas.length) {
      setFase('fim');
    } else {
      setIndice((i) => i + 1);
      setEscolhida(null);
    }
  };

  const botao = (rotulo, aoTocar, escuro = true) => (
    <Pressable
      onPress={aoTocar}
      accessibilityRole="button"
      style={{
        height: 54,
        paddingHorizontal: 28,
        borderRadius: 27,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: escuro ? cores.verdeEscuro : cores.branco,
        borderWidth: escuro ? 0 : 1.5,
        borderColor: cores.borda,
      }}
    >
      <Text style={{ fontSize: 16, fontWeight: '700', color: escuro ? cores.branco : cores.verdeEscuro }}>
        {rotulo}
      </Text>
    </Pressable>
  );

  // ---------- Início ----------
  if (fase === 'inicio') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: cores.fundo }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 16 }}>
          <Text style={{ fontSize: 40, fontWeight: '800', color: cores.verdeEscuro }}>Quiz</Text>
          <Text style={{ textAlign: 'center', fontSize: 16, lineHeight: 24, color: cores.texto }}>
            Teste seus conhecimentos sobre a fauna brasileira! São {TOTAL} perguntas.
          </Text>
          {erro && <Text style={{ textAlign: 'center', color: '#7A1F14' }}>{erro}</Text>}
          {carregando ? <ActivityIndicator size="large" color={cores.verde} /> : botao('Começar quiz', comecar)}
        </View>
      </SafeAreaView>
    );
  }

  // ---------- Resultado ----------
  if (fase === 'fim') {
    const mensagem =
      pontos === perguntas.length ? 'Perfeito! Você é expert em fauna!' :
      pontos >= perguntas.length / 2 ? 'Muito bem! Continue explorando o catálogo.' :
      'Que tal revisar o catálogo e tentar de novo?';

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: cores.fundo }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: cores.verde }}>SEU RESULTADO</Text>
          <Text style={{ fontSize: 64, fontWeight: '800', color: cores.verdeEscuro }}>
            {pontos}/{perguntas.length}
          </Text>
          <Text style={{ textAlign: 'center', fontSize: 16, lineHeight: 24, color: cores.texto }}>{mensagem}</Text>
          <View style={{ gap: 12, alignItems: 'stretch', alignSelf: 'stretch', marginTop: 12 }}>
            {botao('Jogar novamente', comecar)}
            {botao('Voltar ao catálogo', () => navigation.navigate('Catalogo'), false)}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ---------- Pergunta ----------
  const p = perguntas[indice];
  const respondeu = escolhida !== null;

  const estiloOpcao = (opcao) => {
    if (!respondeu) return { fundo: cores.branco, borda: cores.borda, texto: cores.verdeEscuro };
    if (opcao === p.correta) return { fundo: cores.verdeClaro, borda: cores.verde, texto: cores.verdeEscuro };
    if (opcao === escolhida) return { fundo: '#F4D2CC', borda: '#7A1F14', texto: '#7A1F14' };
    return { fundo: cores.branco, borda: cores.borda, texto: cores.textoSuave };
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: cores.fundo }}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: cores.verde }}>
            Pergunta {indice + 1}/{perguntas.length}
          </Text>
          <Text style={{ fontSize: 14, fontWeight: '700', color: cores.verdeEscuro }}>{pontos} pontos</Text>
        </View>

        <View style={{ height: 8, borderRadius: 4, backgroundColor: cores.verdeClaro }}>
          <View
            style={{
              height: 8,
              borderRadius: 4,
              backgroundColor: cores.verde,
              width: `${((indice + (respondeu ? 1 : 0)) / perguntas.length) * 100}%`,
            }}
          />
        </View>

        {p.foto && <FotoAnimal uri={p.foto} style={{ width: '100%', height: 220, borderRadius: 20 }} />}

        <Text style={{ fontSize: 22, fontWeight: '800', lineHeight: 30, color: cores.verdeEscuro }}>{p.texto}</Text>

        <View style={{ gap: 10 }}>
          {p.opcoes.map((opcao) => {
            const e = estiloOpcao(opcao);
            return (
              <Pressable
                key={opcao}
                onPress={() => responder(opcao)}
                disabled={respondeu}
                accessibilityRole="button"
                style={{
                  minHeight: 56,
                  paddingHorizontal: 18,
                  paddingVertical: 12,
                  borderRadius: 18,
                  justifyContent: 'center',
                  backgroundColor: e.fundo,
                  borderWidth: 1.5,
                  borderColor: e.borda,
                }}
              >
                <Text style={{ fontSize: 15, fontWeight: '600', color: e.texto }}>{opcao}</Text>
              </Pressable>
            );
          })}
        </View>

        {respondeu && (
          <View style={{ gap: 12 }}>
            <View style={{ padding: 16, borderRadius: 18, backgroundColor: cores.verdeSecao, gap: 6 }}>
              <Text style={{ fontSize: 16, fontWeight: '800', color: cores.verdeEscuro }}>
                {escolhida === p.correta ? 'Acertou! 🎉' : 'Quase lá!'}
              </Text>
              {escolhida !== p.correta && (
                <Text style={{ fontSize: 14, color: cores.texto }}>Resposta certa: {p.correta}</Text>
              )}
              {p.explicacao && (
                <Text style={{ fontSize: 14, lineHeight: 22, color: cores.texto }}>
                  Curiosidade: {p.explicacao}
                </Text>
              )}
            </View>
            {botao(indice + 1 >= perguntas.length ? 'Ver resultado' : 'Próxima pergunta', proxima)}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}