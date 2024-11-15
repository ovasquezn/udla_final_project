import { DataTypes } from 'sequelize';
import { Proveedores } from './Proveedores.js';
import db from '../db.js';
import { Empresas } from './Empresas.js';

const Facturas = db.define('facturas', {
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
  proveedor_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Proveedores,
      key: 'id',
    },
  },
  fecha_emision: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  fecha_vencimiento: {
    type: DataTypes.DATE,
  },
  plazo: {
    type: DataTypes.INTEGER,
  },
  numero_factura: {
    type: DataTypes.STRING,
    allowNull: false,
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