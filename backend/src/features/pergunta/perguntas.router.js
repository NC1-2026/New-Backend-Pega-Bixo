import { Router } from 'express';
import PerguntasController from './perguntas.controller.js';

// rotas de perguntas do quiz
const perguntarouter = Router();

// POST /perguntas -> cadastra uma pergunta
perguntarouter.post('/', PerguntasController.criar);

// GET /perguntas -> lista todas as perguntas
perguntarouter.get('/', PerguntasController.listar);

// GET /perguntas/:id -> busca uma pergunta
perguntarouter.get('/:id', PerguntasController.buscarPorId);

// POST /perguntas/:id/verificar -> verifica se a resposta esta certa
perguntarouter.post('/:id/verificar', PerguntasController.verificarResposta);

// DELETE /perguntas/:id -> deleta uma pergunta
perguntarouter.delete('/:id', PerguntasController.deletar);

export default perguntarouter;