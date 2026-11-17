const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const JWT_SECRET = 'votre_cle_secrete_ultra_securisee';

const fauxUtilisateurEnBase = {
  id: 1,
  email: 'utilisateur@exemple.com',
  
  passwordHash: '$2b$10$X7vW5zQj0G9f1q8wE2rT3uK4l5m6n7o8p9q0r1s2t3u4v5w6x7y8z' 
};

app.post('/api/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    
    if (email !== fauxUtilisateurEnBase.email) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
    }

    const passwordValid = await bcrypt.compare(password, fauxUtilisateurEnBase.passwordHash);
    if (!passwordValid) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
    }

    const token = jwt.sign(
      { userId: fauxUtilisateurEnBase.id, email: fauxUtilisateurEnBase.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      message: 'Connexion réussie',
      token: token
    });

  } catch (error) {
    return res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
});

app.listen(3000, () => {
  console.log('Serveur backend démarré sur le port 3000');
});