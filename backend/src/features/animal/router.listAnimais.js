import 'dotenv/config';
import express from 'express';

import findAnimaisRouter from '../Find/router.findAnimais.js';
import listAnimaisRouter from '../Lista/router.listAnimais.js';

const app = express();

app.use(express.json());

// Rota fixa (/animais/sugestoes) antes das rotas com parâmetro (/animais/:id)
app.use('/', findAnimaisRouter);
app.use('/', listAnimaisRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

export default app;
