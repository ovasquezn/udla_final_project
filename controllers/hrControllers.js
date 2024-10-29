import { where } from 'sequelize';
import { Colaboradores, PagosColaboradores , Liquidaciones, Documentos } from '../models/relations.js';


const mostrar_colaboradores = async (req, res) => {

  const empresaId = req.usuario.empresaId;

  const trabajadores = await Colaboradores.findAll({
    where: { empresaId: empresaId },
    include: [
      { model: PagosColaboradores, as: 'pagos_colaboradores' },
      { model: Liquidaciones, as: 'liquidaciones' },
      { model: Documentos, as: 'documentos' },
    ],
  });

  res.render('recursos_humanos/colaboradores', { 
    trabajadores,
    csrfToken: req.csrfToken(), });
};
  

const agregarTrabajador = async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      cargo,
      estado,
      direccion,
      rut,
      estado_civil,
      cuenta_bancaria,
      contacto_emergencia,
      sueldo,
      fecha_ingreso,
      tipo_contrato,
    } = req.body;

    const empresaId = req.usuario.empresaId;
    // Validaciones básicas (puedes agregar más según tus necesidades)
    if (!nombre || !apellido || !cargo || !estado) {
      return res.status(400).send('Los campos nombre, apellido, cargo y estado son obligatorios.');
    }

    // Crear el trabajador en la base de datos
    await Colaboradores.create({
      nombre,
      apellido,
      cargo,
      estado,
      direccion,
      rut,
      estado_civil,
      cuenta_bancaria,
      contacto_emergencia,
      sueldo: sueldo || null,
      fecha_ingreso: fecha_ingreso || null,
      tipo_contrato,
      empresaId: empresaId,
    });

    // Redirigir a la página de trabajadores
    res.redirect('/recursosHumanos');
  } catch (error) {
    console.error('Error al agregar el trabajador:', error);
    res.status(500).send('Error al agregar el trabajador.');
  }
};


export { 
      mostrar_colaboradores,
      agregarTrabajador
};
  
  
  