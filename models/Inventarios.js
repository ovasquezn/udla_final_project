import { DataTypes } from 'sequelize';
import db from '../db.js';
import { Empresas } from './Empresas.js';

const Inventarios = db.define('inventarios', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  empresaId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Empresas,
      key: 'id',
    },
  },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    unidad: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
    },
    bodega: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    encargado: {
      type: DataTypes.STRING,
      allowNull: true,
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
  
export { Inventarios };