import { Router } from 'express';
import PerguntasController from './perguntas.controller.js';

// rotas de perguntas do quiz
const router = Router();

// POST /perguntas -> cadastra uma pergunta
router.post('/', PerguntasController.criar);

// GET /perguntas -> lista todas as perguntas
router.get('/', PerguntasController.listar);

// GET /perguntas/:id -> busca uma pergunta
router.get('/:id', PerguntasController.buscarPorId);

// POST /perguntas/:id/verificar -> verifica se a resposta esta certa
router.post('/:id/verificar', PerguntasController.verificarResposta);

// DELETE /perguntas/:id -> deleta uma pergunta
router.delete('/:id', PerguntasController.deletar);

export default router;