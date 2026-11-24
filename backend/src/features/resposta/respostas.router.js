import { Router } from 'express';
import RespostasController from './respostas.controller.js';

// rotas de respostas do quiz
const router = Router();

// POST /respostas -> cria uma resposta
router.post('/', RespostasController.criar);

// GET /respostas/pergunta/:perguntaId -> lista as respostas de uma pergunta
router.get('/pergunta/:perguntaId', RespostasController.listarPorPergunta);

// PUT /respostas/:id -> atualiza uma resposta
router.put('/:id', RespostasController.atualizar);

// DELETE /respostas/:id -> deleta uma resposta
router.delete('/:id', RespostasController.deletar);

export default router;