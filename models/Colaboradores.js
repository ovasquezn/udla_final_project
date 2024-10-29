
import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const Colaboradores = db.define('colaboradores', {
  empresaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'empresas',
      key: 'id', 
    }
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  apellido: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cargo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  estado: {
    type: DataTypes.ENUM('activo', 'inactivo'),
    allowNull: false,
    defaultValue: 'activo',
  },
  direccion: {
    type: DataTypes.STRING,
  },
  rut: {
    type: DataTypes.STRING,
  },
  estado_civil: {
    type: DataTypes.STRING,
  },
  cuenta_bancaria: {
    type: DataTypes.STRING,
  },
  contacto_emergencia: {
    type: DataTypes.STRING,
  },
  sueldo: {
    type: DataTypes.DECIMAL(10, 2),
  },
  fecha_ingreso: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  tipo_contrato: {
    type: DataTypes.STRING,
  },
  permiso_acceso: {
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

export { Colaboradores };
