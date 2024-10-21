import express from 'express';
import { mostrar_colaboradores, agregarTrabajador } from '../controllers/hrControllers.js';

const router = express.Router();

router.get('/', mostrar_colaboradores);
router.post('/agregar', agregarTrabajador);

export default router;