import jwt from 'jsonwebtoken';

const generarJWT = datos => jwt.sign({id: datos.id, nombre: datos.nombre, empresaId: datos.empresaId,}, process.env.SECRET, {expiresIn: '8h'});

const generarId = () => Date.now().toString(32) + Math.random().toString(32).substring(2);

export {
    generarJWT,
    generarId,
}