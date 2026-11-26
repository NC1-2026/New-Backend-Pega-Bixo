export const ALIMENTACAO = {
  CARNIVORO: 'Carnívoro',
  HERBIVORO: 'Herbívoro',
  ONIVORO: 'Onívoro',
  FRUGIVORO: 'Frugívoro',
  INSETIVORO: 'Insetívoro',
  PISCIVORO: 'Piscívoro',
  NECTARIVORO: 'Nectarívoro',
  DETRITIVORO: 'Detritívoro',
};

const NEUTRO = { fundo: '#E4E7E4', texto: '#3B4540' };

export const STATUS = {
  NAO_AVALIADO: { rotulo: 'Não avaliado', ...NEUTRO },
  DADOS_INSUFICIENTES: { rotulo: 'Dados insuficientes', ...NEUTRO },
  POUCO_PREOCUPANTE: { rotulo: 'Pouco preocupante', fundo: '#DDEBDD', texto: '#1F4D36' },
  QUASE_AMEACADO: { rotulo: 'Quase ameaçado', fundo: '#EEF0C8', texto: '#4D4F0A' },
  VULNERAVEL: { rotulo: 'Vulnerável', fundo: '#F6DFC2', texto: '#6B3A06' },
  EM_PERIGO: { rotulo: 'Em perigo', fundo: '#F4D2CC', texto: '#7A1F14' },
  CRITICAMENTE_EM_PERIGO: { rotulo: 'Criticamente em perigo', fundo: '#EFC0B8', texto: '#5E140B' },
  EXTINTO_NA_NATUREZA: { rotulo: 'Extinto na natureza', ...NEUTRO },
  EXTINTO: { rotulo: 'Extinto', ...NEUTRO },
};