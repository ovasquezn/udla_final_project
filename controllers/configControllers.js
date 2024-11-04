import { Usuarios } from '../models/Usuarios.js';
import { Empresas } from '../models/Empresas.js'; 
import { Colaboradores } from '../models/Colaboradores.js';
import { validationResult } from 'express-validator';

const formatearNombreEmpresa = (nombreEmpresa) => {
    return nombreEmpresa.toLowerCase().replace(/\s+/g, '');
};

const mostrar_usuarios = async (req, res) => {
    try {
    if (!req.usuario) {
        throw new Error('Usuario no autenticado');
    }
    const empresaId = req.usuario.empresaId;
    
    const usuarios = await Usuarios.findAll({
        where: { empresaId: empresaId },
        include: [{ model: Empresas, as: 'empresa_usuarios' }]
    });

    const empresa = await Empresas.findOne({ where: { id: empresaId } });
    if (!empresa) {
        return res.status(404).send('Empresa no encontrada');
    }

    const colaboradores = await Colaboradores.findAll({where: {empresaId: empresaId}});

    console.log('Colaboradores:', colaboradores);
    const nombre_formateado = formatearNombreEmpresa(empresa.nombre);

    res.render('configuraciones/usuarios', {
        pagina: 'Usuarios',
        usuarios,
        csrfToken: req.csrfToken(),
        empresaId,
        usuario: req.usuario,
        nombre_formateado,
        colaboradores,
        usuario: req.usuario.nombre,
        empresa: req.usuario.empresa,

    });
} catch (error) {
    console.error('Error al mostrar usuarios:', error);
    res.status(500).send('Error al mostrar usuarios');
}
};

const crear_usuario = async (req, res) => {

    const errores = validationResult(req);
    if (!errores.isEmpty()) {
    return res.render('/configuraciones/usuarios', {
        pagina: 'Usuarios',
        errores: errores.array(),
        csrfToken: req.csrfToken(),
    });
}

try {
    const { nombre, nombreUsuario, email, password, permisos, colaboradorId} = req.body;
    const empresaId = req.usuario.empresaId;

    const empresa = await Empresas.findOne({ where: { id: empresaId } });
    if (!empresa) {
        return res.status(404).send('Empresa no encontrada');
    }

    const nombreFormateado = formatearNombreEmpresa(empresa.nombre);

    const nombreUsuarioCompleto = `${nombreUsuario}@${nombreFormateado}`;

    await Usuarios.create({
        nombre,
        nombreUsuario: nombreUsuarioCompleto,
        email,
        password,
        permisos,
        empresaId,
        confirmado: true, 
        colaboradorId: colaboradorId,
    });

    res.redirect('/configuraciones/usuarios');
        } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).send('Error al crear usuario');
    }
};

export {
    mostrar_usuarios,
    crear_usuario
}