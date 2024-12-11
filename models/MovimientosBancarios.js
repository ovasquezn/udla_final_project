import { DataTypes } from 'sequelize';
import db from '../db.js';
import { Empresas } from './Empresas.js';

const MovimientosBancarios = db.define('movimientos_bancarios', {
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
  banco_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  categoria: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  detalle: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  monto: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tipo: {
    type: DataTypes.ENUM('gasto', 'abono'),
    allowNull: false,
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'aprobado', 'rechazado'),
    allowNull: false,
    defaultValue: 'aprobado',
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

export { MovimientosBancarios };
