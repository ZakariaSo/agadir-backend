// src/routes/task.routes.js
import express from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  markTaskAsDone,
  getTaskStats,
} from '../controllers/taskController.js';
import {
  createTaskValidation,
  updateTaskValidation,
  taskIdValidation,
  validate,
} from '../validators/taskValidator.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// ========================================
// TOUTES LES ROUTES NÉCESSITENT UN TOKEN JWT
// ========================================
router.use(authMiddleware);

/**
 * @route   GET /api/tasks/stats
 * @desc    Obtenir des statistiques sur les tâches
 * @access  Private
 */
router.get('/stats', getTaskStats);

/**
 * @route   GET /api/tasks
 * @desc    Récupérer toutes les tâches de l'utilisateur
 * @access  Private
 * @query   status - Filtrer par statut (pending, done)
 */
router.get('/', getTasks);

/**
 * @route   GET /api/tasks/:id
 * @desc    Récupérer une tâche par son ID
 * @access  Private
 */
router.get(
  '/:id',
  taskIdValidation,
  validate,
  getTaskById
);

/**
 * @route   POST /api/tasks
 * @desc    Créer une nouvelle tâche
 * @access  Private
 */
router.post(
  '/',
  createTaskValidation,
  validate,
  createTask
);

/**
 * @route   PUT /api/tasks/:id
 * @desc    Mettre à jour une tâche
 * @access  Private
 */
router.put(
  '/:id',
  updateTaskValidation,
  validate,
  updateTask
);

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Supprimer une tâche
 * @access  Private
 */
router.delete(
  '/:id',
  taskIdValidation,
  validate,
  deleteTask
);

/**
 * @route   PATCH /api/tasks/:id/done
 * @desc    Marquer une tâche comme terminée
 * @access  Private
 */
router.patch(
  '/:id/done',
  taskIdValidation,
  validate,
  markTaskAsDone
);

export default router;