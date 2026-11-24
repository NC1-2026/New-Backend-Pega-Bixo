/* import 'dotenv/config';
import express from 'express';

import findAnimaisRouter from './features/router.findAnimais.js';
import listAnimaisRouter from './features/router.listAnimais.js';

const app = express();

app.use(express.json());

// Rota fixa (/animais/sugestoes) antes das rotas com parâmetro (/animais/:id)
app.use('/', findAnimaisRouter);
app.use('/', listAnimaisRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

export default app; */

import 'dotenv/config';
import express from "express";
import listAnimaisController from './features/Lista/router.listAnimais.js';
import perguntarouter from './features/pergunta/perguntas.router.js';
import criar from './features/animal/animal.router.js';
import findAnimalController from './features/Find/router.findAnimais.js';
import respostasRouter from './features/resposta/respostas.router.js';

const app = express();

const PORT = 8081;

app.use(express.json());

app.use('/perguntas', perguntarouter);

app.use('/listanimais', listAnimaisController);

app.use('/criaranimais', criar);

app.use('/animais/:id', findAnimalController);

app.use('/respostas', respostasRouter);
