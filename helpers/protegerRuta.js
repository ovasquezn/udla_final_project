import jwt from 'jsonwebtoken';

const verificarToken = (req, res, next) => {
  const token = req.cookies._token;  // Leer el token de la cookie

  // Verificar si el token existe
  if (!token) {
    return res.redirect('/autenticacion/login');  // Redirigir si no hay token
  }

  // Verificar el token
  jwt.verify(token, 'secreto_seguro', (err, decoded) => {
    if (err) {
      return res.redirect('/autenticacion/login');  // Redirigir si el token es inválido
    }

    // El token es válido, pasar los datos decodificados al request
    req.usuario = decoded;  // Aquí almacenamos los datos del token en req.usuario
    console.log(req.usuario);
    next();
  });
};

export { verificarToken };