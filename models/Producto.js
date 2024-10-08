import { DataTypes } from 'sequelize';
import db  from '../config/db.js';

const Producto = db.define('productos', {
  nombre_producto: {
    type: DataTypes.STRING,
    allowNull: false,
},
    nombre_producto_interno: {
    type: DataTypes.STRING,
    allowNull: false,
},
unidad: {
    type: DataTypes.STRING,
    allowNull: false,
},
bodega: {
    type: DataTypes.STRING,
    allowNull: false,
},
cantidad_existente: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
},
stock_bajo: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
},
proveedor: {
    type: DataTypes.STRING,
    allowNull: false,
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
precio: {
    type: DataTypes.DECIMAL(10, 2),
},
descripcion: {
    type: DataTypes.TEXT,
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


export { Producto };


