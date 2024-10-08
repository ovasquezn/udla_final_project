import express from 'express';
import { mostrar_inventario, mostrar_detalle} from '../controllers/inventoryControllers.js'

const router = express.Router();

router.get('/lista_inventario', mostrar_inventario);
router.get('/lista_inventario/:id', mostrar_detalle);

export default router;