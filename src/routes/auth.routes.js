// src/routes/auth.routes.js
import express from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { 
  registerValidation, 
  loginValidation, 
  validate 
} from '../validators/authValidator.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Inscription d'un nouvel utilisateur
 * @access  Public
 */
router.post(
  '/register',
  registerValidation,  // Validation des données
  validate,            // Vérification des erreurs
  register             // Controller
);

/**
 * @route   POST /api/auth/login
 * @desc    Connexion d'un utilisateur
 * @access  Public
 */
router.post(
  '/login',
  loginValidation,
  validate,
  login
);

/**
 * @route   GET /api/auth/me
 * @desc    Obtenir le profil de l'utilisateur connecté
 * @access  Private (JWT requis)
 */
router.get(
  '/me',
  authMiddleware,  // Vérifier le token JWT
  getMe
);

export default router;