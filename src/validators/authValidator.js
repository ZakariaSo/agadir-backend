// src/validators/authValidator.js
import { body, validationResult } from 'express-validator';


export const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Le nom est obligatoire')
    .isLength({ min: 2, max: 255 }).withMessage('Le nom doit contenir entre 2 et 255 caractères'),

  body('email')
    .trim()
    .notEmpty().withMessage('L\'email est obligatoire')
    .isEmail().withMessage('Email invalide')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Le mot de passe est obligatoire')
    .isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'),
];


export const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('L\'email est obligatoire')
    .isEmail().withMessage('Email invalide')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Le mot de passe est obligatoire'),
];


export const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Erreurs de validation',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  
  next();
};