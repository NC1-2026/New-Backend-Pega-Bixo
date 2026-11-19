import { buscarAnimalPorId } from './services/findAnimais.js';

export async function findAnimalController(req, res) {
  try {
    const animal = await buscarAnimalPorId(req.params.id);
    return res.status(200).json(animal);
  } catch (erro) {
    const status = erro.status || 500;
    if (status === 500) console.error(erro);

    return res.status(status).json({
      erro: status === 500 ? 'Erro interno do servidor' : erro.message,
    });
  }
}