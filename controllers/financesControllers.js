import '../models/relations.js';
import { Productos } from '../models/Productos.js';
import { Facturas, Proveedores, DetalleFacturas } from '../models/relations.js';

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

const mostrar_facturas = async (req, res) => {
    try {
      // Obtener facturas con su proveedor y detalles de factura
      const facturas = await Facturas.findAll({
        include: [
          {
            model: Proveedores,
            as: 'proveedor', // Alias definido en la relación
            attributes: ['nombre_proveedor']
          },
          {
            model: DetalleFacturas,
            as: 'detalle_factura', // Alias definido en la relación
            attributes: ['nombre_producto', 'unidad', 'precio', 'descuento', 'impuestos']
          }
        ]
      });
  
      // Opcional: Solo si necesitas la lista de productos independiente
      const productos = await Productos.findAll();
      const proveedores = await Proveedores.findAll();
  
      // Renderizar la vista con las facturas y sus relaciones ya incluidas
      res.render('finanzas/facturas', {
        productos, // Opcional, si se necesita
        facturas,
        proveedores,
        pagina: 'Facturas',
        pagina_activa: 'facturas'
      });
    } catch (error) {
      console.error('Error al obtener las facturas:', error);
      res.status(500).send('Hubo un error al cargar las facturas.');
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

const mostrar_proveedores = async (req, res) => {
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


export { 
    mostrar_banco,
    mostrar_facturas,
    mostrar_gastos,
    mostrar_proveedores
};