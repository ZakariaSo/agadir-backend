// src/controllers/taskController.js
import Task from '../models/Task.js';
import User from '../models/User.js';
import { Op } from 'sequelize';

/**
 * @route   GET /api/tasks
 * @desc    Récupérer toutes les tâches de l'utilisateur connecté
 * @access  Private (JWT requis)
 * @query   status (optional) - Filtrer par statut: pending, done
 */
export const getTasks = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { status } = req.query; // Récupérer le paramètre ?status=pending

    // Construire le filtre
    const where = { user_id: userId };

    // Si un statut est spécifié, l'ajouter au filtre
    if (status && ['pending', 'done'].includes(status)) {
      where.status = status;
    }

    // Récupérer les tâches
    const tasks = await Task.findAll({
      where,
      order: [['due_date', 'ASC']], // Trier par date limite (plus proche d'abord)
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'], // Inclure les infos de l'utilisateur
        },
      ],
    });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: { tasks },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/tasks/:id
 * @desc    Récupérer une tâche par son ID
 * @access  Private (JWT requis)
 */
export const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Rechercher la tâche
    const task = await Task.findOne({
      where: {
        id,
        user_id: userId, // S'assurer que la tâche appartient à l'utilisateur
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    // Si la tâche n'existe pas
    if (!task) {
      return res.status(404).json({
        success: false,
        message: '❌ Tâche non trouvée',
      });
    }

    res.status(200).json({
      success: true,
      data: { task },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/tasks
 * @desc    Créer une nouvelle tâche
 * @access  Private (JWT requis)
 */
export const createTask = async (req, res, next) => {
  try {
    const { title, description, due_date, status } = req.body;
    const userId = req.user.id;

    // Créer la tâche
    const task = await Task.create({
      user_id: userId,
      title,
      description,
      due_date,
      status: status || 'pending', // Par défaut: pending
    });

    // Récupérer la tâche avec les relations
    const createdTask = await Task.findByPk(task.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: '✅ Tâche créée avec succès',
      data: { task: createdTask },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/tasks/:id
 * @desc    Mettre à jour une tâche
 * @access  Private (JWT requis)
 */
export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { title, description, due_date, status } = req.body;

    // Rechercher la tâche
    const task = await Task.findOne({
      where: {
        id,
        user_id: userId,
      },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: '❌ Tâche non trouvée',
      });
    }

    // Mettre à jour les champs fournis
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (due_date !== undefined) task.due_date = due_date;
    if (status !== undefined) task.status = status;

    // Sauvegarder les modifications
    await task.save();

    // Récupérer la tâche mise à jour avec les relations
    const updatedTask = await Task.findByPk(task.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    res.status(200).json({
      success: true,
      message: '✅ Tâche mise à jour avec succès',
      data: { task: updatedTask },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Supprimer une tâche
 * @access  Private (JWT requis)
 */
export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Rechercher la tâche
    const task = await Task.findOne({
      where: {
        id,
        user_id: userId,
      },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: '❌ Tâche non trouvée',
      });
    }

    // Supprimer la tâche
    await task.destroy();

    res.status(200).json({
      success: true,
      message: '✅ Tâche supprimée avec succès',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/tasks/:id/done
 * @desc    Marquer une tâche comme terminée
 * @access  Private (JWT requis)
 */
export const markTaskAsDone = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Rechercher la tâche
    const task = await Task.findOne({
      where: {
        id,
        user_id: userId,
      },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: '❌ Tâche non trouvée',
      });
    }

    // Vérifier si la tâche est déjà terminée
    if (task.status === 'done') {
      return res.status(400).json({
        success: false,
        message: '⚠️ Cette tâche est déjà terminée',
      });
    }

    // Marquer comme terminée
    task.status = 'done';
    await task.save();

    // Récupérer la tâche mise à jour
    const updatedTask = await Task.findByPk(task.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    res.status(200).json({
      success: true,
      message: '✅ Tâche marquée comme terminée',
      data: { task: updatedTask },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/tasks/stats
 * @desc    Obtenir des statistiques sur les tâches de l'utilisateur
 * @access  Private (JWT requis)
 */
export const getTaskStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Compter les tâches par statut
    const totalTasks = await Task.count({ where: { user_id: userId } });
    const pendingTasks = await Task.count({ where: { user_id: userId, status: 'pending' } });
    const doneTasks = await Task.count({ where: { user_id: userId, status: 'done' } });

    // Compter les tâches en retard (due_date dépassée et status = pending)
    const overdueTasks = await Task.count({
      where: {
        user_id: userId,
        status: 'pending',
        due_date: {
          [Op.lt]: new Date(), // lt = less than (inférieur à aujourd'hui)
        },
      },
    });

    res.status(200).json({
      success: true,
      data: {
        stats: {
          total: totalTasks,
          pending: pendingTasks,
          done: doneTasks,
          overdue: overdueTasks,
          completion_rate: totalTasks > 0 ? ((doneTasks / totalTasks) * 100).toFixed(2) : 0,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};