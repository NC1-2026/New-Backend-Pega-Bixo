import { cadastrarAnimal } from './animal.service.js';

export async function criar(req, res) {
  try {
    const animal = await cadastrarAnimal(req.body);

    return res.status(201).json({
      mensagem: `Pronto! ${animal.nome} agora faz parte do Pega-Bixo`,
      animal,
    });
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ mensagem: err.message });
    }

    console.error(err);
    return res.status(500).json({
      mensagem: 'Algo deu errado do nosso lado. Tente de novo em instantes.',
    });
  }
}