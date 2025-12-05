// src/middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwt.js';
import User from '../models/User.js';

/**
 * Middleware pour protéger les routes (vérifie le token JWT)
 */
const authMiddleware = async (req, res, next) => {
  try {
    // 1. Récupérer le token depuis le header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: '❌ Accès refusé. Token manquant.',
      });
    }

    // 2. Extraire le token (format: "Bearer TOKEN")
    const token = authHeader.split(' ')[1];

    // 3. Vérifier et décoder le token
    const decoded = jwt.verify(token, jwtConfig.secret);

    // 4. Récupérer l'utilisateur depuis la base de données
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: '❌ Utilisateur non trouvé.',
      });
    }

    // 5. Ajouter l'utilisateur à la requête (disponible dans les controllers)
    req.user = user;

    // 6. Passer au controller suivant
    next();
  } catch (error) {
    // Token expiré ou invalide
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: '❌ Token expiré. Veuillez vous reconnecter.',
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: '❌ Token invalide.',
      });
    }

    // Autre erreur
    return res.status(500).json({
      success: false,
      message: '❌ Erreur d\'authentification.',
      error: error.message,
    });
  }
};

export default authMiddleware;