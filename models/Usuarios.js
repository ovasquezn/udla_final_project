import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import db from '../config/db.js';
import { Empresas } from './Empresas.js'; // Importar el modelo de empresas
import { Colaboradores } from './Colaboradores.js'; // Importar el modelo de colaboradores

const Usuarios = db.define('usuarios', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    set() {
      return uuidv4() + '-' + this.empresaId;
    },
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
  colaboradorId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: Colaboradores,
      key: 'id',
    },
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nombreUsuario: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING(60),
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  estadoActivo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  confirmado: DataTypes.BOOLEAN,
  permisos: {
    type: DataTypes.ENUM('propietario', 'admin', 'colaborador'),
    defaultValue: 'propietario',
    allowNull: false,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: true,
  },

}, {
  hooks: {
      beforeCreate: async function(usuario) {
          const salt = await bcrypt.genSalt(10);
          usuario.password = await bcrypt.hash(usuario.password, salt);
      }
  }
});

Usuarios.prototype.verificarPassword = async function(password) {
  const isMatch = await bcrypt.compareSync(password, this.password);
  return isMatch;
};

export { Usuarios };
