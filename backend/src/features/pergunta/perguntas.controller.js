// importa o service de perguntas (esta na mesma pasta)
import PerguntasService from './perguntas.service.js';

// controller de perguntas do quiz
// aqui so recebe a requisicao, chama o service e devolve a resposta
const PerguntasController = {
  // cadastra uma pergunta nova
  async criar(req, res) {
    try {
      // o body vem assim: { texto, respostas: [{ texto, correta }] }
      const { texto, respostas } = req.body;

      const pergunta = await PerguntasService.criar({ texto, respostas });

      return res.status(201).json(pergunta);
    } catch (erro) {
      return res.status(400).json({ erro: erro.message });
    }
  },

  // lista todas as perguntas
  async listar(req, res) {
    try {
      const perguntas = await PerguntasService.listar();

      return res.status(200).json(perguntas);
    } catch (erro) {
      return res.status(500).json({ erro: erro.message });
    }
  },

  // busca uma pergunta pelo id
  async buscarPorId(req, res) {
    try {
      const pergunta = await PerguntasService.buscarPorId(req.params.id);

      return res.status(200).json(pergunta);
    } catch (erro) {
      return res.status(404).json({ erro: erro.message });
    }
  },

  // verifica se a resposta escolhida esta certa
  async verificarResposta(req, res) {
    try {
      // o id da pergunta vem na url e o id da resposta vem no body
      const { id } = req.params;
      const { respostaId } = req.body;

      const resultado = await PerguntasService.verificarResposta(id, respostaId);

      return res.status(200).json(resultado);
    } catch (erro) {
      return res.status(400).json({ erro: erro.message });
    }
  },

  // deleta uma pergunta pelo id
  async deletar(req, res) {
    try {
      await PerguntasService.deletar(req.params.id);

      // 204 = deu certo e nao precisa devolver nada
      return res.status(204).send();
    } catch (erro) {
      return res.status(404).json({ erro: erro.message });
    }
  },
};

export default PerguntasController;