import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const Productos = db.define('productos', {
  inventario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  nombre_producto: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
  },
  proveedor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'proveedores',
      key: 'id',
    },
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
