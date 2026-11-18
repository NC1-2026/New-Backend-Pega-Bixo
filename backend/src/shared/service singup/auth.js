const jwt = require('jsonwebtoken');

function protectAdmin(req, res, next) {
  const authHeader = req.headers?.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Nenhum token fornecido ou formato inválido.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado. Apenas administradores.' });
    }

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
}

module.exports = { protectAdmin };