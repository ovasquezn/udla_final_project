import express from 'express';
import {mostrar_facturas_recibidas, mostrar_facturas_emitidas, mostrar_clientes, agregar_cliente, editar_cliente, eliminar_cliente, mostrar_proveedores, agregar_proveedor, eliminar_proveedor, editar_proveedor, mostrar_precios, agregar_factura_recibida, agregar_factura_emitida, agregar_productos_factura_recibida, crear_productos_factura_recibida, mostrar_movimientos_bancarios, agregar_movimiento_bancario, editar_movimiento_bancario, eliminar_movimiento_bancario, aprobar_movimiento} from '../controllers/financesControllers.js';
import {verificar_jwt_token} from '../helpers/functions.js';

const router = express.Router();

// Banco
router.get('/movimientos_bancarios', verificar_jwt_token, mostrar_movimientos_bancarios);
router.post('/movimientos_bancarios/aprobar/:id', aprobar_movimiento);
router.post('/movimientos_bancarios/agregar', verificar_jwt_token, agregar_movimiento_bancario);
router.post('/movimientos_bancarios/editar/:id', editar_movimiento_bancario);
router.post('/movimientos_bancarios/eliminar/:id', eliminar_movimiento_bancario);

// Facturas emitidas
router.get('/facturas_emitidas', verificar_jwt_token, mostrar_facturas_emitidas);
router.post('/facturas_emitidas/agregar', verificar_jwt_token, agregar_factura_emitida);

// Facturas recibidas
router.get('/facturas_recibidas', verificar_jwt_token, mostrar_facturas_recibidas);
router.post('/facturas_recibidas/agregar', verificar_jwt_token, agregar_factura_recibida);
router.post('/facturas_recibidas/crear_producto', verificar_jwt_token, crear_productos_factura_recibida);
router.post('/facturas_recibidas/:facturaId/agregar_producto', verificar_jwt_token, agregar_productos_factura_recibida);

//Clientes
router.get('/clientes', verificar_jwt_token, mostrar_clientes);
router.post('/clientes/agregar', verificar_jwt_token, agregar_cliente);
router.post('/clientes/editar/:id', verificar_jwt_token, editar_cliente);
router.post('/clientes/eliminar/:id', eliminar_cliente);

// Precios
router.get('/precios', verificar_jwt_token, mostrar_precios);

// Proveedores
router.get('/proveedores', verificar_jwt_token,mostrar_proveedores);
router.post('/proveedores/agregar', verificar_jwt_token, agregar_proveedor);
router.delete('/proveedores/eliminar/:id', verificar_jwt_token, eliminar_proveedor);
router.post('/proveedores/editar/:id', verificar_jwt_token, editar_proveedor);

export default router;