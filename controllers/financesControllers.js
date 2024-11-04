import '../models/relations.js';
import { Productos } from '../models/Productos.js';
import { Facturas, Proveedores, DetalleFacturas, FacturasEmitidas, Inventarios} from '../models/relations.js';

import { MovimientosBancarios } from '../models/MovimientosBancarios.js';
import { verificarToken } from '../helpers/protegerRuta.js';

// import { Productos } from "../models/Productos.js"
// import { Facturas } from "../models/Facturas.js"

const calcularSaldo = async () => {
    // Obtener todos los movimientos ordenados por fecha
    const movimientos = await MovimientosBancarios.findAll({
      order: [['fecha', 'ASC']],
      raw: true,
    });
  
    let saldoAcumulado = 0;
    const movimientosConSaldo = movimientos.map((movimiento) => {
      // Calcular el saldo acumulado
      if (movimiento.tipo === 'abono') {
        saldoAcumulado += parseFloat(movimiento.monto);
      } else if (movimiento.tipo === 'gasto') {
        saldoAcumulado -= parseFloat(movimiento.monto);
      }
  
      // Agregar el saldo acumulado actual al movimiento
      return { ...movimiento, saldoAcumulado: saldoAcumulado.toFixed(2) };
    });
  
    return movimientosConSaldo;
  };
  
const mostrar_banco = async (req, res) => {
    const bancos = [
        { id: 1, nombre: 'Banco de Chile', cuenta: 'Cuenta Corriente' },
        { id: 2, nombre: 'Banco Estado',cuenta: 'Cuenta Corriente' },
        { id: 3, nombre: 'Banco BCI', cuenta: 'Cuenta Corriente' },
      ];
      
    const movimientosConSaldo = await calcularSaldo();
  
    res.render('finanzas/banco', {
        pagina: 'Banco',
        pagina_activa: 'banco',
        bancos,
        movimientos: movimientosConSaldo,
    });
};

// FACTURAS RECIBIDAS
const mostrar_facturas_recibidas = async (req, res) => {
  try {
    const empresaId = req.usuario.empresaId;

    // Fetch invoices with related provider and details
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

    // Crear factura con datos del formulario o valores por defecto para pruebas
    await Facturas.create({
      empresaId,
      numero_factura: numero_factura || '12345', // Valor por defecto para pruebas
      fecha_emision: fecha_emision || new Date(),
      fecha_vencimiento: fecha_vencimiento || new Date(new Date().setDate(new Date().getDate() + 30)), // 30 días después
      proveedor_id: proveedor_id || 1, // ID del proveedor por defecto para pruebas
      monto: monto || 1000, // Monto de prueba
      forma_pago: forma_pago || 'efectivo',
      estado_pago: estado_pago === '1', // Conversión a booleano
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
    const { producto_id, cantidad } = req.body;
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
      precio: 1.0, 
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
      proveedor_id,
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

// FACTURAS EMITIDAS
const mostrar_facturas_emitidas = async (req, res) => {
  try {
    const empresaId = req.usuario.empresaId;
    const facturasEmitidas = await FacturasEmitidas.findAll({
      where: { empresaId },
      //include: [{ model: Clientes, as: 'cliente' }]
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
    const { numero_factura, fecha_emision, fecha_vencimiento, clienteId, monto, forma_pago, estado_pago } = req.body;
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
    });

    res.redirect('/finanzas/facturas_emitidas');
  } catch (error) {
    console.error('Error al crear la factura emitida:', error);
    res.status(500).send('Error al crear la factura emitida');
  }
};




const mostrar_gastos = (req, res) => {
    res.render('finanzas/gastos', {
        pagina: 'Gastos',
        pagina_activa: 'gastos',
        usuario: req.usuario.nombre,
        empresa: req.usuario.empresa,
        rol: req.usuario.rol
    })
}

const mostrar_proveedores_test = async (req, res) => {
    try {
        const proveedores = await Proveedores.findAll(); 
        res.render('finanzas/proveedores', {
            proveedores,
            pagina: 'Proveedores',
            pagina_activa: 'proveedores' });
    } catch (error) {
        console.error("Error al obtener los proveedores:", error);
        res.status(500).send("Error al obtener los proveedores");
    }
};

const mostrar_proveedores = async (req, res) => {
  try {
    const empresaId = req.usuario.empresaId; autenticado
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

const agregar_proveedor = async (req, res) => {
  try {
    const { nombre_proveedor, contacto, direccion, telefono } = req.body;
    const empresaId = req.usuario.empresaId;

    await Proveedores.create({
      empresaId,
      nombre_proveedor,
      contacto,
      direccion,
      telefono,
      fecha_creacion: new Date(),
      fecha_actualizacion: new Date(),
    });

    res.redirect('/finanzas/proveedores');
  } catch (error) {
    console.error("Error al agregar proveedor:", error);
    res.status(500).send("Error al agregar proveedor.");
  }
};

const eliminar_proveedor = async (req, res) => {
  console.log("Solicitud de eliminación recibida para el proveedor ID:", req.params.id);
  try {
    console.log("Solicitud de eliminación recibida para el proveedor ID:", req.params.id);
    const { id } = req.params;
    const empresaId = req.usuario.empresaId;

    const proveedor = await Proveedores.findOne({ where: { id, empresaId } });
    if (!proveedor) {
      return res.status(404).send("Proveedor no encontrado.");
    }

    await proveedor.destroy();
    res.status(200).send("Proveedor eliminado con éxito.");
  } catch (error) {
    console.error("Error al eliminar proveedor:", error);
    res.status(500).send("Error al eliminar proveedor.");
  }
};

const mostrar_precios = async (req, res) => {
  try {
    const productos = await Productos.findAll();
    res.render('finanzas/precios', { productos, pagina: 'Precios', pagina_activa: 'precios' });
  } catch (error) {
    console.error("Error al obtener los precios:", error);
    res.status(500).send("Error al obtener los precios.");
  }
}

export { 
    mostrar_banco,
    mostrar_facturas_recibidas,
    mostrar_facturas_emitidas,
    mostrar_gastos,
    mostrar_proveedores,
    agregar_proveedor,
    eliminar_proveedor,
    mostrar_precios,
    agregar_factura_recibida,
    agregar_factura_emitida,
    agregar_productos_factura_recibida,
    crear_productos_factura_recibida,
};