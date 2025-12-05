// src/middlewares/errorHandler.js

/**
 * Middleware global pour gérer les erreurs
 */
const errorHandler = (err, req, res, next) => {
  console.error('🔥 Erreur:', err);

  // Erreur de validation Sequelize
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Erreurs de validation',
      errors: err.errors.map(e => ({
        field: e.path,
        message: e.message,
      })),
    });
  }

  // Erreur d'unicité (email déjà utilisé)
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      success: false,
      message: 'Cet email est déjà utilisé',
    });
  }

  // Erreur de clé étrangère
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      success: false,
      message: 'Référence invalide',
    });
  }

  // Erreur de connexion à la base de données
  if (err.name === 'SequelizeConnectionError') {
    return res.status(503).json({
      success: false,
      message: 'Erreur de connexion à la base de données',
    });
  }

  // Erreur JWT
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token invalide ou expiré',
    });
  }

  // Erreur générique
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erreur serveur interne',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;