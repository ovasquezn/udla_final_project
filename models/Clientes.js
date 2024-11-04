
import { DataTypes } from 'sequelize';
import db from '../config/db.js';
import { Empresas } from './Empresas.js';

const Clientes = db.define('clientes', {
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
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    rut :{
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
    telefono: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    direccion: {
        type: DataTypes.STRING,
        allowNull: true,
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

export { Clientes };