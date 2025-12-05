// src/utils/hashPassword.js
import bcrypt from 'bcrypt';

/**
 * Hashe un mot de passe
 * @param {String} password - Mot de passe en clair
 * @returns {String} Mot de passe hashé
 */
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

/**
 * Compare un mot de passe avec son hash
 * @param {String} password - Mot de passe en clair
 * @param {String} hash - Mot de passe hashé
 * @returns {Boolean} true si correspond, false sinon
 */
export const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};