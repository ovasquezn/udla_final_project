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
  razon_social: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  rut: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  giro: {
    type: DataTypes.STRING,
    allowNull: true,
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
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  web: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  detalles: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  forma_pago: {
    type: DataTypes.ENUM('credito', 'contado', 'cheque', 'transferencia'),
    allowNull: false,
    defaultValue: 'contado',
  },
  plazo_pago: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
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
  indexes: [
    {
      unique: true,
      fields: ['empresaId', 'rut'],
    },
  ],
});


export { Proveedores };
