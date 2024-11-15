import { Sequelize } from 'sequelize';
import { Colaboradores, PagosColaboradores , Liquidaciones, Documentos } from '../models/relations.js';


const mostrar_colaboradores = async (req, res) => {

  const empresaId = req.usuario.empresaId;

  const trabajadores = await Colaboradores.findAll({
    where: { empresaId: empresaId },
    include: [
      { model: PagosColaboradores, as: 'pagos_colaboradores' },
      { model: Liquidaciones, 
        as: 'liquidaciones',
        attributes: ['estado','sueldo', 'mes', 'anio', 'liquido', 'afp', 'salud', 'seguro_cesantia', 'retenciones', 'otros_items', 'documento_url', 'horas_extras', 'dias_trabajados'],
        required: false,
      },
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

const obtenerEstadosLiquidacion = () => {
  return Liquidaciones.rawAttributes.estado.values;
}

const obtenerNombreMes = (numeroMes) => {
  const nombresMeses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  return nombresMeses[numeroMes - 1];
};

const obtenerFechaInicioAntiguaPorEmpresa = async (empresaId) => {
  try {
    const colaboradorAntiguo = await Colaboradores.findOne({
      where: { empresaId: empresaId },
      attributes: [[Sequelize.fn('MIN', Sequelize.col('fecha_ingreso')), 'fechaInicioAntigua']],
      raw: true,
    });
    return colaboradorAntiguo.fechaInicioAntigua;
  } catch (error) {
    console.error("Error al obtener la fecha de inicio más antigua por empresa:", error);
    throw error;
  }
};

const generarListaMeses = (fechaInicio, mesesAdicionales=0) => {
  const meses = [];
  const fechaActual = new Date();
  const fechaFin = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + mesesAdicionales, 1);

  let fecha = new Date(fechaInicio);

  while (fecha <= fechaFin) {
    const mes = fecha.getMonth() + 1;
    const anio = fecha.getFullYear();
    meses.push({ mes, anio });
    
    fecha.setMonth(fecha.getMonth() + 1);
  }

  return meses;
};

const mostrar_liquidaciones = async (req, res) => {
  const empresaId = req.usuario.empresaId;

  try {

    const fechaInicioAntigua = await obtenerFechaInicioAntiguaPorEmpresa(empresaId);

    if (!fechaInicioAntigua) {
      return res.render('recursos_humanos/liquidaciones', { liquidacionesPorMes: [] });
    }

    const listaMeses = generarListaMeses(fechaInicioAntigua, 2);

    const estados = obtenerEstadosLiquidacion();

    const colaboradores = await Colaboradores.findAll({
      where: { empresaId: empresaId },
      attributes: ['id', 'nombre', 'apellido', 'fecha_ingreso', 'fecha_fin_contrato'],
      include: [
        {
          model: Liquidaciones,
          as: 'liquidaciones',
          attributes: ['estado','sueldo', 'mes', 'anio', 'liquido', 'afp', 'salud', 'seguro_cesantia', 'retenciones', 'otros_items', 'documento_url', 'horas_extras', 'dias_trabajados'],
          required: false,
        },
      ],
    });

    const liquidacionesPorMes = listaMeses.map(mes => {
      const colaboradoresEnMes = colaboradores
        .filter(colaborador => {
          const fechaIngreso = new Date(colaborador.fecha_ingreso);
          const fechaFinContrato = colaborador.fecha_fin_contrato ? new Date(colaborador.fecha_fin_contrato) : null;


          const inicioAntesOMismoMes = fechaIngreso.getFullYear() < mes.anio || 
            (fechaIngreso.getFullYear() === mes.anio && fechaIngreso.getMonth() + 1 <= mes.mes);
          const finDespuesOMismoMes = !fechaFinContrato || 
            fechaFinContrato.getFullYear() > mes.anio || 
            (fechaFinContrato.getFullYear() === mes.anio && fechaFinContrato.getMonth() + 1 >= mes.mes);

          return inicioAntesOMismoMes && finDespuesOMismoMes;
        })
        .map(colaborador => {
          const liquidacion = colaborador.liquidaciones.find(l => 
            l.mes === mes.mes && l.anio === mes.anio
          ) || { estado: 'Pendiente de crear', monto: 0 }; 

          return {
            ...colaborador.toJSON(),
            fecha_ingreso: new Date(colaborador.fecha_ingreso).toLocaleDateString(),
            fecha_fin_contrato: colaborador.fecha_fin_contrato
              ? new Date(colaborador.fecha_fin_contrato).toLocaleDateString()
              : 'Indefinido',
            liquidacion,
          };
        });


      const resumenMes = {
        montoTotal: colaboradoresEnMes.reduce((sum, col) => sum + (col.liquidacion?.monto || 0), 0),
        montoPagado: colaboradoresEnMes.reduce((sum, col) => sum + ((col.liquidacion?.estado === 'Pagada' ? col.liquidacion.monto : 0) || 0), 0),
        montoPendiente: colaboradoresEnMes.reduce((sum, col) => sum + ((col.liquidacion?.estado === 'Pendiente de crear' ? col.liquidacion.monto : 0) || 0), 0),
        montoAprobado: colaboradoresEnMes.reduce((sum, col) => sum + ((col.liquidacion?.estado === 'Aprobada' ? col.liquidacion.monto : 0) || 0), 0),
      };

      return {
        mes: mes.mes,
        anio: mes.anio,
        nombreMes: obtenerNombreMes(mes.mes),
        colaboradores: colaboradoresEnMes,
        resumenMes,
      };
    });

    const mes_actual= new Date().getMonth() + 1
    const anio_actual= new Date().getFullYear()

    console.log(mes_actual, anio_actual);
    res.render('recursos_humanos/liquidaciones', {
      pagina: 'Liquidaciones de Sueldo',
      csrfToken: req.csrfToken(),
      colaboradores,
      estados,
      liquidacionesPorMes: liquidacionesPorMes.reverse(),
      pagina_activa: 'liquidaciones',
      mes_actual,
      anio_actual
    });
  } catch (error) {
    console.error("Error al generar la lista de liquidaciones por mes:", error);
    res.status(500).json({ success: false, message: "Error al generar la lista de liquidaciones por mes" });
  }
};

const crear_liquidacion = async (req, res) => {
  const empresaId = req.usuario.empresaId;
  const { colaboradorId, mes, anio } = req.params;
  const {
    dias_trabajados,
    horas_extras,
    sueldo,
    liquido,
    afp,
    retenciones,
    salud,
    seguro_cesantia,
    otros_items,
    estado,
    documento
  } = req.body;

  try {
    const colaborador = await Colaboradores.findOne({
      where: { 
        id: colaboradorId,
        empresaId: empresaId
      }
    });

    if (!colaborador) {
      return res.status(404).json({ message: "Colaborador no encontrado" });
    }

    const liquidacionExistente = await Liquidaciones.findOne({
      where: {
        trabajador_id: colaboradorId,
        empresaId,
        mes: parseInt(mes),
        anio: parseInt(anio),
      },
    });

    if (liquidacionExistente) {
      return res.status(400).json({ message: "Ya existe una liquidación para este colaborador en el mes especificado" });
    }

      await Liquidaciones.create({
      empresaId,
      trabajador_id: colaboradorId,
      mes: parseInt(mes),
      anio: parseInt(anio),
      dias_trabajados: parseInt(dias_trabajados),
      horas_extras: parseInt(horas_extras),
      sueldo: parseFloat(sueldo),
      liquido: parseFloat(liquido),
      afp: parseFloat(afp),
      retenciones: parseFloat(retenciones),
      salud: parseFloat(salud),
      seguro_cesantia: parseFloat(seguro_cesantia),
      otros_items,
      estado: estado || 'Pendiente de crear',
      documento
    });

    res.redirect('/recursos_humanos/liquidaciones');
  } catch (error) {
    console.error("Error al crear liquidación:", error);
    res.status(500).json({ message: "Error al crear la liquidación" });
  }
};

const editar_liquidacion = async (req, res) => {
  const empresaId = req.usuario.empresaId;
  const { colaboradorId, mes, anio } = req.params;
  const {
    dias_trabajados,
    horas_extras,
    sueldo,
    liquido,
    afp,
    retenciones,
    salud,
    seguro_cesantia,
    otros_items,
    estado,
    documento
  } = req.body;

  try {
    // Verificar que el colaborador existe
    const colaborador = await Colaboradores.findOne({
      where: { 
        id: colaboradorId,
        empresaId: empresaId // Verifica que el colaborador pertenece a la empresa
      }
    });

    if (!colaborador) {
      return res.status(404).json({ message: "Colaborador no encontrado" });
    }

    const liquidacionExistente = await Liquidaciones.findOne({
      where: {
        trabajador_id: colaboradorId,
        empresaId,
        mes: parseInt(mes),
        anio: parseInt(anio),
      },
    });

    if (!liquidacionExistente) {
      return res.status(404).json({ message: "No existe una liquidación para este colaborador en el mes especificado" });
    }

    await Liquidaciones.update({
      dias_trabajados: parseInt(dias_trabajados),
      horas_extras: parseInt(horas_extras),
      sueldo: parseFloat(sueldo),
      liquido: parseFloat(liquido),
      afp: parseFloat(afp),
      retenciones: parseFloat(retenciones),
      salud: parseFloat(salud),
      seguro_cesantia: parseFloat(seguro_cesantia),
      otros_items,
      estado: estado || 'Pendiente de crear',
      documento
    }, {
      where: {
        trabajador_id: colaboradorId,
        empresaId,
        mes: parseInt(mes),
        anio: parseInt(anio),
      }
    });

    res.redirect('/recursos_humanos/liquidaciones');
  } catch (error) {
    console.error("Error al editar liquidación:", error);
    res.status(500).json({ message: "Error al editar la liquidación" });
  }
}

const agregar_documento = async (req, res) => {
  const { tipo, descripcion, documento_url } = req.body;
  const empresaId = req.usuario.empresaId;
  const trabajadorId = req.body.trabajadorId;

  try {
    const trabajador = await Colaboradores.findOne({
      where: { id: trabajadorId, empresaId },
    });

    if (!trabajador) {
      return res.status(404).json({ message: "Trabajador no encontrado o no pertenece a esta empresa" });
    }

    await Documentos.create({
      empresaId,
      trabajador_id: trabajadorId,
      tipo,
      descripcion,
      archivo: documento_url 
    });

    res.redirect('/recursos_humanos/colaboradores');
  } catch (error) {
    console.error("Error al agregar documento:", error);
    res.status(500).json({ message: "Error al agregar el documento" });
  }
};

const editar_documento = async (req, res) => {
  const { tipo, descripcion, documento_url } = req.body;
  const { id } = req.params;
  const empresaId = req.usuario.empresaId;

  try {
    // Verificar que el documento pertenece a la empresa
    const documento = await Documentos.findOne({
      where: { id, empresaId },
    });

    if (!documento) {
      return res.status(404).json({ message: "Documento no encontrado o no pertenece a esta empresa" });
    }

    // Actualizar el documento con los nuevos datos
    await documento.update({
      tipo,
      descripcion,
      archivo: documento_url // Actualizamos el enlace en el campo `archivo`
    });

    res.redirect('/recursos_humanos/colaboradores');
  } catch (error) {
    console.error("Error al editar documento:", error);
    res.status(500).json({ message: "Error al editar el documento" });
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
      crear_liquidacion,
      editar_liquidacion,
      agregar_documento,
      editar_documento,
};
  