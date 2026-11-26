import { Text, View } from 'react-native';
import { STATUS } from '../utils/labels';

export default function StatusBadge({ status }) {
  const info = STATUS[status] ?? STATUS.NAO_AVALIADO;

  return (
    <View
      style={{
        alignSelf: 'flex-start',
        height: 28,
        paddingHorizontal: 12,
        borderRadius: 14,
        justifyContent: 'center',
        backgroundColor: info.fundo,
      }}
    >
      <Text style={{ fontSize: 13, fontWeight: '700', color: info.texto }}>{info.rotulo}</Text>
    </View>
  );
}