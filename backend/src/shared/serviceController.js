const Service = require('../models/Service');

const createService = async (req, res) => {
  try {
    const { name, description, price, durationMinutes } = req.body;

    if (!name || !price || !durationMinutes) {
      return res.status(400).json({ error: 'Preencha todos os campos obrigatórios.' });
    }

    const service = await Service.create({ name, description, price, durationMinutes });

    return res.status(201).json({
      message: 'Serviço cadastrado com sucesso!',
      service
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

module.exports = { createService };