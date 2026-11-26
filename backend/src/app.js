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
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

import listAnimaisController from './features/Lista/router.listAnimais.js';
import perguntarouter from './features/pergunta/perguntas.router.js';
import criar from './features/animal/animal.router.js';
import findAnimalController from './features/Find/router.findAnimais.js';
import respostasRouter from './features/resposta/respostas.router.js';

// Identifica o diretório onde está este arquivo
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = process.env.PORT || 8081;

app.use(express.json());

// Configuração das imagens
const imagensPath = path.join(__dirname, '..', 'public', 'imagens');

console.log('Caminho das imagens:', imagensPath);
console.log('Pasta encontrada:', fs.existsSync(imagensPath));
console.log(
    'Imagem Ara-ararauna encontrada:',
    fs.existsSync(path.join(imagensPath, 'Ara-ararauna.jpg'))
);

// Disponibiliza as imagens pela rota /imagens
app.use('/imagens', express.static(imagensPath));

// Rotas originais do projeto
app.use('/perguntas', perguntarouter);

app.use('/criaranimais', criar);

app.use('/', findAnimalController);

app.use('/respostas', respostasRouter);

app.use('/listanimais', listAnimaisController);

app.listen(PORT, () => {
    console.log(`Servidor ouvindo na porta ${PORT}`);
});
