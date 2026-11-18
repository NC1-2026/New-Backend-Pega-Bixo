// importa o repositorio de perguntas
import PerguntasRepository from '../../shared/pergunta/perguntas.repository.js';

// service de perguntas do quiz
// aqui ficam as regras e validacoes, o banco fica no repositorio
const PerguntasService = {
  // cadastra uma pergunta com as respostas dela
  async criar({ texto, respostas = [] }) {
    // a pergunta precisa ter texto
    if (!texto || !texto.trim()) {
      throw new Error('A pergunta precisa ter um texto.');
    }

    // um quiz precisa de pelo menos 2 respostas pra ter o que escolher
    if (!Array.isArray(respostas) || respostas.length < 2) {
      throw new Error('A pergunta precisa ter pelo menos 2 respostas.');
    }

    // nenhuma resposta pode ficar sem texto
    const temRespostaVazia = respostas.some((r) => !r.texto || !r.texto.trim());
    if (temRespostaVazia) {
      throw new Error('Todas as respostas precisam ter texto.');
    }

    // tem que ter exatamente 1 resposta correta
    const quantidadeCorretas = respostas.filter((r) => r.correta === true).length;
    if (quantidadeCorretas !== 1) {
      throw new Error('A pergunta precisa ter exatamente 1 resposta correta.');
    }

    // limpa os espacos e garante que "correta" seja true ou false
    const respostasLimpas = respostas.map((r) => ({
      texto: r.texto.trim(),
      correta: r.correta === true,
    }));

    return PerguntasRepository.criar({
      texto: texto.trim(),
      respostas: respostasLimpas,
    });
  },

  // lista todas as perguntas
  async listar() {
    return PerguntasRepository.listar();
  },

  // busca uma pergunta pelo id
  async buscarPorId(id) {
    const pergunta = await PerguntasRepository.buscarPorId(id);

    // se nao achou, avisa
    if (!pergunta) {
      throw new Error('Pergunta nao encontrada.');
    }

    return pergunta;
  },

  // verifica se a resposta que o jogador escolheu esta certa
  async verificarResposta(perguntaId, respostaId) {
    const pergunta = await this.buscarPorId(perguntaId);

    // procura a resposta escolhida dentro das respostas da pergunta
    const respostaEscolhida = pergunta.respostas.find(
      (r) => r.id === Number(respostaId)
    );

    if (!respostaEscolhida) {
      throw new Error('Essa resposta nao pertence a essa pergunta.');
    }

    // pega a resposta certa pra mostrar caso o jogador erre
    const respostaCorreta = pergunta.respostas.find((r) => r.correta === true);

    return {
      acertou: respostaEscolhida.correta === true,
      respostaCorretaId: respostaCorreta.id,
    };
  },

  // deleta uma pergunta pelo id
  async deletar(id) {
    // confere se ela existe antes de deletar
    await this.buscarPorId(id);

    return PerguntasRepository.deletar(id);
  },
};

export default PerguntasService;