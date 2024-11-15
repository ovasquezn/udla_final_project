import { DataTypes } from 'sequelize';
import db from '../db.js';
import { Empresas } from './Empresas.js';

const FacturasEmitidas = db.define('facturas_emitidas', {
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
  clienteId: { 
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  numero_factura: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fecha_emision: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  fecha_vencimiento: {
    type: DataTypes.DATE,
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
  comentarios: {
    type: DataTypes.TEXT,
  },
}, {
  timestamps: true,
  createdAt: 'fecha_creacion',
  updatedAt: 'fecha_actualizacion',
});

export { FacturasEmitidas};
