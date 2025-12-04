// src/models/Task.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

// Définir le modèle Task
const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Le titre ne peut pas être vide',
      },
      len: {
        args: [3, 255],
        msg: 'Le titre doit contenir entre 3 et 255 caractères',
      },
    },
  },
  
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  
  status: {
    type: DataTypes.ENUM('pending', 'done'),
    defaultValue: 'pending',
    validate: {
      isIn: {
        args: [['pending', 'done']],
        msg: 'Le statut doit être "pending" ou "done"',
      },
    },
  },
  
  due_date: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: {
        msg: 'La date limite doit être une date valide',
      },
      isAfterNow(value) {
        if (new Date(value) < new Date()) {
          throw new Error('La date limite doit être dans le futur');
        }
      },
    },
  },
}, {
  tableName: 'tasks',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

// Relations
User.hasMany(Task, {
  foreignKey: 'user_id',
  as: 'tasks',
});

Task.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

export default Task;