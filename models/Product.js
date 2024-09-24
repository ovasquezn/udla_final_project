const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Importa la configuración de la conexión a la base de datos

// Define el modelo de Producto
const Producto = sequelize.define('Producto', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  proveedor: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  stock_minimo: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  tableName: 'productos', // Nombre de la tabla en la base de datos
  timestamps: true, // Crea automáticamente los campos createdAt y updatedAt
  createdAt: 'fecha_creacion',
  updatedAt: 'fecha_actualizacion'
});

module.exports = Producto;