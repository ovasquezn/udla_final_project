import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import db  from '../config/db.js';

const Usuarios = db.define('usuarios', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  empresa: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nombreFormateadoEmpresa: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nombreUsuario: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Garantizamos que el nombre de usuario sea único
  },
  email: {
    type: DataTypes.STRING(60),
    allowNull: false
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
    type: DataTypes.STRING,
    allowNull: true,
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
  console.log(`Password ingresada: ${password}`);
  console.log(`Password almacenada: ${this.password}`);
  const isMatch = await bcrypt.compareSync(password, this.password);
  console.log(`¿Coinciden las contraseñas?: ${isMatch}`);
  return isMatch;
};

export { Usuarios };
