import { Router } from 'express';
import { sugerirAnimais } from '../Find/find_animais.js';

const router = Router();

router.get('/animais/sugestoes', async (req, res) => {
  try {
    const sugestoes = await sugerirAnimais(req.query.q);
    res.json(sugestoes);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao buscar sugestões' });
  }
});

export default router; 
