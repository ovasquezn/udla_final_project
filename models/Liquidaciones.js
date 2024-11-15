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
  fecha_emision: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  mes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 12,
    },
  },
  anio: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  estado: {
    type: DataTypes.ENUM('Pendiente de crear', 'Pendiente de aceptar', 'Aceptada', 'Pagada'),
    defaultValue: 'Pendiente de crear',
    allowNull: false,
  },
  dias_trabajados: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  horas_extras: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  sueldo: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  liquido: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  afp: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  retenciones: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  salud: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  seguro_cesantia: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  otros_items: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  documento_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  detalle: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: true,
  createdAt: 'fecha_creacion',
  updatedAt: 'fecha_actualizacion'
});

export { Liquidaciones };
