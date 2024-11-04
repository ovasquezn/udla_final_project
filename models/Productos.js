import { DataTypes } from 'sequelize';
import db from '../config/db.js';
import { Empresas } from './Empresas.js';
import { Proveedores } from './Proveedores.js';
import { Inventarios } from './Inventarios.js';

const Productos = db.define('productos', {
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
  inventario_id: {
    type: DataTypes.UUID,
    allowNull: false,
    relations: {
      model: Inventarios,
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
  nombre_producto: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
  },
  descripcion: {
    type: DataTypes.TEXT,
  },
  codigo_interno: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  codigo_barra: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
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

export { Productos };
