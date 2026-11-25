import { Pressable, Text, useWindowDimensions } from 'react-native';
import FotoAnimal from './FotoAnimal';
import { cores } from '../theme';

export default function AnimalCard({ animal, onPress }) {
  const { width } = useWindowDimensions();
  const lado = (width - 40 - 14) / 2;

  return (
    <Pressable
  onPress={onPress}
  accessibilityRole="button"
  accessibilityLabel={animal.nome}
  style={({ pressed }) => ({
    width: lado,
    opacity: pressed ? 0.85 : 1,
    transform: [{ scale: pressed ? 0.97 : 1 }],
  })}
>
      <FotoAnimal uri={animal.imagemUrl} style={{ width: lado, height: lado, borderRadius: 20 }} />
      <Text numberOfLines={2} style={{ marginTop: 8, fontSize: 15, fontWeight: '700', color: cores.texto }}>
        {animal.nome}
      </Text>
      <Text numberOfLines={1} style={{ fontSize: 12, fontStyle: 'italic', color: cores.textoSuave }}>
        {animal.nomeCientifico}
      </Text>
    </Pressable>
  );
}