import { listarAnimais } from './services/listAnimais.js';

export async function listAnimaisController(req, res) {
  try {
    const resultado = await listarAnimais({
      busca: req.query.busca,
      tipoAlimentacao: req.query.tipoAlimentacao,
      statusConservacao: req.query.statusConservacao,
      pagina: Number(req.query.pagina) || 1,
      limite: Number(req.query.limite) || 20,
    });

    return res.status(200).json(resultado);
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}