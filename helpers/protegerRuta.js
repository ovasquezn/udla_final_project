import jwt from 'jsonwebtoken';

const verificarToken = (req, res, next) => {
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
  verificarToken,
  permiso_nivel_1,
  permiso_colaborador
};