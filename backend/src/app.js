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


import listAnimaisRouter from './features/router.listAnimais.js';

app.use('/', listAnimaisRouter);

import findAnimaisRouter from './features/router.findAnimais.js';

app.use('/', findAnimaisRouter);