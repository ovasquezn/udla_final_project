import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const Empresas = db.define('empresas', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  direccion: {
    type: DataTypes.STRING,
  },
  telefono: {
    type: DataTypes.STRING,
  },
});

export { Empresas };
