import { DataTypes } from 'sequelize';
import db from '../config/db.js';
import { Colaboradores } from './Colaboradores.js';

const Liquidaciones = db.define('liquidaciones', {
  empresaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'empresas',
      key: 'id',
    },
  },
    trabajador_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'colaboradores',
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
