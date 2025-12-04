// src/validators/taskValidator.js
import { body, param, validationResult } from 'express-validator';

/**
 * Règles de validation pour créer une tâche
 */
export const createTaskValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Le titre est obligatoire')
    .isLength({ min: 3, max: 255 }).withMessage('Le titre doit contenir entre 3 et 255 caractères'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('La description ne peut pas dépasser 2000 caractères'),

  body('due_date')
    .notEmpty().withMessage('La date limite est obligatoire')
    .isISO8601().withMessage('Format de date invalide (utilisez YYYY-MM-DD)')
    .custom((value) => {
      const dueDate = new Date(value);
      const now = new Date();
      
      if (dueDate < now) {
        throw new Error('La date limite doit être dans le futur');
      }
      
      return true;
    }),

  body('status')
    .optional()
    .isIn(['pending', 'done']).withMessage('Le statut doit être "pending" ou "done"'),
];

/**
 * Règles de validation pour mettre à jour une tâche
 */
export const updateTaskValidation = [
  param('id')
    .isInt().withMessage('ID invalide'),

  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 255 }).withMessage('Le titre doit contenir entre 3 et 255 caractères'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('La description ne peut pas dépasser 2000 caractères'),

  body('due_date')
    .optional()
    .isISO8601().withMessage('Format de date invalide'),

  body('status')
    .optional()
    .isIn(['pending', 'done']).withMessage('Le statut doit être "pending" ou "done"'),
];

/**
 * Validation pour l'ID dans les paramètres
 */
export const taskIdValidation = [
  param('id')
    .isInt().withMessage('ID invalide')
    .toInt(),
];

/**
 * Middleware pour vérifier les erreurs de validation
 */
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