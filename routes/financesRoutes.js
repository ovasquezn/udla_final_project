import express from 'express';
import {mostrar_banco, mostrar_facturas, mostrar_gastos, mostrar_proveedores} from '../controllers/financesControllers.js';

const router = express.Router();

router.get('/banco', mostrar_banco);
router.get('/facturas', mostrar_facturas);
router.get('/gastos', mostrar_gastos);
router.get('/proveedores', mostrar_proveedores);

export default router;