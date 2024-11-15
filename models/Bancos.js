// models/Bancos.js

import { DataTypes } from 'sequelize';
import db from '../db.js';

const Bancos = db.define('bancos', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  empresaId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  nombre_banco: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  numero_cuenta: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tipo_cuenta: {
    type: DataTypes.ENUM('corriente', 'ahorro', 'cheques', 'otros'),
    allowNull: false,
  },
  saldo: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
  moneda: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'USD',
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

export { Bancos };
