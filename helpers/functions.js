import jwt from 'jsonwebtoken';

const verificar_jwt_token = (req, res, next) => {
  const token = req.cookies._token; 

  if (!token) {
    return res.redirect('/autenticacion/login');  
  }

  jwt.verify(token, 'secreto_seguro', (err, decoded) => {
    if (err) {
      return res.redirect('/autenticacion/login');
    }

    req.usuario = decoded; 
    console.log(req.usuario);

    res.locals.nombre = req.usuario.nombre;
    res.locals.empresa = req.usuario.empresa;
    res.locals.permisos = req.usuario.permisos;

    next();
  });
};


const permiso_nivel_1 = (req, res, next) => {
  if (!req.usuario || req.usuario.permisos !== 'propietario') {
    return res.redirect('/dashboard');
  }
  next();
};

const permiso_colaborador = (req, res, next) => {
  if (!req.usuario || req.usuario.permisos === 'colaborador') {
    return res.redirect(`/recursos_humanos/perfil_colaborador/${req.usuario.id}`);
  }
  next();
};

export { 
  verificar_jwt_token,
  permiso_nivel_1,
  permiso_colaborador
};