import bcrypt from 'bcrypt';
import { Usuarios } from '../models/Usuarios.js';
import { Empresas } from '../models/Empresas.js';
import e from 'express';
import { check, validationResult } from 'express-validator'
import { generarId, generarJWT } from '../helpers/tokens.js';
import jwt from 'jsonwebtoken';
import { emailRegistro, emailRecuperar } from '../helpers/emails.js';

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

const formatearNombreEmpresa = (nombreEmpresa) => {
  return nombreEmpresa.toLowerCase().replace(/\s+/g, '');
};

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

  const { nombre, empresa, email, password } = req.body;

  const nombreFormateado = formatearNombreEmpresa(empresa);

  const nombreUsuario = `admin@${nombreFormateado}`;

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

  let nuevaEmpresa = await Empresas.create({ nombre: empresa });

  const usuario = await Usuarios.create({
    nombre,
    nombreFormateadoEmpresa: nombreFormateado,
    confirmado: true,
    email,
    nombreUsuario,
    password, 
    token: generarId(),
    empresaId: nuevaEmpresa.id, 
  });

  emailRegistro({
    nombre: usuario.nombre,
    email: usuario.email,
    token: usuario.token
})

  res.render('autenticacion/mensaje', {
    pagina: 'Creación exitosa',
    mensaje: 'Hemos enviado un email de confirmación, por favor revisa tu bandeja de entrada',
  });
};

const iniciar_sesion = async (req, res) => {

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

  const usuario = await Usuarios.findOne({
    where: { nombreUsuario },
    include: [{ model: Empresas, as: 'empresa_usuarios' }]
  });

  if (!usuario) {
    return res.render('autenticacion/login', {
      pagina: 'Iniciar Sesión',
      csrfToken: req.csrfToken(),
      errores: [{ msg: 'El usuario no está registrado' }],
    });
  }

  if (!usuario.confirmado) {
    return res.render('autenticacion/login', {
        pagina: 'Iniciar Sesión',
        csrfToken: req.csrfToken(),
        errores: [{msg: 'Confirma tu cuenta antes de iniciar sesión'}]
    })
}

  if (!await usuario.verificarPassword(password)) {
    return res.render('autenticacion/login', {
      pagina: 'Iniciar Sesión',
      csrfToken: req.csrfToken(),
      errores: [{ msg: 'Contraseña incorrecta' }],
    });
  }

  const token = jwt.sign({
    id: usuario.id,
    nombre: usuario.nombre,
    empresa: usuario.empresa_usuarios.nombre,
    permisos: usuario.permisos,
    empresaId: usuario.empresaId,
  }, 'secreto_seguro', { expiresIn: '1d' });

  if (usuario.permisos === 'colaborador') {
    return res.cookie('_token', token, {
        httpOnly: true,  
        maxAge: 60 * 60 * 24 * 1000 
      }).redirect(`/recursos_humanos/perfil_colaborador/${usuario.id}`);
  } else {
    return res.cookie('_token', token, {
      httpOnly: true, 
      maxAge: 60 * 60 * 24 * 1000
      }).redirect('/dashboard');
  }
};

const confirmar_token = async (req, res) => {
  const usuario = await Usuarios.findOne({where: {token: req.params.token}})

  if (!usuario) {
      return res.render('autenticacion/confirmar', {
          pagina: 'Error',
          mensaje: 'El token no es válido',
          error: true
      })
  }

  usuario.confirmado = true;
  usuario.token = null;
  await usuario.save();

  res.render('autenticacion/confirmar', {
      pagina: 'Cuenta activada',
      cuenta_activada: true,
      mensaje: 'Tu cuenta ha sido activada correctamente'
  })
}

const recuperar_contrasena = async (req, res) => {

  await check('email').isEmail().withMessage('Ingrese un correo válido').run(req);

  let resultado = validationResult(req);

  if (!resultado.isEmpty()) {
    return res.render('autenticacion/mensaje', {
      pagina: 'Recuperar contraseña',
      errores: resultado.array(),
      csrfToken: req.csrfToken(),
    });
  }

  const { email } = req.body;

  const usuario = await Usuarios.findOne({ where: { email } });

  if (!usuario) {
    return res.render('autenticacion/mensaje', {
      pagina: 'Recuperar contraseña',
      errores: [{ msg: 'El correo no está registrado' }],
      csrfToken: req.csrfToken(),
    });
  }

  const token = generarId();

  usuario.token = token;
  await usuario.save();

  emailRecuperar({
    nombre: usuario.nombre,
    email: usuario.email,
    token: usuario.token
})

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

const verificar_token = async (req, res) => {
  const { token } = req.params;
  const usuario = await Usuarios.findOne({where: {token}})

  if (!usuario) {
      return res.render('autenticacion/mensaje', {
          pagina: 'Error',
          mensaje: 'El token no es válido',
          error: true
      })
  }

  res.render('autenticacion/reset', {
      pagina: 'Nueva contraseña',
      csrfToken: req.csrfToken(),
  })
}

const nueva_contrasena = async (req, res) => {

  await check('password').isLength({min: 6}).withMessage('Mínimo 6 caracteres').run(req);

  let resultado = validationResult(req);

  if(!resultado.isEmpty()) {
      return res.render('autenticacion/reset', {
          pagina: 'Nueva contraseña',
          csrfToken: req.csrfToken(),
          errores: resultado.array()
      })
  }

  const { token } = req.params;
  const { password } = req.body;

  try {

  const usuario = await Usuarios.findOne({ where: { token } });
  if (!usuario) {
    return res.render('autenticacion/mensaje', {
      pagina: 'Error',
      mensaje: 'Token inválido o usuario no encontrado',
      error: true,
    });
  }

  const salt = await bcrypt.genSalt(10);
  usuario.password = await bcrypt.hash(password, salt);
  usuario.token = null;

  await usuario.save();

  res.render('autenticacion/mensaje', {
    pagina: 'Contraseña actualizada',
    mensaje: 'Tu contraseña ha sido actualizada correctamente',
  });
} catch (error) {
  console.error('Error al actualizar la contraseña:', error);
  res.status(500).render('autenticacion/mensaje', {
    pagina: 'Error',
    mensaje: 'Hubo un error al actualizar la contraseña. Intenta de nuevo más tarde.',
    error: true,
  });
}
}

const mostrar_mensaje = (req, res) => {
  res.render('autenticacion/mensaje', {
    pagina: 'Mensaje',
    mensaje: 'Mensaje de prueba',
  });
}

const salir = (req, res) => {
  res.clearCookie('_token');
  res.redirect('/autenticacion/login');
}

export { 
    mostrar_login,
    mostrar_signup,
    registrar_usuario,
    iniciar_sesion,
    recuperar_contrasena,
    confirmar_token,
    mostrar_recuperar_contrasena, 
    verificar_token,
    nueva_contrasena,
    mostrar_mensaje,
    salir
};


