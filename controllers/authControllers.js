//const Usuario = require('../models/User'); // Importa el modelo de Usuario
import { Usuario } from '../models/User.js';

const register = async (req, res) => {
  const { nombre, email, password } = req.body;

  try {
    // Crear un nuevo usuario
    const nuevoUsuario = await Usuario.create({ nombre, email, password });
    res.redirect('/dashboard'); // Redirigir a la página de login después del registro
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).send('Error al registrar el usuario');
  }
};

// Función para iniciar sesión
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar el usuario por email
    const usuario = await Usuario.findOne({ where: { email } });

    if (usuario && usuario.password === password) {
      // Si las credenciales son correctas
      res.redirect('/dashboard'); // Redirigir a la página de productos después del login exitoso
    } else {
      res.status(401).send('Email o contraseña incorrectos');
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).send('Error al iniciar sesión');
  }
};

const showAuth = (req, res) => {
  res.render('test', {
      pagina: 'Autenticación'
  })
}

const test = (req, res) => {
  res.render('test', {
      pagina: 'test'
  })
}


export { 
    showAuth,
    register, 
    login,
    test,
};


