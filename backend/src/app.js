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
import listAnimaisRouter from './features/router.listAnimais.js';
import findAnimaisRouter from './features/router.findAnimais.js';
import criar from './features/animal/animal.router.js';
import findAnimalController from './features/Find/router.findAnimais.js';


const app = express();

const PORT = 8081;

app.use(express.json());



app.use('/listanimais', listAnimaisRouter);

app.use('/findanimais', findAnimaisRouter);

app.use('/criaranimais', criar);

app.use('/animais/:id', findAnimalController);