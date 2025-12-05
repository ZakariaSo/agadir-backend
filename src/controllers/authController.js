// src/controllers/authController.js
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

/**
 * @route   POST /api/auth/register
 * @desc    Inscription d'un nouvel utilisateur
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: '❌ Cet email est déjà utilisé',
      });
    }

    // Créer l'utilisateur (le password sera hashé automatiquement)
    const user = await User.create({
      name,
      email,
      password,
    });

    // Générer un token JWT
    const token = generateToken(user);

    // Réponse
    res.status(201).json({
      success: true,
      message: '✅ Inscription réussie',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          created_at: user.created_at,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Connexion d'un utilisateur
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Rechercher l'utilisateur par email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: '❌ Email ou mot de passe incorrect',
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: '❌ Email ou mot de passe incorrect',
      });
    }

    // Générer un token JWT
    const token = generateToken(user);

    // Réponse
    res.status(200).json({
      success: true,
      message: '✅ Connexion réussie',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          created_at: user.created_at,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Obtenir le profil de l'utilisateur connecté
 * @access  Private (JWT requis)
 */
export const getMe = async (req, res, next) => {
  try {
    // req.user est défini par authMiddleware
    res.status(200).json({
      success: true,
      data: {
        user: {
          id: req.user.id,
          name: req.user.name,
          email: req.user.email,
          created_at: req.user.created_at,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};