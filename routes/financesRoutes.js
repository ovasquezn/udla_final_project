import express from 'express';
import {mostrar_banco, mostrar_facturas, mostrar_gastos, mostrar_proveedores} from '../controllers/financesControllers.js';
import {verificarToken} from '../helpers/protegerRuta.js';

const router = express.Router();

router.get('/banco', verificarToken ,mostrar_banco);
router.get('/facturas', verificarToken, mostrar_facturas);
router.get('/gastos', verificarToken, mostrar_gastos);
router.get('/proveedores', verificarToken,mostrar_proveedores);

export default router;