import express from 'express';
import {mostrar_banco, mostrar_facturas_recibidas, mostrar_facturas_emitidas, mostrar_gastos, mostrar_proveedores, agregar_proveedor, eliminar_proveedor, mostrar_precios, agregar_factura_recibida, agregar_factura_emitida, agregar_productos_factura_recibida, crear_productos_factura_recibida} from '../controllers/financesControllers.js';
import {verificarToken, permiso_nivel_1} from '../helpers/protegerRuta.js';

const router = express.Router();

router.get('/banco', permiso_nivel_1, verificarToken ,mostrar_banco);

router.get('/facturas_emitidas', verificarToken, mostrar_facturas_emitidas);
router.post('/facturas_emitidas/agregar', verificarToken, agregar_factura_emitida);

router.get('/facturas_recibidas', verificarToken, mostrar_facturas_recibidas);
router.post('/facturas_recibidas/agregar', verificarToken, agregar_factura_recibida);
router.post('/facturas_recibidas/crear_producto', verificarToken, crear_productos_factura_recibida);
router.post('/facturas_recibidas/:facturaId/agregar_producto', verificarToken, agregar_productos_factura_recibida);

router.get('/gastos', verificarToken, mostrar_gastos);

router.get('/precios', verificarToken, mostrar_precios);


router.get('/proveedores', verificarToken,mostrar_proveedores);
router.post('/proveedores/agregar', verificarToken, agregar_proveedor);
router.delete('/proveedores/eliminar/:id', verificarToken, eliminar_proveedor);

export default router;