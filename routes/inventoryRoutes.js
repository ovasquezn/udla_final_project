import express from 'express';
import { mostrar_inventario, mostrar_ingresos, mostrar_salidas, mostrar_pedidos, mostrar_productos} from '../controllers/inventoryControllers.js'
import { verificarToken } from '../helpers/protegerRuta.js';

const router = express.Router();

// Pendientes: agregar el middleware verificarToken

router.get('/lista_inventario', verificarToken, mostrar_inventario);
router.get('/productos', verificarToken, mostrar_productos);
router.get('/ingresos', verificarToken,mostrar_ingresos);
router.get('/salidas', verificarToken,mostrar_salidas);
router.get('/pedidos', verificarToken,mostrar_pedidos);
export default router;