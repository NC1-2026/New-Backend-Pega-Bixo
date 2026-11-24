// importa o service de respostas (esta na mesma pasta)
import RespostasService from './respostas.service.js';

// controller de respostas do quiz
// aqui so recebe a requisicao, chama o service e devolve a resposta
// o service coloca o status certo no erro (400, 404, 409), se nao tiver vira 500
const RespostasController = {
  // cria uma resposta nova
  async criar(req, res) {
    try {
      // o body vem assim: { texto, correta, perguntaId }
      const { texto, correta, perguntaId } = req.body;

      const resposta = await RespostasService.criar({ texto, correta, perguntaId });

      return res.status(201).json(resposta);
    } catch (erro) {
      return res.status(erro.status || 500).json({ erro: erro.message });
    }
  },

  // lista as respostas de uma pergunta
  async listarPorPergunta(req, res) {
    try {
      const respostas = await RespostasService.listarPorPergunta(req.params.perguntaId);

      return res.status(200).json(respostas);
    } catch (erro) {
      return res.status(erro.status || 500).json({ erro: erro.message });
    }
  },

  // atualiza uma resposta
  async atualizar(req, res) {
    try {
      const { texto, correta } = req.body;

      const resposta = await RespostasService.atualizar(req.params.id, { texto, correta });

      return res.status(200).json(resposta);
    } catch (erro) {
      return res.status(erro.status || 500).json({ erro: erro.message });
    }
  },

  // deleta uma resposta
  async deletar(req, res) {
    try {
      await RespostasService.deletar(req.params.id);

      // 204 = deu certo e nao precisa devolver nada
      return res.status(204).send();
    } catch (erro) {
      return res.status(erro.status || 500).json({ erro: erro.message });
    }
  },
};

export default RespostasController;