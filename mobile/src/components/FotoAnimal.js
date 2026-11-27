
import { useState } from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';
import { cores } from '../theme';

// Pede uma versão menor quando o link é do Wikimedia
const ajustar = (url) => {
  if (
    url &&
    url.includes('Special:FilePath') &&
    !url.includes('width=')
  ) {
    return `${url}${url.includes('?') ? '&' : '?'}width=600`;
  }

  return url;
};

export default function FotoAnimal({ uri, style }) {
  const [erro, setErro] = useState(false);

  if (!uri || erro) {
    return (
      <View
        style={[
          { backgroundColor: cores.borda },
          style,
        ]}
      />
    );
  }

  return (
    <Image
      source={{
        uri: ajustar(uri),
        headers: {
          'User-Agent': 'FaunaBrasileiraApp/1.0 (projeto academico)',
        },
      }}
      style={style}
      contentFit="cover"
      transition={200}
      cachePolicy="memory-disk"
      onError={(e) => {
        console.log('Falha na imagem:', uri, e.error);
        setErro(true);
      }}
    />
  );
}
