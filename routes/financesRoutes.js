import express from 'express';
import {mostrar_banco, mostrar_facturas_recibidas, mostrar_facturas_emitidas, mostrar_gastos, mostrar_proveedores, agregar_proveedor, eliminar_proveedor, mostrar_precios, agregar_factura_recibida, agregar_factura_emitida} from '../controllers/financesControllers.js';
import {verificarToken} from '../helpers/protegerRuta.js';

const router = express.Router();

router.get('/banco', verificarToken ,mostrar_banco);

router.get('/facturas_emitidas', verificarToken, mostrar_facturas_emitidas);
router.post('/facturas_emitidas/agregar', verificarToken, agregar_factura_emitida);

router.get('/facturas_recibidas', verificarToken, mostrar_facturas_recibidas);
router.post('/facturas_recibidas/agregar', verificarToken, agregar_factura_recibida);

router.get('/gastos', verificarToken, mostrar_gastos);

router.get('/precios', verificarToken, mostrar_precios);


router.get('/proveedores', verificarToken,mostrar_proveedores);
router.post('/proveedores/agregar', verificarToken, agregar_proveedor);
router.delete('/proveedores/eliminar/:id', verificarToken, eliminar_proveedor);

export default router;