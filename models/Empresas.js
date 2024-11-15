import { DataTypes } from 'sequelize';
import db from '../db.js';

// pendiente de implementar, ademas tener cuidado con los duplicados
function generarIdEmpresa() {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < 10; i++) { // Longitud de 10 caracteres
    id += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return id;
}

const Empresas = db.define('empresas', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
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
  email: {
    type: DataTypes.STRING,
  },
  numero_fiscal: {
    type: DataTypes.STRING,
  },
  licencia: {
    type: DataTypes.ENUM('gratis','basica','estandar', 'premium', 'test'),
    defaultValue: 'premium',
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  fecha_actualizacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {  
  timestamps: true,
  createdAt: 'fecha_creacion',
  updatedAt: 'fecha_actualizacion',
});

export { Empresas };
