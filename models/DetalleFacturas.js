import { DataTypes } from 'sequelize';
import db from '../db.js';
import { Empresas } from './Empresas.js';
import { Facturas } from './Facturas.js';
import { Productos } from './Productos.js';

const DetalleFacturas = db.define('detalle_facturas', {
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
  factura_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Facturas,
      key: 'id',
    },
  },
  producto_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Productos,
      key: 'id',
    },
  },
  nombre_producto: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  unidad: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  codigo_barra: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  cantidad: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  descuento: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0.00,
  },
  impuestos: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0.00,
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

export { DetalleFacturas };