import { DataTypes } from 'sequelize';
import db from '../db.js';
import { Colaboradores } from './Colaboradores.js';
import { Empresas } from './Empresas.js';

const Documentos = db.define('documentos', {
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
    trabajador_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Colaboradores,
        key: 'id',
      },
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
    },
    archivo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    timestamps: false,
    tableName: 'documentos',
  });
  
  export { Documentos };