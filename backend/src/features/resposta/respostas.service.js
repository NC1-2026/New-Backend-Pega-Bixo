// importa os repositorios (estao na pasta shared)
import RespostasRepository from '../../shared/resposta/repository/resposta.repository.js';
import PerguntasRepository from '../../shared/pergunta/repository/perguntas.repository.js';

// service de respostas do quiz
// aqui ficam as regras e validacoes, o banco fica no repositorio
function erro(status, mensagem) {
  const e = new Error(mensagem);
  e.status = status;
  return e;
}

// converte o id pra numero e confere se eh valido
function validarId(valor, nome) {
  const id = Number(valor);

  if (!Number.isInteger(id) || id <= 0) {
    throw erro(400, `O ${nome} precisa ser um numero valido.`);
  }

  return id;
}

const RespostasService = {
  // cria uma resposta e vincula a uma pergunta que ja existe
  async criar({ texto, correta = false, perguntaId }) {
    // a resposta precisa ter texto
    if (typeof texto !== 'string' || !texto.trim()) {
      throw erro(400, 'A resposta precisa ter um texto.');
    }

    const id = validarId(perguntaId, 'id da pergunta');

    // confere se a pergunta existe antes de criar
    const pergunta = await PerguntasRepository.buscarPorId(id);
    if (!pergunta) {
      throw erro(404, 'Pergunta nao encontrada.');
    }

    // a pergunta so pode ter 1 resposta correta
    if (correta === true && pergunta.respostas.some((r) => r.correta)) {
      throw erro(409, 'Essa pergunta ja tem uma resposta correta.');
    }

    return RespostasRepository.criar({
      texto: texto.trim(),
      correta: correta === true,
      perguntaId: id,
    });
  },

  // lista as respostas de uma pergunta
  async listarPorPergunta(perguntaId) {
    const id = validarId(perguntaId, 'id da pergunta');

    const pergunta = await PerguntasRepository.buscarPorId(id);
    if (!pergunta) {
      throw erro(404, 'Pergunta nao encontrada.');
    }

    return RespostasRepository.listarPorPergunta(id);
  },

  // atualiza o texto e/ou se a resposta eh a correta
  async atualizar(idRecebido, { texto, correta } = {}) {
    const id = validarId(idRecebido, 'id da resposta');

    if (texto === undefined && correta === undefined) {
      throw erro(400, 'Envie o texto ou o campo correta para atualizar.');
    }

    if (texto !== undefined && (typeof texto !== 'string' || !texto.trim())) {
      throw erro(400, 'A resposta precisa ter um texto.');
    }

    if (correta !== undefined && typeof correta !== 'boolean') {
      throw erro(400, 'O campo correta precisa ser true ou false.');
    }

    try {
      return await RespostasRepository.atualizar(id, {
        ...(texto !== undefined && { texto: texto.trim() }),
        ...(correta !== undefined && { correta }),
      });
    } catch (e) {
      // P2025 = o prisma nao achou a resposta
      if (e.code === 'P2025') throw erro(404, 'Resposta nao encontrada.');
      throw e;
    }
  },

  // deleta uma resposta
  async deletar(idRecebido) {
    const id = validarId(idRecebido, 'id da resposta');

    try {
      return await RespostasRepository.deletar(id);
    } catch (e) {
      if (e.code === 'P2025') throw erro(404, 'Resposta nao encontrada.');
      throw e;
    }
  },
};

export default RespostasService;