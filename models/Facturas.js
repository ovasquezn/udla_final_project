import { DataTypes } from 'sequelize';
import { Proveedores } from './Proveedores.js';
import db from '../config/db.js';

const Facturas = db.define('facturas', {
  fecha_emision: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  fecha_vencimiento: {
    type: DataTypes.DATE,
  },
  proveedor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'proveedores',
      key: 'id',
    },
  },
  numero_factura: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  monto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  forma_pago: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  estado_pago: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
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

export { Facturas };