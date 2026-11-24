import 'dotenv/config';
import express from 'express';

import findAnimaisRouter from './features/router.findAnimais.js';
import listAnimaisRouter from './features/router.listAnimais.js';
// NOVO: router de perguntas
import perguntasRouter from './features/pergunta/perguntas.router.js';
// NOVO: router de respostas
import respostasRouter from './features/resposta/respostas.router.js';

const app = express();

app.use(express.json());

// Rota fixa (/animais/sugestoes) antes das rotas com parâmetro (/animais/:id)
app.use('/', findAnimaisRouter);
app.use('/', listAnimaisRouter);

// NOVO: rotas de perguntas
app.use('/perguntas', perguntasRouter);

// NOVO: rotas de respostas
app.use('/respostas', respostasRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

export default app;