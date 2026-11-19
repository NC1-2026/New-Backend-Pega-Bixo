import express from 'express' ;
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());

const JWT_SECRET = 'votre_cle_secrete_ultra_securisee';

const fauxUtilisateurEnBase = {
  id: 1,
  email: 'utilisateur@exemple.com',
  
  passwordHash: '123' 
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