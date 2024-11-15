import '../models/relations.js';
import { Productos } from '../models/Productos.js';
import { Facturas, Proveedores, DetalleFacturas, FacturasEmitidas, Inventarios, Bancos, MovimientosBancarios, Clientes} from '../models/relations.js';
import { Op } from 'sequelize';

//==========FUNCIONES================
// Funciones
// #region Funciones
const calcularSaldo = async () => {
    // Obtener todos los movimientos ordenados por fecha
    const movimientos = await MovimientosBancarios.findAll({
      order: [['fecha', 'ASC']],
      raw: true,
    });
  
    let saldoAcumulado = 0;
    const movimientosConSaldo = movimientos.map((movimiento) => {

      if (movimiento.tipo === 'abono') {
        saldoAcumulado += parseFloat(movimiento.monto);
      } else if (movimiento.tipo === 'gasto') {
        saldoAcumulado -= parseFloat(movimiento.monto);
      }
  
      return { ...movimiento, saldoAcumulado: saldoAcumulado.toFixed(2) };
    });
  
    return movimientosConSaldo;
  };
// #endregion Finanzas

//=========BANCO================
// Funciones de banco
// #region Banco
// Función para calcular el saldo actual del banco
const calcularSaldoActual = (saldoInicial, abonos, gastos) => {
  const totalAbonos = abonos.reduce((sum, abono) => sum + parseFloat(abono.monto), 0).toFixed(2);
  const totalGastos = gastos.reduce((sum, gasto) => sum + parseFloat(gasto.monto), 0).toFixed(2);
  const saldoActual = (parseFloat(saldoInicial) + parseFloat(totalAbonos) - parseFloat(totalGastos)).toFixed(2);
  return saldoActual;
};

const mostrar_movimientos_bancarios = async (req, res) => {
  try {
    const { bancoId } = req.query;
    const empresaId = req.usuario.empresaId;

    let bancoSeleccionado;

    const bancos = await Bancos.findAll({ where: { empresaId } });

    if (!bancos.length) {
      return res.render('configuraciones/bancos', {
        csrfToken: req.csrfToken(),
        mensaje: "No hay bancos registrados. Por favor, agregue un banco para ver los movimientos.",
      });
    }

    if (!bancoId) {
      bancoSeleccionado = await Bancos.findOne({ where: { empresaId } });
      if (bancoSeleccionado) {
        return res.redirect(`/finanzas/movimientos_bancarios?bancoId=${bancoSeleccionado.id}`);
      } else {
        return res.status(400).send("No hay bancos registrados para esta empresa.");
      }
    } else {
      bancoSeleccionado = await Bancos.findOne({ where: { id: bancoId, empresaId } });
      if (!bancoSeleccionado) {
        return res.status(404).send("Banco no encontrado.");
      }
    }

    const movimientos = await MovimientosBancarios.findAll({
      where: { empresaId, banco_id: bancoId },
      order: [['fecha', 'DESC']],
    });

    const saldoInicial = bancoSeleccionado.saldo;
    const abonos = movimientos.filter(mov => mov.tipo === 'abono');
    const gastos = movimientos.filter(mov => mov.tipo === 'gasto');
    const saldoActual = calcularSaldoActual(saldoInicial, abonos, gastos);

    res.render('finanzas/banco', {
      id: bancoId,
      csrfToken: req.csrfToken(),
      bancos,
      bancoSeleccionado,
      bancoSeleccionadoNombre: bancoSeleccionado.nombre_banco,
      movimientos,
      pagina: 'Banco',
      pagina_activa: 'banco',
      saldoActual,
    });
  } catch (error) {
    console.error('Error al mostrar los movimientos bancarios:', error);
    res.status(500).json({ success: false, message: 'Error al mostrar los movimientos bancarios' });
  }
};

const agregar_movimiento_bancario = async (req, res) => {
  try {
    const { bancoId, fecha, detalle, monto, tipo } = req.body;
    const empresaId = req.usuario.empresaId;

    if (!bancoId) {
      return res.status(400).json({ success: false, message: 'Banco no especificado.' });
    }

    await MovimientosBancarios.create({
      empresaId,
      banco_id: bancoId,
      fecha,
      detalle,
      monto,
      tipo,
      fecha_creacion: new Date(),
      fecha_actualizacion: new Date(),
    });

    res.redirect(`/finanzas/movimientos_bancarios?bancoId=${bancoId}`);
  } catch (error) {
    console.error('Error al agregar movimiento bancario:', error);
    res.status(500).json({ success: false, message: 'Error al agregar el movimiento bancario' });
  }
};


const editar_movimiento_bancario = async (req, res) => {
  try {
    const { id } = req.params;
    const { detalle, monto, tipo } = req.body;

    const movimiento = await MovimientosBancarios.findByPk(id);
    if (!movimiento) {
      return res.status(404).json({ success: false, message: 'Movimiento no encontrado' });
    }
    movimiento.detalle = detalle;
    movimiento.monto = monto;
    movimiento.tipo = tipo;
    await movimiento.save();

    res.redirect(`/finanzas/movimientos_bancarios?bancoId=${movimiento.banco_id}`);
  } catch (error) {
    console.error('Error al editar el movimiento bancario:', error);
    res.status(500).json({ success: false, message: 'Error al editar el movimiento bancario' });
  }
};

//
const eliminar_movimiento_bancario = async (req, res) => {
  try {
    const { id } = req.params;

    const movimiento = await MovimientosBancarios.findByPk(id);
    if (!movimiento) {
      return res.status(404).json({ success: false, message: 'Movimiento no encontrado' });
    }

    const bancoId = movimiento.banco_id;

    await movimiento.destroy();

    res.redirect(`/finanzas/movimientos_bancarios?bancoId=${bancoId}`);
  } catch (error) {
    console.error('Error al eliminar el movimiento bancario:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar el movimiento bancario' });
  }
};

// #endregion Banco

//=========FACTURAS RECIBIDAS================
// Funciones de facturas recibidas
// #region Facturas Recibidas
const mostrar_facturas_recibidas = async (req, res) => {
  try {
    const empresaId = req.usuario.empresaId;
    const facturas = await Facturas.findAll({
      where: { empresaId },
      include: [
        { model: Proveedores, as: 'proveedor' },
        {
          model: DetalleFacturas,
          as: 'detalle_factura',
          include: [{ model: Productos, as: 'producto' }]
        }
      ]
    });

    const productos = await Productos.findAll({ where: { empresaId } });
    const proveedores = await Proveedores.findAll({ where: { empresaId } });
    const inventarios = await Inventarios.findAll({ where: { empresaId } });

    res.render('finanzas/facturas_recibidas', {
      inventarios,
      facturas,
      productos,
      proveedores,
      pagina: 'Facturas Recibidas',
      pagina_activa: 'facturas_recibidas',
      csrfToken: req.csrfToken()
    });
  } catch (error) {
    console.error('Error al cargar las facturas:', error);
    res.status(500).send('Error al cargar las facturas');
  }
};

const agregar_factura_recibida = async (req, res) => {
  try {
    const { numero_factura, fecha_emision, fecha_vencimiento, proveedor_id, monto, forma_pago, estado_pago } = req.body;
    const empresaId = req.usuario.empresaId;

    await Facturas.create({
      empresaId,
      numero_factura: numero_factura || '12345', 
      fecha_emision: fecha_emision || new Date(),
      fecha_vencimiento: fecha_vencimiento || new Date(new Date().setDate(new Date().getDate() + 30)), 
      proveedor_id: proveedor_id || 1,
      monto: monto || 1000,
      forma_pago: forma_pago || 'efectivo',
      estado_pago: estado_pago === '1',
    });

    res.redirect('/finanzas/facturas_recibidas');
  } catch (error) {
    console.error('Error al crear la factura:', error);
    res.status(500).send('Error al crear la factura');
  }
  };

const agregar_productos_factura_recibida = async (req, res) => {
  try {
    const { facturaId } = req.params;
    const { producto_id, cantidad, precio } = req.body;
    const empresaId = req.usuario.empresaId;

    const factura = await Facturas.findOne({ where: { id: facturaId, empresaId } });
    if (!factura) {
      return res.status(404).json({ success: false, message: 'Factura no encontrada' });
    }

    const producto = await Productos.findOne({ where: { id: producto_id, empresaId } });
    if (!producto) {
      return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    }

    const nuevoDetalle = await DetalleFacturas.create({
      empresaId,
      factura_id: factura.id, 
      producto_id: producto.id,  
      nombre_producto: producto.nombre_producto, 
      unidad: producto.unidad || 'unidad', 
      codigo_barra: 'N/A', 
      precio, 
      cantidad,  
      descuento: 0,  
      impuestos: 0,  
      fecha_creacion: new Date(),  
      fecha_actualizacion: new Date(),
    });

    const detalleConProducto = await DetalleFacturas.findOne({
      where: { id: nuevoDetalle.id },
      include: [{ model: Productos, as: 'producto' }],
    });

    res.status(201).json({ success: true, detalle: detalleConProducto });
    console.log('Producto agregado con éxito');
    //res.send('Producto agregado con éxito');
  } catch (error) {
    console.error('Error al agregar productos a la factura:', error);
    res.status(500).json({ success: false, message: 'Error al agregar productos a la factura' });
  }
}

const crear_productos_factura_recibida = async (req, res) => { 
  try {
    const { codigo_barra, nombre_producto, precio, cantidad, inventario_id } = req.body;
    const empresaId = req.usuario.empresaId;
    const proveedor_id = req.body.proveedor_id; 

    const nuevoProducto = await Productos.create({
      empresaId,
      codigo_barra,
      nombre_producto,
      precio,
      cantidad,
      inventario_id,
      //proveedor_id,
      codigo_interno: codigo_barra, 
      fecha_creacion: new Date(),
      fecha_actualizacion: new Date(),
    });

    res.status(201).json({ success: true, producto: nuevoProducto });
    
  } catch (error) {
    console.error('Error al crear el producto:', error);
    res.status(500).json({ success: false, message: 'Error al crear el producto' });
  }
};
// #endregion Facturas Recibidas

//=========FACTURAS EMITIDAS================
// Funciones de facturas emitidas
// #region Facturas Emitidas
const mostrar_facturas_emitidas = async (req, res) => {
  try {
    const empresaId = req.usuario.empresaId;
    const facturasEmitidas = await FacturasEmitidas.findAll({
      where: { empresaId },
      include: [{ model: Clientes, as: 'cliente_info' }]
    });

    //const clientes = await Clientes.findAll({ where: { empresaId } });
    res.render('finanzas/facturas_emitidas', { 
      facturasEmitidas, 
      pagina: 'Facturas Emitidas',
      pagina_activa: 'facturas_emitidas',
      csrfToken: req.csrfToken() });
  } catch (error) {
    console.error('Error al cargar las facturas emitidas:', error);
    res.status(500).send('Error al cargar las facturas emitidas');
  }
}
  

const agregar_factura_emitida = async (req, res) => {
  try {
    const { numero_factura, fecha_emision, fecha_vencimiento, clienteId, monto, forma_pago, estado_pago, comentarios } = req.body;
    const empresaId = req.usuario.empresaId;

    await FacturasEmitidas.create({
      empresaId,
      numero_factura: numero_factura || '12345',
      fecha_emision: fecha_emision || new Date(),
      fecha_vencimiento: fecha_vencimiento || new Date(new Date().setDate(new Date().getDate() + 30)),
      clienteId: clienteId || 1,
      monto: monto || 1000,
      forma_pago: 'efectivo',
      estado_pago: estado_pago === '1',
      comentarios,
    });

    res.redirect('/finanzas/facturas_emitidas');
  } catch (error) {
    console.error('Error al crear la factura emitida:', error);
    res.status(500).send('Error al crear la factura emitida');
  }
};
// #endregion Facturas Emitidas

//=========GASTOS================
// Funciones de gastos
// #region Gastos
const mostrar_gastos = (req, res) => {
    res.render('finanzas/gastos', {
        pagina: 'Gastos',
        pagina_activa: 'gastos',
        usuario: req.usuario.nombre,
        empresa: req.usuario.empresa,
        permisos: req.usuario.permisos
    })
}
// #endregion Gastos


const mostrar_ingresos = async (req, res) => {
  res.render('finanzas/ingresos', {
      pagina: 'Ingresos',
      pagina_activa: 'ingresos',
  })
}

//=========PROVEEDORES================
// Funciones de proveedores
// #region Proveedores

// Documentación:
// Función para mostrar los proveedores
// Esta función obtiene los proveedores de la base de datos y los muestra en la vista
const mostrar_proveedores = async (req, res) => {
  try {
    const empresaId = req.usuario.empresaId
    const proveedores = await Proveedores.findAll({ where: { empresaId } });
    res.render('finanzas/proveedores', { 
      proveedores,
      csrfToken: req.csrfToken(),
      usuario: req.usuario.nombre,
      empresa: req.usuario.empresa,
      pagina_activa: 'proveedores',
    });
  } catch (error) {
    console.error("Error al mostrar los proveedores:", error);
    res.status(500).send("Error al cargar los proveedores.");
  }
};

// Documentación:
// Funcion para agregar un proveedor
// Esta función recibe los datos del formulario de la vista y los guarda en la base de datos
// Función para agregar un nuevo proveedor
const agregar_proveedor = async (req, res) => {
  try {
    const {
      nombre_proveedor,
      razon_social,
      rut,
      giro,
      contacto,
      direccion,
      telefono,
      email,
      web,
      detalles,
      forma_pago,
      plazo_pago,
    } = req.body;
    
    const empresaId = req.usuario.empresaId;

    await Proveedores.create({
      empresaId,
      nombre_proveedor,
      razon_social,
      rut,
      giro,
      contacto,
      direccion,
      telefono,
      email,
      web,
      detalles,
      forma_pago,
      plazo_pago,
      fecha_creacion: new Date(),
      fecha_actualizacion: new Date(),
    });

    res.redirect('/finanzas/proveedores');
  } catch (error) {
    console.error("Error al agregar proveedor:", error);
    res.status(500).send("Error al agregar proveedor.");
  }
};

// Documentación:
// Función para eliminar un proveedor
// Esta función recibe el ID del proveedor a eliminar y lo elimina de la base de datos
const eliminar_proveedor = async (req, res) => {
  console.log("Solicitud de eliminación recibida para el proveedor ID:", req.params.id);
  try {
    const { id } = req.params;
    const empresaId = req.usuario.empresaId;

    const proveedor = await Proveedores.findOne({ where: { id, empresaId } });
    if (!proveedor) {
      return res.status(404).json({ success: false, message: "Proveedor no encontrado." });
    }

    await proveedor.destroy();
    res.status(200).json({ success: true, message: "Proveedor eliminado con éxito." });
  } catch (error) {
    console.error("Error al eliminar proveedor:", error);
    res.status(500).json({ success: false, message: "Error al eliminar proveedor." });
  }
};

// Documentación:
// Función para editar un proveedor
// Esta función recibe el ID del proveedor a editar y los nuevos datos del formulario
const editar_proveedor = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre_proveedor,
      razon_social,
      rut,
      giro,
      contacto,
      direccion,
      telefono,
      email,
      web,
      detalles,
      forma_pago,
      plazo_pago,
    } = req.body;
    const empresaId = req.usuario.empresaId;

    const proveedor = await Proveedores.findOne({ where: { id, empresaId } });
    if (!proveedor) {
      return res.status(404).send("Proveedor no encontrado.");
    }

    proveedor.nombre_proveedor = nombre_proveedor;
    proveedor.razon_social = razon_social;
    proveedor.rut = rut;
    proveedor.giro = giro;
    proveedor.email = email;
    proveedor.web = web;
    proveedor.detalles = detalles;
    proveedor.forma_pago = forma_pago;
    proveedor.plazo_pago = plazo_pago;
    proveedor.contacto = contacto;
    proveedor.direccion = direccion;
    proveedor.telefono = telefono;
    proveedor.fecha_actualizacion = new Date();

    await proveedor.save();

    res.redirect('/finanzas/proveedores');
  } catch (error) {
    console.error("Error al actualizar proveedor:", error);
    res.status(500).send("Error al actualizar proveedor.");
  }
};
// #endregion Proveedores

//=========PRECIOS================
// Funciones de precios
// #region Precios
const mostrar_precios = async (req, res) => {
  try {
    const productos = await Productos.findAll();
    res.render('finanzas/precios', { productos, pagina: 'Precios', pagina_activa: 'precios' });
  } catch (error) {
    console.error("Error al obtener los precios:", error);
    res.status(500).send("Error al obtener los precios.");
  }
}
// #endregion

//=========EXPORTS================
// Exportar funciones
// #region Exportar funciones
export { 
    mostrar_movimientos_bancarios,
    agregar_movimiento_bancario,
    editar_movimiento_bancario,
    eliminar_movimiento_bancario,
    mostrar_facturas_recibidas,
    mostrar_facturas_emitidas,
    mostrar_gastos,
    mostrar_ingresos,
    mostrar_proveedores,
    agregar_proveedor,
    eliminar_proveedor,
    editar_proveedor,
    mostrar_precios,
    agregar_factura_recibida,
    agregar_factura_emitida,
    agregar_productos_factura_recibida,
    crear_productos_factura_recibida,
};
// #endregion