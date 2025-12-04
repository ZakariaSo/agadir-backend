// src/models/User.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import bcrypt from 'bcrypt';

// Définir le modèle User
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Le nom ne peut pas être vide',
      },
      len: {
        args: [2, 255],
        msg: 'Le nom doit contenir entre 2 et 255 caractères',
      },
    },
  },
  
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: {
      msg: 'Cet email est déjà utilisé',
    },
    validate: {
      isEmail: {
        msg: 'Email invalide',
      },
    },
  },
  
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      len: {
        args: [6, 255],
        msg: 'Le mot de passe doit contenir au moins 6 caractères',
      },
    },
  },
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
  },
});

// Méthode pour comparer le mot de passe
User.prototype.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// Méthode pour obtenir l'utilisateur sans le mot de passe
User.prototype.toJSON = function() {
  const values = { ...this.get() };
  delete values.password;
  return values;
};

export default User;