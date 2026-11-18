const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const serviceRoutes = require('./routes/serviceRoutes');

const app = express();
app.use(express.json());

// Conexão com o MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado ao MongoDB com sucesso!'))
  .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

// Rotas
app.use('/api/services', serviceRoutes);

// Rota temporária para gerar token de admin
app.get('/api/gerar-token-admin', (req, res) => {
  const jwt = require('jsonwebtoken');
  const token = jwt.sign(
    { id: '123456', role: 'admin' }, 
    process.env.JWT_SECRET || 'sua_chave_secreta_super_segura_aqui', 
    { expiresIn: '1h' }
  );
  res.json({ token });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});