import { Usuarios } from '../models/Usuarios.js';
import { Empresas } from '../models/Empresas.js'; 
import { Colaboradores } from '../models/Colaboradores.js';
import { validationResult } from 'express-validator';
import { Bancos } from '../models/Bancos.js';

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

//NO HA SIDO PROBADA
const editar_usuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, nombreUsuario, email, password, permisos } = req.body;
    
        const usuario = await Usuarios.findOne({ where: { id } });
        if (!usuario) {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
    
        usuario.nombre = nombre;
        usuario.nombreUsuario = nombreUsuario;
        usuario.email = email;
        usuario.password = password;
        usuario.permisos = permisos;
    
        await usuario.save();
    
        res.status(200).json({ success: true, usuario });
    } catch (error) {
        console.error('Error al editar el usuario:', error);
        res.status(500).json({ success: false, message: 'Error al editar el usuario' });
    }
}

const mostrar_bancos = async (req, res) => {
    try {
        const empresaId = req.usuario.empresaId;
        const bancos = await Bancos.findAll({ where: { empresaId } });

        res.render('configuraciones/bancos', {
        pagina: 'Bancos',
        bancos,
        csrfToken: req.csrfToken(),
        });
    } catch (error) {
        console.error('Error al mostrar los bancos:', error);
        res.status(500).json({ success: false, message: 'Error al mostrar los bancos' });
    }
};

const agregar_banco = async (req, res) => {
    try {
        const { nombre_banco, numero_cuenta, tipo_cuenta, saldo, moneda } = req.body;
        const empresaId = req.usuario.empresaId;

        const nuevoBanco = await Bancos.create({
        empresaId,
        nombre_banco,
        numero_cuenta,
        tipo_cuenta,
        saldo,
        moneda,
        fecha_creacion: new Date(),
        fecha_actualizacion: new Date(),
        });

        res.redirect('/configuraciones/bancos');
        //res.status(201).json({ success: true, banco: nuevoBanco });
    } catch (error) {
        console.error('Error al agregar el banco:', error);
        res.status(500).json({ success: false, message: 'Error al agregar el banco' });
    }
};

//NO HA SIDO PROBADA
const editar_banco = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre_banco, numero_cuenta, tipo_cuenta, saldo, moneda } = req.body;
    
        const banco = await Bancos.findOne({ where: { id } });
        if (!banco) {
        return res.status(404).json({ success: false, message: 'Banco no encontrado' });
        }
    
        banco.nombre_banco = nombre_banco;
        banco.numero_cuenta = numero_cuenta;
        banco.tipo_cuenta = tipo_cuenta;
        banco.saldo = saldo;
        banco.moneda = moneda;
        banco.fecha_actualizacion = new Date();
    
        await banco.save();
    
        res.status(200).json({ success: true, banco });
    } catch (error) {
        console.error('Error al editar el banco:', error);
        res.status(500).json({ success: false, message: 'Error al editar el banco' });
    }
    };

//NO HA SIDO PROBADA
const eliminar_banco = async (req, res) => {
    try {
        const { id } = req.params;
    
        const banco = await Bancos.findOne({ where: { id } });
        if (!banco) {
        return res.status(404).json({ success: false, message: 'Banco no encontrado' });
        }
    
        await banco.destroy();
    
        res.status(200).json({ success: true, message: 'Banco eliminado' });
    } catch (error) {
        console.error('Error al eliminar el banco:', error);
        res.status(500).json({ success: false, message: 'Error al eliminar el banco' });
    }
    }

export {
    mostrar_usuarios,
    crear_usuario,
    editar_usuario,
    mostrar_bancos,
    agregar_banco,
    editar_banco,
    eliminar_banco
}