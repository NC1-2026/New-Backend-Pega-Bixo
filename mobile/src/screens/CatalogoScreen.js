import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { listarAnimais } from '../services/api';
import AnimalCard from '../components/AnimalCard';
import { ALIMENTACAO } from '../utils/labels';
import { cores } from '../theme';

const normalizar = (t) =>
  String(t ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export default function CatalogoScreen({ navigation }) {
  const [animais, setAnimais] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [busca, setBusca] = useState('');
  const [tipo, setTipo] = useState(null);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const dados = await listarAnimais({ limite: 100 });
      setAnimais(dados.animais ?? []);
    } catch (e) {
      setErro('Não foi possível carregar os animais. Verifique a conexão e tente de novo.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const tipos = useMemo(
    () => [...new Set(animais.map((a) => a.tipoAlimentacao))].filter(Boolean),
    [animais]
  );

  const visiveis = useMemo(() => {
    const termo = normalizar(busca.trim());
    return animais.filter((a) => {
      if (tipo && a.tipoAlimentacao !== tipo) return false;
      if (!termo) return true;
      const alvos = [a.nome, a.nomeCientifico, ...(a.nomesRegionais ?? [])];
      return alvos.some((t) => normalizar(t).includes(termo));
    });
  }, [animais, busca, tipo]);

  const chip = (rotulo, ativo, aoTocar, chave) => (
    <Pressable
      key={chave}
      onPress={aoTocar}
      style={{
        height: 44,
        paddingHorizontal: 18,
        borderRadius: 22,
        justifyContent: 'center',
        marginRight: 8,
        backgroundColor: ativo ? cores.verdeEscuro : cores.branco,
        borderWidth: 1.5,
        borderColor: ativo ? cores.verdeEscuro : cores.borda,
      }}
    >
      <Text style={{ fontSize: 14, fontWeight: ativo ? '700' : '600', color: ativo ? cores.branco : cores.verdeEscuro }}>
        {rotulo}
      </Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: cores.fundo }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 12, gap: 14 }}>
        <View>
          <Text style={{ fontSize: 13, fontWeight: '600', letterSpacing: 0.5, color: cores.verde }}>
            PEGA-BIXO
          </Text>
          <Text style={{ fontSize: 30, fontWeight: '800', color: cores.verdeEscuro }}>Catálogo</Text>
        </View>

        <TextInput
          value={busca}
          onChangeText={setBusca}
          placeholder="Buscar por nome ou nome regional"
          placeholderTextColor={cores.textoSuave}
          accessibilityLabel="Buscar animal"
          style={{
            height: 48,
            paddingHorizontal: 16,
            borderRadius: 16,
            backgroundColor: cores.branco,
            borderWidth: 1.5,
            borderColor: cores.borda,
            fontSize: 14,
            color: cores.texto,
          }}
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {chip('Todos', tipo === null, () => setTipo(null), 'todos')}
          {tipos.map((t) => chip(ALIMENTACAO[t] ?? t, tipo === t, () => setTipo(t), t))}
        </ScrollView>
      </View>

      {carregando && (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <ActivityIndicator size="large" color={cores.verde} />
          <Text style={{ color: cores.textoSuave }}>Carregando animais...</Text>
        </View>
      )}

      {!carregando && erro && (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 16 }}>
          <Text style={{ textAlign: 'center', color: cores.texto }}>{erro}</Text>
          <Pressable
            onPress={carregar}
            style={{ height: 44, paddingHorizontal: 24, borderRadius: 22, justifyContent: 'center', backgroundColor: cores.verdeEscuro }}
          >
            <Text style={{ color: cores.branco, fontWeight: '700' }}>Tentar novamente</Text>
          </Pressable>
        </View>
      )}

      {!carregando && !erro && (
        <FlatList
          data={visiveis}
          keyExtractor={(a) => String(a.id)}
          numColumns={2}
          keyboardShouldPersistTaps="handled"
          columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 18 }}
          contentContainerStyle={{ paddingTop: 18, paddingBottom: 24 }}
          renderItem={({ item }) => (
            <AnimalCard animal={item} onPress={() => navigation.navigate('Detalhe', { animal: item })} />
          )}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', marginTop: 40, color: cores.textoSuave }}>
              Nenhum animal encontrado.
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
}