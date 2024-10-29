import bcrypt from 'bcrypt';
import { Usuarios } from '../models/Usuarios.js';
import { Empresas } from '../models/Empresas.js';
import e from 'express';
import { check, validationResult } from 'express-validator'
import { generarId, generarJWT } from '../helpers/tokens.js';
import jwt from 'jsonwebtoken';

const mostrar_signup = (req, res) => {
  res.render('autenticacion/signup', {
      pagina: 'Registro',
      csrfToken: req.csrfToken()
  })
}

const mostrar_login = (req, res) => {
  res.render('autenticacion/login', {
      pagina: 'Iniciar Sesión',
      csrfToken: req.csrfToken()
  })
}

const registrar_usuario = async (req, res) => {
  
  await check('nombre').notEmpty().withMessage('El nombre es obligatorio').run(req);
  await check('empresa').notEmpty().withMessage('El nombre de la empresa es obligatorio').run(req);
  await check('email').isEmail().withMessage('Ingrese un Email válido').run(req);
  await check('password').isLength({ min: 6 }).withMessage('Mínimo 6 caracteres').run(req);
  await check('password2').equals(req.body.password).withMessage('Las contraseñas no coinciden').run(req);

  let resultado = validationResult(req);

  if (!resultado.isEmpty()) {
    return res.render('autenticacion/signup', {
      pagina: 'Registro',
      errores: resultado.array(),
      csrfToken: req.csrfToken(),
      usuario: {
        nombre: req.body.nombre,
        email: req.body.email,
      },
    });
  }

  // Extraer los datos del formulario
  const { nombre, empresa, email, password } = req.body;

  // Formatear el nombre de la empresa para crear el nombre de usuario
  const nombreFormateado = empresa.toLowerCase().replace(/\s+/g, '');
  const nombreUsuario = `admin@${nombreFormateado}`;

  // Verificar si el usuario ya existe por correo electrónico
  const existeUsuario = await Usuarios.findOne({ where: { email } });

  if (existeUsuario) {
    return res.render('autenticacion/signup', {
      pagina: 'Crear cuenta',
      csrfToken: req.csrfToken(),
      errores: [{ msg: 'El email ya está registrado' }],
      usuario: {
        nombre: req.body.nombre,
        email: req.body.email,
      },
    });
  }

  // Verificar si la empresa ya existe por nombre
  const existeEmpresa = await Empresas.findOne({ where: { nombre: empresa } });

  if (existeEmpresa) {
    return res.render('autenticacion/signup', {
      pagina: 'Crear cuenta',
      csrfToken: req.csrfToken(),
      errores: [{ msg: 'La empresa ya está registrada' }],
      usuario: {
        nombre: req.body.nombre,
        email: req.body.email,
      },
    });
  }

  // Si la empresa no existe, crearla
  let nuevaEmpresa = await Empresas.create({ nombre: empresa });

  // Crear el usuario asociado a la empresa
  const usuario = await Usuarios.create({
    nombre,
    nombreFormateadoEmpresa: nombreFormateado,
    email,
    nombreUsuario,
    password, 
    token: '123', // Arreglar esto
    empresaId: nuevaEmpresa.id, 
  });

  // Renderizar la página de mensaje de confirmación
  res.render('autenticacion/mensaje', {
    pagina: 'Creación exitosa',
    mensaje: 'Hemos enviado un email de confirmación, por favor revisa tu bandeja de entrada',
  });
};

const iniciar_sesion = async (req, res) => {
  // Validaciones
  await check('nombreUsuario').notEmpty().withMessage('Ingrese un usuario').run(req);
  await check('password').notEmpty().withMessage('Ingrese una contraseña').run(req);

  let resultado = validationResult(req);

  if (!resultado.isEmpty()) {
    return res.render('autenticacion/login', {
      pagina: 'Iniciar Sesión',
      errores: resultado.array(),
      csrfToken: req.csrfToken(),
    });
  }

  const { nombreUsuario, password } = req.body;

  // Buscar el usuario y su empresa asociada
  const usuario = await Usuarios.findOne({
    where: { nombreUsuario },
    include: [{ model: Empresas, as: 'empresa' }] // Incluir la relación con la empresa
  });

  if (!usuario) {
    return res.render('autenticacion/login', {
      pagina: 'Iniciar Sesión',
      csrfToken: req.csrfToken(),
      errores: [{ msg: 'El usuario no está registrado' }],
    });
  }

  // Verificar contraseña
  if (!await usuario.verificarPassword(password)) {
    return res.render('autenticacion/login', {
      pagina: 'Iniciar Sesión',
      csrfToken: req.csrfToken(),
      errores: [{ msg: 'Contraseña incorrecta' }],
    });
  }

  // Generar el JWT token
  const token = jwt.sign({
    id: usuario.id,
    nombre: usuario.nombre,
    empresa: usuario.empresa.nombre, // Incluir la empresa en el token si es necesario
    rol: 'Administrador',
    empresaId: usuario.empresaId,
  }, 'secreto_seguro', { expiresIn: '1d' });

  // Guardar el token como cookie
  return res.cookie('_token', token, {
    httpOnly: true,  // Asegura que la cookie no pueda ser accedida por JavaScript en el cliente
    maxAge: 60 * 60 * 24 * 1000  // 1 día de duración
  }).redirect('/dashboard');
};

const recuperar_contrasena = async (req, res) => {
  // Validaciones
  await check('email').isEmail().withMessage('Ingrese un correo válido').run(req);

  let resultado = validationResult(req);

  if (!resultado.isEmpty()) {
    return res.render('autenticacion/recuperar', {
      pagina: 'Recuperar contraseña',
      errores: resultado.array(),
      csrfToken: req.csrfToken(),
    });
  }

  const { email } = req.body;

  // Verificar si el usuario existe
  const usuario = await Usuarios.findOne({ where: { email } });

  if (!usuario) {
    return res.render('autenticacion/recuperar', {
      pagina: 'Recuperar contraseña',
      errores: [{ msg: 'El correo no está registrado' }],
      csrfToken: req.csrfToken(),
    });
  }

  // Generar un token aleatorio
  const token = generarId();

  // Guardar el token en la base de datos
  usuario.token = token;
  await usuario.save();

  // Enviar un email con el token
  // ...

  // Redirigir a la página de mensaje
  res.render('autenticacion/mensaje', {
    pagina: 'Recuperar contraseña',
    mensaje: 'Hemos enviado un email con las instrucciones para recuperar tu contraseña',
  });
}

const mostrar_recuperar_contrasena = (req, res) => {
  res.render('autenticacion/recuperar_contrasena', {
    pagina: 'Recuperar contraseña',
    csrfToken: req.csrfToken(),
  });
}

const mostrar_mensaje = (req, res) => {
  res.render('autenticacion/mensaje', {
    pagina: 'Mensaje',
    mensaje: 'Mensaje de prueba',
  });
}

export { 
    mostrar_login,
    mostrar_signup,
    registrar_usuario,
    iniciar_sesion,
    recuperar_contrasena,
    mostrar_recuperar_contrasena, 
    mostrar_mensaje
};


