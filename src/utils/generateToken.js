// src/utils/generateToken.js
import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwt.js';

/**
 * Génère un token JWT pour un utilisateur
 * @param {Object} user - L'utilisateur (avec id, name, email)
 * @returns {String} Token JWT
 */
const generateToken = (user) => {
  // Payload : données qu'on veut stocker dans le token
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
  };

  // Signer le token avec la clé secrète
  const token = jwt.sign(
    payload,
    jwtConfig.secret,
    {
      expiresIn: jwtConfig.expiresIn, // Expire dans 7 jours
    }
  );

  return token;
};

export default generateToken;