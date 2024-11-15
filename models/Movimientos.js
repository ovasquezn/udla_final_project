import { DataTypes } from 'sequelize';
import db from '../db.js';
import { Empresas } from './Empresas.js';
import { Productos } from './Productos.js';

const Movimientos = db.define('movimientos', {
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
  producto_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Productos,
      key: 'id'
    }
  },
  tipo_movimiento: {
    type: DataTypes.ENUM('entrada', 'salida'),
    allowNull: false,
  },
  cantidad: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
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

export { Movimientos };
