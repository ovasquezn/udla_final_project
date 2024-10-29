import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import db from '../config/db.js';
import { Empresas } from './Empresas.js'; // Importar el modelo de empresas

const Usuarios = db.define('usuarios', {
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
    defaultValue: true, // El usuario está activo por defecto
  },
  licencia: {
    type: DataTypes.ENUM('gratis','basica','estandar', 'premium', 'test'),
    defaultValue: 'gratis',
    allowNull: true,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  empresaId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'empresas',
      key: 'id',
    },
  },
  colaboradorId: {
    type: DataTypes.INTEGER,
    allowNull: true,  // Esta clave es opcional
    references: {
      model: 'colaboradores',
      key: 'id',
    }
  },
}, {
  hooks: {
      beforeCreate: async function(usuario) {
          const salt = await bcrypt.genSalt(10);
          usuario.password = await bcrypt.hash(usuario.password, salt);
      }
  }
});

// Relacionar usuarios con empresas
Usuarios.belongsTo(Empresas, { foreignKey: 'empresaId', as: 'empresa' });

Usuarios.prototype.verificarPassword = async function(password) {
  const isMatch = await bcrypt.compareSync(password, this.password);
  return isMatch;
};

export { Usuarios };
