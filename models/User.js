import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

// Define el modelo de Usuario
const Usuario = sequelize.define('Usuario', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'usuarios', // Nombre de la tabla en la base de datos
  timestamps: true, // Crea automáticamente los campos createdAt y updatedAt
});

export { Usuario };