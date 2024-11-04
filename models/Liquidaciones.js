import { DataTypes } from 'sequelize';
import db from '../config/db.js';
import { Colaboradores } from './Colaboradores.js';
import { Empresas } from './Empresas.js';

const Liquidaciones = db.define('liquidaciones', {
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
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    detalle: {
      type: DataTypes.TEXT,
    },
  }, {
    timestamps: false,
    tableName: 'liquidaciones',
  });
  
  export { Liquidaciones };
