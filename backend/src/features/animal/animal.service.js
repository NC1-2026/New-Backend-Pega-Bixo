import {
  criarAnimal,
  buscarAnimalPorNome,
  buscarPorNomeCientifico,
} from '../../shared/animal/repository/animais.repository.js';

const TIPOS_ALIMENTACAO = new Set([
  'CARNIVORO',
  'HERBIVORO',
  'ONIVORO',
  'FRUGIVORO',
  'INSETIVORO',
  'PISCIVORO',
  'NECTARIVORO',
  'DETRITIVORO',
]);

const STATUS_CONSERVACAO = new Set([
  'NAO_AVALIADO',
  'DADOS_INSUFICIENTES',
  'POUCO_PREOCUPANTE',
  'QUASE_AMEACADO',
  'VULNERAVEL',
  'EM_PERIGO',
  'CRITICAMENTE_EM_PERIGO',
  'EXTINTO_NA_NATUREZA',
  'EXTINTO',
]);

const vazio = (valor) =>
  typeof valor !== 'string' || valor.trim() === '';

function erro(status, mensagem) {
  const error = new Error(mensagem);
  error.status = status;
  return error;
}

function validarLista(lista, campo) {
  if (
    !Array.isArray(lista) ||
    lista.some((item) => typeof item !== 'string' || item.trim() === '')
  ) {
    throw erro(400, `"${campo}" deve ser uma lista de textos não vazios.`);
  }

  return lista.map((item) => item.trim());
}

export async function cadastrarAnimal(dados) {
  const {
    nome,
    nomesRegionais = [],
    nomeCientifico,
    comportamento,
    tipoAlimentacao,
    descricaoAlimentacao,
    statusConservacao,
    informacoesAdicionais = [],
    imagemUrl = null,
  } = dados ?? {};

  if (vazio(nome)) throw erro(400, 'Informe o nome do animal.');
  if (vazio(nomeCientifico)) throw erro(400, 'Informe o nome científico.');
  if (vazio(comportamento)) throw erro(400, 'Informe o comportamento.');
  if (vazio(descricaoAlimentacao)) {
    throw erro(400, 'Informe a descrição da alimentação.');
  }
  if (!TIPOS_ALIMENTACAO.has(tipoAlimentacao)) {
    throw erro(400, 'O tipo de alimentação informado não é válido.');
  }
  if (!STATUS_CONSERVACAO.has(statusConservacao)) {
    throw erro(400, 'O status de conservação informado não é válido.');
  }

  let imagemValidada = null;

  if (imagemUrl !== null) {
    if (vazio(imagemUrl)) throw erro(400, 'Informe uma URL de imagem válida.');

    try {
      const url = new URL(imagemUrl.trim());
      if (!['http:', 'https:'].includes(url.protocol)) throw new Error();
      imagemValidada = url.toString();
    } catch {
      throw erro(400, 'A URL da imagem deve começar com http:// ou https://.');
    }
  }

  const nomeLimpo = nome.trim();
  const nomeCientificoLimpo = nomeCientifico.trim();

  if (await buscarAnimalPorNome(nomeLimpo)) {
    throw erro(409, `Já existe um animal cadastrado com o nome "${nomeLimpo}".`);
  }

  if (await buscarPorNomeCientifico(nomeCientificoLimpo)) {
    throw erro(409, `O nome científico "${nomeCientificoLimpo}" já está cadastrado.`);
  }

  return criarAnimal({
    data: {
      nome: nomeLimpo,
      nomesRegionais: validarLista(nomesRegionais, 'nomesRegionais'),
      nomeCientifico: nomeCientificoLimpo,
      comportamento: comportamento.trim(),
      tipoAlimentacao,
      descricaoAlimentacao: descricaoAlimentacao.trim(),
      statusConservacao,
      informacoesAdicionais: validarLista(
        informacoesAdicionais,
        'informacoesAdicionais'
      ),
      imagemUrl: imagemValidada,
      atualizadoEm: new Date(),
    },
  });
}