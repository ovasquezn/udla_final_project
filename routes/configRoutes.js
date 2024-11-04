import express from 'express';
import { mostrar_usuarios, crear_usuario } from '../controllers/configControllers.js';
import { verificarToken } from '../helpers/protegerRuta.js';

const router = express.Router();

router.get('/usuarios', verificarToken, mostrar_usuarios);
router.post('/usuarios/agregar_usuario', verificarToken, crear_usuario);

export default router;