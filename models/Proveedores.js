import { DataTypes } from 'sequelize';
import db from '../config/db.js';
import { Empresas } from './Empresas.js';

const Proveedores = db.define('proveedores', {
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
  nombre_proveedor: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contacto: {
    type: DataTypes.STRING,
  },
  direccion: {
    type: DataTypes.STRING,
  },
  telefono: {
    type: DataTypes.STRING,
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


export { Proveedores };
