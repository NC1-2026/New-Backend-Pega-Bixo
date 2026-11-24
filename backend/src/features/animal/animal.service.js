import { criarAnimal, buscarAnimalPorNome } from '../../shared/animal/repository/animais.repository.js';

const CAMPOS = {
  especie: 'a espécie',
  habitats: 'os habitats',
  foto: 'o link da foto',
  alimentacao: 'a alimentação',
  conservacao: 'o estado de conservação',
};

const vazio = (v) => typeof v !== 'string' || v.trim() === '';

function erro(status, mensagem) {
  const e = new Error(mensagem);
  e.status = status;
  return e;
}

export async function cadastrarAnimal(dados) {
  const { nome, descricao } = dados ?? {};

  if (vazio(nome)) throw erro(400, 'Ops! Esqueceu de dar um nome para o bicho.');
  if (!descricao || typeof descricao !== 'object') throw erro(400, 'Faltou a descrição do animal.');

  for (const [campo, rotulo] of Object.entries(CAMPOS)) {
    if (vazio(descricao[campo])) throw erro(400, `Faltou informar ${rotulo} do animal.`);
  }

  try { new URL(descricao.foto); }
  catch { throw erro(400, 'O link da foto não parece válido. Use algo como https://site.com/foto.jpg'); }

  const nomeLimpo = nome.trim();
  if (await buscarAnimalPorNome(nomeLimpo)) {
    throw erro(409, `Já temos um(a) "${nomeLimpo}" cadastrado(a) por aqui.`);
  }

  return criarAnimal({
    nome: nomeLimpo,
    descricao: Object.fromEntries(
      Object.keys(CAMPOS).map((c) => [c, descricao[c].trim()])
    ),
  });
}