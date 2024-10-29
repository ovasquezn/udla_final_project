import express from 'express';
import { mostrar_inventario, mostrar_detalle} from '../controllers/inventoryControllers.js'
import { verificarToken } from '../helpers/protegerRuta.js';

const router = express.Router();

router.get('/lista_inventario', verificarToken,mostrar_inventario);
router.get('/lista_inventario/:id', verificarToken ,mostrar_detalle);

export default router;