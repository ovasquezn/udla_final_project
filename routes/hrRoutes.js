import express from 'express';
import { mostrar_colaboradores, agregarTrabajador } from '../controllers/hrControllers.js';
import { verificarToken } from '../helpers/protegerRuta.js';

const router = express.Router();

router.get('/',verificarToken , mostrar_colaboradores);
router.post('/agregar', verificarToken,agregarTrabajador);

export default router;