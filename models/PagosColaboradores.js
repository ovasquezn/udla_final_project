import { DataTypes } from 'sequelize';
import db from '../config/db.js';
import { Empresas } from './Empresas.js';
import { Colaboradores } from './Colaboradores.js';

const PagosColaboradores = db.define('pagos_colaboradores', {
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
    monto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  }, {
    timestamps: false,
    tableName: 'pagos_colaboradores',
  });
  
  export { PagosColaboradores };