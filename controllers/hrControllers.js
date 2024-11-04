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
    csrfToken: req.csrfToken(),
    pagina: 'colaboradores',
    pagina_activa: 'colaboradores'
  });
};
  

const agregar_trabajador = async (req, res) => {
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

    if (!nombre || !apellido || !cargo || !estado) {
      return res.status(400).send('Los campos nombre, apellido, cargo y estado son obligatorios.');
    }

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

    res.redirect('/recursos_humanos/colaboradores');
  } catch (error) {
    console.error('Error al agregar el trabajador:', error);
    res.status(500).send('Error al agregar el trabajador.');
  }
};

const mostrar_liquidaciones = async (req, res) => {
  try {
    const empresaId = req.usuario.empresaId;
    const colaboradores = await Colaboradores.findAll({ where: { empresaId } });

  
    const fechaActual = new Date();
    const meses = Array.from({ length: 24 }, (_, i) => {
      const fecha = new Date(fechaActual.getFullYear(), fechaActual.getMonth() - i, 1);
      return {
        nombre: fecha.toLocaleString('es-ES', { month: 'long' }),
        mes: fecha.getMonth() + 1,
        anio: fecha.getFullYear(),
      };
    });

    const liquidaciones = await Liquidaciones.findAll({
      where: { empresaId },
      include: [{ model: Colaboradores, as: 'colaboradore' }],
    });

    res.render('recursos_humanos/liquidaciones', {
      pagina: 'Liquidaciones de Sueldo',
      csrfToken: req.csrfToken(),
      meses,
      colaboradores,
      liquidaciones,
    });
  } catch (error) {
    console.error('Error al mostrar las liquidaciones:', error);
    res.status(500).send('Error al mostrar las liquidaciones');
  }
};

const crear_liquidaciones = async (req, res) => {
  try {
    const { mes, anio, detalle } = req.body;
    const empresaId = req.usuario.empresaId;

    const colaboradores = await Colaboradores.findAll({ where: { empresaId } });

    const liquidaciones = colaboradores.map(colaborador => ({
      empresaId,
      trabajador_id: colaborador.id,
      fecha: new Date(anio, mes - 1, 1),
      detalle,
    }));

    await Liquidaciones.bulkCreate(liquidaciones);

    res.redirect('/recursosHumanos/liquidaciones');
  } catch (error) {
    console.error('Error al generar liquidaciones mensuales:', error);
    res.status(500).send('Error al generar liquidaciones');
  }
};

const mostrar_comite_paritario = async (req, res) => {

  res.render('recursos_humanos/comite_paritario', { 
    csrfToken: req.csrfToken(), 
    pagina: 'comite_paritario',
    pagina_activa: 'comite_paritario'
  });
}

const mostrar_personal_antiguo = async (req, res) => {
  
    res.render('recursos_humanos/personal_antiguo', { 
      csrfToken: req.csrfToken(), 
      pagina: 'personal_antiguo',
      pagina_activa: 'personal_antiguo'
    });
  }

const mostrar_control_asisitencia = async (req, res) => {

      res.render('recursos_humanos/control_asistencia', { 
        csrfToken: req.csrfToken(), 
        pagina: 'control_asistencia',
        pagina_activa: 'control_asistencia'
      });
    } 

const mostrar_perfil_colaborador = async (req, res) => {
  res.render('recursos_humanos/perfil_colaborador', {
    csrfToken: req.csrfToken(),
    pagina: 'perfil_colaborador',
    pagina_activa: 'perfil_colaborador',
    usuario: req.usuario.nombre,
    empresa: req.usuario.empresa,
  });
}
export { 
      mostrar_colaboradores,
      agregar_trabajador,
      mostrar_liquidaciones,
      mostrar_comite_paritario,
      mostrar_personal_antiguo,
      mostrar_control_asisitencia,
      mostrar_perfil_colaborador,
      crear_liquidaciones
};
  