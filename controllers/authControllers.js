import bcrypt from 'bcrypt';
import { Usuarios } from '../models/Usuarios.js';
import e from 'express';
import { check, validationResult } from 'express-validator'
import { generarId, generarJWT } from '../helpers/tokens.js';
import jwt from 'jsonwebtoken';

const mostrar_signup = (req, res) => {
  res.render('auth/signup', {
      pagina: 'Registro',
      csrfToken: req.csrfToken()
  })
}

const mostrar_login = (req, res) => {
  res.render('auth/login', {
      pagina: 'Iniciar Sesión',
      csrfToken: req.csrfToken()
  })
}

const registrar_usuario = async (req, res) => {

  // Validaciones
  await check('nombre').notEmpty().withMessage('El nombre es obligatorio').run(req);
  await check('empresa').notEmpty().withMessage('El nombre es obligatorio').run(req);
  await check('email').isEmail().withMessage('Ingrese un Email válido').run(req);
  await check('password').isLength({min: 6}).withMessage('Mínimo 6 caracteres').run(req);
  await check('password2').equals(req.body.password).withMessage('Password no coinciden').run(req);

  let resultado = validationResult(req);

  if(!resultado.isEmpty()) {
    return res.render('auth/signup', {
        pagina: 'Registro',
        errores: resultado.array(),
        csrfToken: req.csrfToken(),
        usuario: {
            nombre: req.body.nombre,
            email: req.body.email
        }
    })
  }

  const { nombre, empresa ,email, password} = req.body;

  const nombreFormateado = empresa.toLowerCase().replace(/\s+/g, '');
  const nombreUsuario = `admin@${nombreFormateado}`;

  const existeUsuario = await Usuarios.findOne({where: {email}})

  if (existeUsuario) {
    return res.render('auth/signup', {
      pagina: 'Crear cuenta',
      csrfToken: req.csrfToken(),
      errores: [{msg: 'El email ya está registrado'}],
      usuario: {
      nombre: req.body.nombre,
      email: req.body.email
          }
      })
  
  }

  const usuario = await Usuarios.create({
    nombre,
    empresa,
    nombreFormateadoEmpresa: nombreFormateado,
    email,
    nombreUsuario,
    password,
    token: '123',
  })

  res.render('auth/mensaje',{
    pagina: 'Creación exitosa',
    mensaje: 'Hemos enviado un email de confirmación, por favor revisa tu bandeja de entrada'
  })

}

const iniciar_sesion = async (req, res) => {
  await check('nombreUsuario').notEmpty().withMessage('Ingrese un usuario').run(req);
  await check('password').notEmpty().withMessage('Ingrese una contraseña').run(req);

  let resultado = validationResult(req);

  // if(!resultado.isEmpty()) {
  //     return res.render('auth/login', {
  //         pagina: 'Iniciar Sesión',
  //         errores: resultado.array(),
  //         csrfToken: req.csrfToken()
  //     })
  // }

  const { nombreUsuario, password } = req.body;

  const usuario = await Usuarios.findOne({where: {nombreUsuario}});

  if (!usuario) {
    return res.render('auth/login', {
        pagina: 'Iniciar Sesión',
        csrfToken: req.csrfToken(),
        errores: [{msg: 'El usuario no está registrado'}]
    })
  }

  if (!await usuario.verificarPassword(password)) {
    return res.render('auth/login', {
        pagina: 'Iniciar Sesión',
        csrfToken: req.csrfToken(),
        errores: [{msg: 'Contraseña incorrecta'}]
    })
  }

  const token = generarJWT({id: usuario.id, nombre: usuario.nombre});

  return res.cookie('_token', token, {
    httpOnly: true,
    //secure: true,
    maxAge: 60 * 60 * 24 * 1000
  }).redirect('/dasboard')
}

export { 
    mostrar_login,
    mostrar_signup,
    registrar_usuario,
    iniciar_sesion,
};


