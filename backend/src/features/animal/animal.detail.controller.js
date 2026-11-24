import { detalharAnimal } from './animal.detail.service.js';

export async function detalhar(req, res) {
  try {
    const animal = await detalharAnimal(req.params.id);
    return res.status(200).json({ animal });
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